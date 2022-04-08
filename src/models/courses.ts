import {db} from '../utils/mongoUtil';

export const find = async (query: object) => {
    return await db().collection('courses').find(query).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('courses').findOne(query);
}

export const updateOne = async (query: object, update: object) => {
    return await db().collection('courses').updateOne(query, update);
}
