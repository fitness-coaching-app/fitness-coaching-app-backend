import { db } from '../utils/mongoUtil';

export const find = async (query: object) => {
    return await db().collection('courses').find(query).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('courses').findOne(query);
}

export const updateOneAggregate = async (query: object, update: object) => {
    return await db().collection('courses').updateOne(query, [
        update,
        { $set: { overallRating: { $avg: "$ratings.rating" } } }
    ]);
}

export const distinct = async (field: string) => {
    return await db().collection('courses').distinct(field);
}

export const search = async (query: string[], filter?: any, limit?: number): Promise<object[]> => {
    // insert .* into query string
    for (let i = 0; i < query.length; ++i) {
        query[i] = ".*" + query[i] + ".*"
    }
    let match = {}
    if (filter) {
        match = {
            $match: {
                ...(filter?.category ? {
                    category: filter.category
                } : {}),
                ...(filter?.bodyParts ? {
                    bodyParts: {
                        $in: filter.bodyParts
                    }
                } : {}),
                ...(filter?.minDuration || filter?.maxDuration ? {
                    duration: {
                        ...(filter?.minDuration ? { $gte: filter?.minDuration } : {}),
                        ...(filter?.maxDuration ? { $lte: filter?.maxDuration } : {}),
                    }
                } : {}),
                ...(filter?.difficulty ? {
                    difficulty: {
                        $in: filter?.difficulty
                    }
                } : {}),
                ...(filter?.minRating || filter?.maxRating ? {
                    overallRating: {
                        ...(filter?.minRating ? { $gte: filter?.minRating } : {}),
                        ...(filter?.maxRating ? { $lte: filter?.maxRating } : {}),
                    }
                } : {})
            }
        }
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
        match,
    {
        $project: {
            "ratings": false
        }
    },
    ...(limit ? [{ $limit: limit }] : []) // item limiter
    ])).toArray();
}

export const aggregate = async (pipeline: object[]) => {
    return await db().collection('courses').aggregate(pipeline);
}