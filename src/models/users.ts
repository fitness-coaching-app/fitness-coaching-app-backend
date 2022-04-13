import { db } from '../utils/mongoUtil';

export const find = async (query: object) => {
    return await db().collection('users').find(query).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('users').findOne(query);
}

export const insertOne = async (document: object) => {
    return await db().collection('users').insertOne(document);
}

export const updateOne = async (query: object, newValue: object) => {
    return await db().collection('users').updateOne(query, { $set: newValue });
}

export const userExists = async (displayName: string): Promise<boolean> => {
    return !!(await db().collection('users').findOne({ displayName }));
}

export const updateEmailVerificationComplete = async (email: string) => {
    return await db().collection('users').updateOne({ email }, { $set: { status: "SETTING_UP" } });
}

export const search = async (query: string[], limit?: number): Promise<object[]> => {
    // insert .* into query string
    for(let i = 0;i < query.length;++i){
        query[i] = ".*" + query[i] + ".*"
    }
    return await (await aggregate([{
        $search: {
            index: "usersindex",
            regex: {
                query: query,
                path: ["displayName", "email"],
                "allowAnalyzedField": true
            }
        }
    },
    {
        $match: { status: "ACTIVE" }
    },
    {
        $project: {
            "_id": true,
            "displayName": true,
            "email": true,
            "status": true,
            "profilePicture": true
        }
    },
    ...(limit ? [{ $limit: limit }] : []), // item limiter
    ])).toArray();
}

export const aggregate = async (pipeline: object[]) => {
    return await db().collection('users').aggregate(pipeline);
}
