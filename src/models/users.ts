import * as mongoUtil from '../utils/mongoUtil';

export const find = async (query: object): Promise<Array<any>> => {
    let db = mongoUtil.getDB();
    return await db.collection('users').find(query).toArray();
}

export const insertOne = async (document: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('users').insertOne(document);
}
