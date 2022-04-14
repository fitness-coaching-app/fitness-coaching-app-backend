import {db} from '../utils/mongoUtil';

export const find = async (query: object, project: object = {}) => {
    return await db().collection('activities').find(query).project(project).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('activities').findOne(query);
}

export const insertOne = async (document: object) => {
    return await db().collection('activities').insertOne(document);
}

export const updateOne = async (query: object, update: object) => {
    return await db().collection('activities').updateOne(query, update);
}

export const aggregate = (pipeline: object[]) => db().collection('activities').aggregate(pipeline);
