import Moralis from 'moralis';
import fetch from "node-fetch"
// import Web3 from 'web3';
// import { AbiItem } from 'web3-utils'
import { findOneByRarity as findOneByRarity, setHighScore, getHighScore } from "./gameRepository"

// declare const Parse: any;

// const CONTRACT_ADDRESS = '0xb2Fbda96A8A0fd389a0E90aeA00C84Dccf0B4d29';
// const CONTRACT_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "inputs": [], "name": "buyOneLife", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_tokenUrl", "type": "string" }], "name": "mintItem", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "Received", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "smartContractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }];
const CHAIN_ID = '80001';

const SCORE_RARITY_MAP: Map<number, string> = new Map([
    [-1, 'none'],
    [1, 'usual'],
    [10, 'unusual'],
    [50, 'rare'],
    [100, 'unique'],
    [500, 'epic'],
    [1000, 'mythical'],
    [5000, 'legendary']
]);

const RARITY_SCORE_MAP: Map<string, number> = new Map([
    ['none', -1],
    ['usual', 1],
    ['unusual', 10],
    ['rare', 50],
    ['unique', 100],
    ['epic', 500],
    ['mythical', 1000],
    ['legendary', 5000]
]);

async function getDataFromUrl(url: string) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

export async function findPlayerUrl(address: string) {
    const chain = CHAIN_ID;

    let nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain
    });

    console.log(nfts.result);

    let playerUrl = null;
    let imU = null;
    let maxk = 0;
    let lifesCount = 1;
    let rank = null;
    let tad;
    for (let i in nfts.result) {
        // console.log(nfts.result[i].name);
        if (nfts.result[i].name != 'Dino chrome NFT game 2') {
            continue;
        }
        // tad = nfts.result[i].metadata;
        // console.log(tad);
        // if (!tad) {
        //     return null;
        // }
        // if (!tad) {
            let uri = nfts.result[i].tokenUri;
            console.log(uri);
            if (uri) {
                tad = await getDataFromUrl(uri);
                console.log();
                // tad = tad.replaceAll("\\", "");
            }
        // }
        if (!tad || !tad.rarity) {
            continue;
        }
        let mtd = tad;
        // if (tad) {
        //     mtd = JSON.parse(tad.toString());
        // }
        if (!mtd) {
            return null;
        }
        console.log(tad);
        // let rank = tad.rarity;
        let scoreValue = RARITY_SCORE_MAP.get(tad.rarity.toLowerCase());
        if (scoreValue) {
            if (scoreValue > maxk) {
                maxk = scoreValue;
                rank = tad.rarity;
                imU = tad.image;
                lifesCount = tad.lifesCount;
            }
        }
        playerUrl = imU;
    }

    let highScore = await getHighScore(address);
    if (highScore < 0) {
        await setHighScore(address, 0);
        highScore = 0;
    }
    console.log(`url ${playerUrl}`);
    if (playerUrl) {
        console.log('yes');
        return {
            rank: rank,
            playerUrl: playerUrl,
            highScore: highScore,
            lifesCount: lifesCount
        };
    }
    return null;
}

export async function rewardHandler(score: number) {
    console.log(score);
    let rew = 0;
    for (let [key, value] of SCORE_RARITY_MAP) {
        if (score >= key && key > rew) {
            rew = key;
        }
    }
    let rewRar = SCORE_RARITY_MAP.get(rew);
    if (!rewRar) {
        console.log(111);
        return null;
    }
    let rewScore = RARITY_SCORE_MAP.get(rewRar);
    console.log(rewScore);
    if (!rewScore) {
        console.log(222);
        return null;
    }
    // if (rewScore <= rankScore) {
    //     console.log(333);
    //     return false;
    // }
    console.log(score, rewRar);
    if (rewRar != undefined) {
        let rewParams = {
            score: score,
            rewRar: rewRar
        }
        let res = await buildMetadata(rewParams);
        console.log(`res ${res}`);
        if (res) {
            return res;
            // try {
            //     // const web3 = new Web3(new ethers.JsonRpcSigner);
            //     // const sgn = await ethers.Signe()
            //     // const provider = new JsonRpcProvider();
            //     // const signer = await provider.getSigner();
            //     const web3 = new Web3(Web3.givenProvider);
            //     console.log(web3);
            //     // const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            //     // contract.connect(signer)
            //     // ;
            //     // console.log(contract);
            //     // const contract = new web3.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS);
            //     // await contract.mintItem(res);//.send({from: CONTRACT_ADDRESS});
            //     console.log(555);
            //     return true;
            // } catch (e) {
            //     console.log(e);
            //     console.log(444);
            //     return false;
            // }
        } else {
            console.log(666);
            return null;
        }
    }
}

async function buildMetadata(request: any) {
    const result = await findOneByRarity(request.rewRar);
    console.log(result);
    if (result) {
        const received = new Date().toISOString();
        const description = `Dino NFT Game 2 ${result.rarity} game character.\nIt has ${result.lifesCount} lifes.\nReceived: ${received}.`;
        let metadata = {
            name: result.name,
            description: description,
            image: result.imageUrl,
            rarity: result.rarity,
            lifesCount: result.lifesCount,
            received: received
        };

        const base64Data = btoa(JSON.stringify(metadata));

        // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!         ${base64Data}`);
        const abi = [
            {
                path: 'dino-nft-game-2.json',
                content: base64Data,
            },
        ];
        try {
            let metaFile = await Moralis.EvmApi.ipfs.uploadFolder({
                abi
            });

            let metadataUrl = metaFile.result[0]['path'];
            console.log(metaFile);
            return metadataUrl;
        } catch (e) {
            console.log(e);
        }
    } else {
        return null;
    }



    // query.equalTo("rarity", request.rewRar);
    // let results = await query.find();
    // console.log(results);
    // if (results.length > 0) {
    //     let object = results[0];
    //     let attrs = object.attributes;

    //     let metadata = {
    //         name: attrs.name,
    //         description: `${attrs.rarity} game character from Dino NFT Game 2`,
    //         image: attrs.imageUrl,
    //         lifesCount: attrs.lifesCount,
    //         received: new Date().toISOString(),
    //         score: request.score
    //     };

    //     let base64Data = Buffer
    //         .from(
    //             JSON.stringify(metadata),
    //             'base64'
    //         )
    //         .toString('base64');

    //     // let metaFile = await Moralis.Cloud.toIpfs({
    //     //     sourceType: "base64",
    //     //     source: base64
    //     // });
    //     const abi = [
    //         {
    //             path: 'dino-nft-game-2.json',
    //             content: base64Data,
    //         },
    //     ];
    //     try {
    //         let metaFile = await Moralis.EvmApi.ipfs.uploadFolder({
    //             abi
    //         });

    //         let metadataUrl = metaFile.result[0]['path'];
    //         console.log(metaFile);
    //         return metadataUrl;
    //     } catch(e) {
    //         console.log(e);
    //     }
    // }
    // return null;
}

export async function putHighScore(address: string, highScore: number) {
    const result = await setHighScore(address, highScore);
    return result;
}

// async function lookHighScore(address: string) {
//     const result = await getHighScore(address);

//     return result;
// }


// export async function testIPFS() {
//     let metadata = {
//         name: 'attrs.name',
//         description: 'attrs.rarity',
//         image: 'attrs.imageUrl'
//     };

//     let base64 = btoa(JSON.stringify(metadata));

//     const abi = [
//         {
//             path: `${base64}.json`,
//             content: base64,
//         },
//     ];
//     try {
//         let metaFile = await Moralis.EvmApi.ipfs.uploadFolder({
//             abi
//         });
//         console.log(metaFile.result[0]['path']);
//         return metaFile.result;
//     } catch (e) {
//         return e;
//     }
// }