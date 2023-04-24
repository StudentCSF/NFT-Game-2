// @ts-ignore
import { ParseServer } from 'parse-server';
import config from './config';
import MoralisAuthAdapter from './api/auth/MoralisAuthAdapter';

export const parseServer = ParseServer({
  databaseURI: config.DATABASE_URI,
  cloud: config.CLOUD_PATH,
  appId: config.APPLICATION_ID,
  masterKey: config.MASTER_KEY,
  serverURL: config.SERVER_URL,
  auth: {
    moralis: {
      module: MoralisAuthAdapter,
    },
  },
});