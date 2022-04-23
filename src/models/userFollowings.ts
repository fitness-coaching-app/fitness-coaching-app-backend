import {db} from '../utils/mongoUtil';

export const find = async (query: object, project: object = {}) => {
    return (await db().collection('userFollowings').find(query).project(project)).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('userFollowings').findOne(query);
}

export const insertOne = async (document: object) => {
    return await db().collection('userFollowings').insertOne(document);
}

export const updateOne = async (query: object, update: object) => {
    return await db().collection('userFollowings').updateOne(query, update);
}

export const deleteOne = async (query: object) => {
    return await db().collection('userFollowings').deleteOne(query);
}

export const aggregate = (pipeline: object[]) => db().collection('userFollowings').aggregate(pipeline);
