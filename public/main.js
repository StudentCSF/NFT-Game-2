/* global axios ethers */

const AUTH_API_URL = 'http://127.0.0.1:1337/api/auth';

const elError = document.getElementById('error');
const elUser = document.getElementById('user');
const elBtnMetamask = document.getElementById('auth-metamask');

const handleApiPost = async (endpoint, params) => {
  const result = await axios.post(`${AUTH_API_URL}/${endpoint}`, params, {
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

  if (!account) {
    throw new Error('No account found');
  }
  if (!chain) {
    throw new Error('No chain found');
  }

  const { message } = await requestMessage(account, 'evm', chain);

  const signature = await signer.signMessage(message);

  const { user } = await verifyMessage(message, signature, 'evm');

  renderUser(user);
};

const renderUser = (user) => {
  elUser.innerHTML = user ? JSON.stringify(user, null, 2) : '';
};

const renderError = (error) => {
  elError.innerHTML = error ? JSON.stringify(error.message, null, 2) : '';
};

function init() {
  elBtnMetamask.addEventListener('click', async () => {
    handleAuth().catch((error) => renderError(error));
  });
}

window.addEventListener('load', () => {
  init();
});