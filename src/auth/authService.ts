import Moralis from 'moralis';
import { authRequests } from '../store';
import { ParseServerRequest } from '../utils/ParseServerRequest';

const serverRequest = new ParseServerRequest();

interface ParseUser {
  objectId: string;
}

export interface RequestMessage {
  address: string;
  chain: string;
  network: string;
}

const DOMAIN = '127.0.0.1:5500';
const STATEMENT = 'Please sign this message to confirm your identity.';
const URI = 'https://127.0.0.1:5500';
const EXPIRATION_SESSION_HOURS_TIME = 24;
const TIMEOUT = 15;

export async function requestMessage({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain?: string;
  networkType: 'evm';
}) {
  if (chain) {
    return requestMessageEvm({ address, chain, networkType });
  }
  throw new Error(`Invalid network: ${networkType}`);
}

async function requestMessageEvm({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: 'evm';
}) {
  let date = new Date();
  date.setHours(date.getHours() + EXPIRATION_SESSION_HOURS_TIME);
  const result = await Moralis.Auth.requestMessage({
    address,
    chain,
    networkType,
    domain: DOMAIN,
    statement: STATEMENT,
    uri: URI,
    expirationTime: date.toISOString(),
    timeout: TIMEOUT,
  });

  const { message, id, profileId } = result.toJSON();
  authRequests.set(message, { id, profileId });

  return message;
}

export interface VerifyMessage {
  network: string;
  signature: string;
  message: string;
}

export async function verifyMessage({ network, signature, message }: VerifyMessage) {
  const storedData = authRequests.get(message);

  if (!storedData) {
    throw new Error('Invalid message');
  }

  const { id: storedId, profileId: storedProfileId } = storedData;

  const authData = {
    id: storedProfileId,
    authId: storedId,
    message,
    signature,
    network,
  };

  const user = await serverRequest.post<ParseUser>({
    endpoint: `/users`,
    params: {
      authData: {
        moralis: authData,
      },
    },
    useMasterKey: true,
  });

  await serverRequest.put({
    endpoint: `users/${user.objectId}`,
    params: {
      moralisProfileId: storedProfileId,
    },
    useMasterKey: true,
  });

  const updatedUser = await serverRequest.get({
    endpoint: `users/${user.objectId}`,
    useMasterKey: true,
  });

  return updatedUser;
}