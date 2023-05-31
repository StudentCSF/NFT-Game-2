import Moralis from 'moralis';
import { findOneByRarity as findOneByRarity, setHighScore, getHighScore } from "./gameRepository"
import axios from 'axios'
import { UploadFolderRequest } from '@moralisweb3/common-evm-utils';

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

const NFT_COLLECTION_NAME: string = 'Dino chrome NFT game 2';

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
    let imageUrl = null;
    let maxScore = 0;
    let lifesCount = 1;
    let rank = null;
    let nftMetadata;
    for (let i in nfts.result) {
        if (nfts.result[i].name != NFT_COLLECTION_NAME) {
            continue;
        }
        let uri = nfts.result[i].tokenUri;
        console.log(uri);
        if (uri) {
            nftMetadata = await getDataFromUrl(uri);
            console.log(`tad:  ${nftMetadata}\n`);
        }
        if (!nftMetadata || !nftMetadata.rarity) {
            continue;
        }
        console.log(nftMetadata);
        let scoreValue = RARITY_SCORE_MAP.get(nftMetadata.rarity.toLowerCase());
        if (scoreValue) {
            if (scoreValue > maxScore && nftMetadata.image) {
                maxScore = scoreValue;
                rank = nftMetadata.rarity;
                imageUrl = nftMetadata.image;
                lifesCount = nftMetadata.lifesCount;
            }
        }
        playerUrl = imageUrl;
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

export async function rewardHandler(address: string, rank: string, score: number) {
    const highScore = await getHighScore(address);
    if (highScore > score) {
        return null;
    }
    console.log(rank)
    console.log(score);
    const rewScorePrev = RARITY_SCORE_MAP.get(rank);
    if (!rewScorePrev) {
        return null;
    }
    let rewScoreCurr = rewScorePrev;
    for (let [key, value] of SCORE_RARITY_MAP) {
        if (score >= key && key > rewScoreCurr) {
            rewScoreCurr = key;
        }
    }
    if (rewScoreCurr <= rewScorePrev) {
        return null;
    }
    let rewRar = SCORE_RARITY_MAP.get(rewScoreCurr);
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
        let url = await uploadMetadata(rewParams);
        console.log(`res ${url}`);
        if (url) {
            return url;
        } else {
            console.log(666);
            return null;
        }
    }
    return null;
}

async function uploadMetadata(request: any) {
    const baseMetadata = await findOneByRarity(request.rewRar);
    console.log(baseMetadata);
    if (baseMetadata) {
        const received = new Date().toISOString();
        const description = `Dino NFT Game 2 ${baseMetadata.rarity} game character.\nIt has ${baseMetadata.lifesCount} lifes.\nReceived: ${received}.`;
        let metadata = {
            name: baseMetadata.name,
            description: description,
            image: baseMetadata.imageUrl,
            rarity: baseMetadata.rarity,
            lifesCount: baseMetadata.lifesCount,
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