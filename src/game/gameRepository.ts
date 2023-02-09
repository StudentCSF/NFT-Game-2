import config from '../config'
import * as mongoDB from 'mongodb'

const COLLECTION_MAIN = 'NFTDinoMain';
const COLLECTION_SCORE = 'NFTDinoScore';

export async function findOneByRarity(rarity: string) {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(config.DATABASE_URI);
    await client.connect();
    const db: mongoDB.Db = client.db(config.DATABASE_NAME);
    const collection: mongoDB.Collection = db.collection(COLLECTION_MAIN);
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`);
    const result = await collection.findOne({
        rarity: rarity
    });
    client.close();
    return result;
}

export async function setHighScore(address: string, highScore: number) {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(config.DATABASE_URI);
    await client.connect();
    const db: mongoDB.Db = client.db(config.DATABASE_NAME);
    const collection: mongoDB.Collection = db.collection(COLLECTION_SCORE)
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`);
    const exists = await collection.findOne({
        address: address
    });
    let result: boolean = false;
    if (exists) {
        const oldHighScore = exists.highScore;
        if (highScore > oldHighScore) {
            await collection.updateOne({
                address: address
            }, {
                $set: {
                    highScore: highScore
                }
            });
            result = true;
        }
    } else {
        await collection.insertOne({
            address: address,
            highScore: highScore
        });
    }
    client.close();
    return result;
}

export async function getHighScore(address: string) {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(config.DATABASE_URI);
    await client.connect();
    const db: mongoDB.Db = client.db(config.DATABASE_NAME);
    const collection: mongoDB.Collection = db.collection(COLLECTION_SCORE)
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`);
    const exists = await collection.findOne({
        address: address
    });
    if (exists) {
        return exists.highScore
    } else {
        return -1;
    }
}