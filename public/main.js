import { startGame } from "./game.js";

const AUTH_API_URL = `http://127.0.0.1:1337/api/auth`;
const GAME_API_URL = `http://127.0.0.1:1337/api/game`;

// const AUTH_API_URL = `https://nft-game-2.vercel.app/api/auth`;
// const GAME_API_URL = `https://nft-game-2.vercel.app/api/game`;

export var SIGNER;

const elError = document.getElementById('error');
const elUser = document.getElementById('user');
const elBtnMetamask = document.getElementById('auth-metamask');
const elBtnAnonym = document.getElementById('anonym');
const elAuthAs = document.getElementById('auth-as');
const elGame = document.getElementById('game');
const elAbout = document.getElementById('about');

export const handleApiPost = async (endpoint, params) => {
  const result = await axios.post(`${AUTH_API_URL}/${endpoint}`, params, {
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return result.data;
};

export const handleGameApiPost = async (endpoint, params) => {
  const result = await axios.post(`${GAME_API_URL}/${endpoint}`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return result.data;
};

const requestMessage = (account, networkType, chain) =>
  handleApiPost('request-message', {
    address: account,
    chain,
    networkType,
  });

const verifyMessage = (message, signature, networkType) =>
  handleApiPost('sign-message', {
    message,
    signature,
    networkType,
  });

const connectToMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

  const [accounts, chainId] = await Promise.all([
    provider.send('eth_requestAccounts', []),
    provider.send('eth_chainId', []),
  ]);

  const signer = provider.getSigner();
  return { signer, chain: chainId, account: accounts[0] };
};

const handleAuth = async () => {
  // Connect to Metamask
  const { signer, chain, account } = await connectToMetamask();

  SIGNER = signer;

  if (!account) {
    throw new Error('No account found');
  }
  if (!chain) {
    throw new Error('No chain found');
  }

  const { message } = await requestMessage(account, 'evm', chain);

  const signature = await signer.signMessage(message);

  const { user } = await verifyMessage(message, signature, 'evm');
  return user;
};

const renderGame = (user) => {
  if (user) {
    elAuthAs.innerHTML = `Авторизован как ${user.authData.moralis['address']}`;
  } else {
    elAuthAs.innerHTML = 'Вы не авторизованы';
  }
  startGame(user);
}

const renderError = (error) => {
  elError.innerHTML = error ? JSON.stringify(error.message, null, 2) : '';
};

function init() {
  elBtnMetamask.addEventListener('click', async () => {
    const user = await handleAuth().catch((error) => renderError(error));
    elAbout.style.display = 'none';
    renderGame(user);
  });

  elBtnAnonym.addEventListener('click', async () => {
    elAbout.style.display = 'none';
    renderGame(null);
  })
}

window.addEventListener('load', () => {
  init();
});