import * as mongoUtil from '../utils/mongoUtil';

export const find = async (query: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('users').find(query).toArray();
}

export const findOne = async (query: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('users').findOne(query);
}

export const insertOne = async (document: object) => {
    let db = mongoUtil.getDB();
    return await db.collection('users').insertOne(document);
}

export const userExists = async (displayName: string) => {
    let db = mongoUtil.getDB();
    return !!(await db.collection('users').findOne({displayName}));
}

export const updateEmailVerificationComplete = async (email: string) => {
    let db = mongoUtil.getDB();
    return await db.collection('users').updateOne({email}, {$set: {status: "SETTING_UP"}});
}
