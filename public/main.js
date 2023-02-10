import { startGame } from "./game.js";

/* global axios ethers */
// var baseUri;
// if (window.location.host == '127.0.0.1:5500') {
//   const baseUri = 'http://127.0.0.1:1337/api/';
// } else {
//   const baseUri = 'https://nft-game-2.vercel.app/api/';
// }

const AUTH_API_URL = `https://nft-game-2.vercel.app/api/auth`;
const GAME_API_URL = `https://nft-game-2.vercel.app/api/game`;

export var SIGNER;

const elError = document.getElementById('error');
const elUser = document.getElementById('user');
const elBtnMetamask = document.getElementById('auth-metamask');
const elBtnAnonym = document.getElementById('anonym');
const elAuthAs = document.getElementById('auth-as');
// const elTest = document.getElementById('test');
const elGame = document.getElementById('game');
// console.log(window.ethereum);

export const handleApiPost = async (endpoint, params) => {
  const result = await axios.post(`${AUTH_API_URL}/${endpoint}`, params, {
    headers: {
      'Content-Type': 'application/json',
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
  // if (endpoint == 'reward') {
  //   console.log(result.data);
  // }
  return result.data;
};

// const test = () =>
//   handleGameApiPost(
//     'test', {}
//   );

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

  //renderUser(user);
  renderGame(user);
};

// const handleTest = async () => {
//   const { res } = await test();
//   console.log(res);
// }

const renderGame = (user) => {
  // console.log(user);
  // localStorage.setItem('sessionToken', user.authData.moralis)
  // console.log(user.authData.moralis['address']);
  if (user) {
    elAuthAs.innerHTML = `Authenticated as ${user.authData.moralis['address']}`;
  } else {
    elAuthAs.innerHTML = 'You are not authenticated';
  }
  startGame(user);
}

// const renderUser = (user) => {
//   elUser.innerHTML = user ? JSON.stringify(user, null, 2) : '';
// };

const renderError = (error) => {
  elError.innerHTML = error ? JSON.stringify(error.message, null, 2) : '';
};

function init() {
  elBtnMetamask.addEventListener('click', async () => {
    handleAuth().catch((error) => renderError(error));
  });

  elBtnAnonym.addEventListener('click', async () => {
    renderGame(null);
  })

  // renderGame();

  // elTest.addEventListener('click', async () => {
  //   handleTest().catch((error) => renderError(error));
  // });

}

window.addEventListener('load', () => {
  init();
});