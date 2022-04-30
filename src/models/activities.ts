import { ObjectId } from 'mongodb';
import { db } from '../utils/mongoUtil';

export const find = async (query: object, project: object = {}) => {
    return await db().collection('activities').find(query).project(project).toArray();
}

export const findOne = async (query: object) => {
    return await db().collection('activities').findOne(query);
}

export const insertOne = async (document: object) => {
    return await db().collection('activities').insertOne(document);
}

export const insertMany = async (document: object[]) => {
    return await db().collection('activities').insertMany(document);
}

export const updateOne = async (query: object, update: object) => {
    return await db().collection('activities').updateOne(query, update);
}

export const fn = async () => {
    return await db().collection('activities');
}

export const getUserActivity = async (id: ObjectId) => {
    return await aggregate(
        [
            {
                $match: {
                    userId: id
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "data.courseId",
                    foreignField: "_id",
                    as: "course",
                    pipeline: [
                        {
                            $project: {
                                _id: true,
                                name: true,
                                difficulty: true,
                                coverPicture: true
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reactions.userId",
                    foreignField: "_id",
                    as: "userReactionsNameList",
                    pipeline: [
                        {
                            $project: {
                                _id: false,
                                k: {
                                    $toString: "$_id"
                                },
                                v: "$displayName"
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.userId",
                    foreignField: "_id",
                    as: "userCommentsNameList",
                    pipeline: [
                        {
                            $project: {
                                _id: false,
                                k: {
                                    $toString: "$_id"
                                },
                                v: "$displayName"
                            }
                        }
                    ]
                }
            },
            {
                $set: {
                    "userCommentsNameList": {
                        "$arrayToObject": "$userCommentsNameList"
                    },
                    "userReactionsNameList": {
                        "$arrayToObject": "$userReactionsNameList"
                    }
                }
            },
            {
                $set: {
                    course: {
                        $arrayElemAt: ["$course", 0]
                    }
                }
            },
            {
                $sort: {
                    timestamp: -1
                }
            }
        ]

    ).toArray();
}

export const getPublicActivityById = async (id: ObjectId) => {
    return await aggregate([
        {
            $match: { 
                _id: id,
                isPublic: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
                pipeline: [
                    {
                        $project: {
                            _id: true,
                            displayName: true,
                            profilePicture: true,
                            userPreference: {
                                publishActivityToFollowers: true
                            }
                        }
                    }
                ]
            }
        },
        {
            $set: {
                userData: {
                    $arrayElemAt: ["$userData", 0]
                }
            }
        },
        {
            $match: {
                "userData.userPreference.publishActivityToFollowers": true
            }
        }
    ]).toArray();
}

export const aggregate = (pipeline: object[]) => db().collection('activities').aggregate(pipeline);
