import {MongoClient} from 'mongodb';
import config from '../config';

const uri: string = config.mongoDB.uri ? config.mongoDB.uri : "";

let _db: any;

export const connect = async () => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log("Connected to MongoDB Cluster");

        _db = client.db('fcadb');
    } catch (e) {
        console.log(e)
    }
}

export const getDB = () => _db;


