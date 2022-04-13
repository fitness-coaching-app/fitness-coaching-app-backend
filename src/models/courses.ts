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

export const search = async (query: string[], limit?: number): Promise<object[]> => {
    // insert .* into query string
    for(let i = 0;i < query.length;++i){
        query[i] = ".*" + query[i] + ".*"
    }
    return await (await aggregate([{
            $search: {
                index: "coursesindex",
                regex: {
                    query: query,
                    path: ["category", "description", "name"],
                    "allowAnalyzedField": true
                }
            }
        },
        ...(limit? [{$limit: limit}]: []) // item limiter
        ])).toArray();
}

export const aggregate = async (pipeline: object[]) => {
    return await db().collection('courses').aggregate(pipeline);
}