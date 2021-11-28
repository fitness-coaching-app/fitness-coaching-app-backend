import * as mongoUtil from '../utils/mongoUtil';

export const find = async (query: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('courses').find(query).toArray();
}

export const findOne = async (query: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('courses').findOne(query);
}