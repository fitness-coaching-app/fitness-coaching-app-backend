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

export const getUserReactionsCommentsListArray = [
    {
        $lookup: {
            from: "users",
            localField: "reactions.userId",
            foreignField: "_id",
            as: "userReactionsList",
            pipeline: [
                {
                    $project: {
                        _id: false,
                        k: {
                            $toString: "$_id"
                        },
                        v: {
                            displayName: "$displayName",
                            profilePicture: "$profilePicture"
                        }
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
            as: "userCommentsList",
            pipeline: [
                {
                    $project: {
                        _id: false,
                        k: {
                            $toString: "$_id"
                        },
                        v: {
                            displayName: "$displayName",
                            profilePicture: "$profilePicture"
                        }
                    }
                }
            ]
        }
    },
    {
        $set: {
            "userCommentsList": {
                "$arrayToObject": "$userCommentsList"
            },
            "userReactionsList": {
                "$arrayToObject": "$userReactionsList"
            }
        }
    }
];

export const lookupUserData = {
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
        };

export const lookupCourse = {
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
            };



export const getUserActivity = async (id: ObjectId) => {
    return await aggregate(
        [
            {
                $match: {
                    userId: id
                }
            },
            lookupCourse,
            lookupUserData,
            ...getUserReactionsCommentsListArray,
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
            }
        },
        lookupCourse,
        lookupUserData,
        ...getUserReactionsCommentsListArray,
        {
            $set: {
                userData: {
                    $arrayElemAt: ["$userData", 0]
                }
            }
        },
    ]).toArray();
}

export const aggregate = (pipeline: object[]) => db().collection('activities').aggregate(pipeline);
