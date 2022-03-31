import {db} from '../utils/mongoUtil';

export const find = async (query: object) => {
    return await db().collection('sections').find(query).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('sections').findOne(query);
}