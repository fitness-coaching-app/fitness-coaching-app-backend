import {db} from '../utils/mongoUtil';

export const find = async (query: object, project: object = {}) => {
    return await db().collection('news').find(query).project(project).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('news').findOne(query);
}

export const insertOne = async (document: object) => {
    return await db().collection('news').insertOne(document);
}

export const updateOne = async (query: object, update: object) => {
    return await db().collection('news').updateOne(query, update);
}

export const aggregate = (pipeline: object[]) => db().collection('news').aggregate(pipeline);
