import {Db, MongoClient} from 'mongodb';
import config from '../config';
import { MongoMemoryServer } from 'mongodb-memory-server';

let uri: string = config.mongoDB.uri ? config.mongoDB.uri : "";

let _db: Db;
let _client: MongoClient;

export const connect = async () => {
    try {
        if(config.environment === "TEST"){
            let mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }
        _client = new MongoClient(uri);
        await _client.connect();
        await _client.db("admin").command({ping: 1});
        console.log(`MongoDB - Connected [NODE_ENV=${config.environment}]`);

        _db = _client.db('fcadb');
    } catch (e) {
        console.log(e)
    }
}

export const client = (): MongoClient => _client;
export const db = (): Db => _db;
export const isConnected = () => {
    return !!_db;
}


