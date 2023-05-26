import Moralis from 'moralis';
import { findOneByRarity as findOneByRarity, setHighScore, getHighScore } from "./gameRepository"
import axios from 'axios'

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
    let response = await axios.get(url);
    let data = response.data;
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
        if (nfts.result[i].name != 'Dino chrome NFT game 2') {
            continue;
        }
        let uri = nfts.result[i].tokenUri;
        console.log(uri);
        if (uri) {
            tad = await getDataFromUrl(uri);
            console.log(`tad:  ${tad}\n`);
        }
        if (!tad || !tad.rarity) {
            continue;
        }
        let mtd = tad;
        if (!mtd) {
            return null;
        }
        console.log(tad);
        let scoreValue = RARITY_SCORE_MAP.get(tad.rarity.toLowerCase());
        if (scoreValue) {
            if (scoreValue > maxk && tad.image) {
                maxk = scoreValue;
                rank = tad.rarity;
                imU = tad.image;
                lifesCount = tad.lifesCount;
            }
        }
        playerUrl = imU;
    }
    console.log(123);
    let highScore = await getHighScore(address);
    console.log(31);
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

export async function rewardHandler(address: string, score: number) {
    const highScore = await getHighScore(address);
    if (highScore > score) {
        return null;
    }

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
}

export async function putHighScore(address: string, highScore: number) {
    const result = await setHighScore(address, highScore);
    return result;
}