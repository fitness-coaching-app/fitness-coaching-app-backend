import { ObjectId } from 'mongodb';
import { db } from '../utils/mongoUtil';
import * as activities from './activities';

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

export const getFollowingList = async (id: ObjectId) => {
    return await aggregate([
        {
            $match: {
                followerId: id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "followerId",
                foreignField: "_id",
                as: "followerData",
                pipeline: [
                    {
                        $project: {
                            _id: true,
                            displayName: true,
                            profilePicture: true
                        }
                    }
                ]
            }
        },
    ]).toArray();
}

export const getFollowerList = async (id: ObjectId, additionalPipeline: object[] = []) => {
    return await aggregate([
        {
            $match: {
                followingId: id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "followingId",
                foreignField: "_id",
                as: "followingData",
                pipeline: [
                    {
                        $project: {
                            _id: true,
                            displayName: true,
                            profilePicture: true
                        }
                    }
                ]
            }
        },
        ...additionalPipeline
    ]).toArray();
}

export const getActivityFeed = async (id: ObjectId, limit: number = 50) => {
    const [followingIdList] = await aggregate([
        {
            $match: {
                followerId: id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "followingId",
                foreignField: "_id",
                as: "followingData",
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
            $project: {
                followingId: true,
                followingData: {
                    $arrayElemAt: ["$followingData", 0]
                }
            }
        },
        {
            $match: {
                "followingData.userPreference.publishActivityToFollowers": true,
            }
        },
        {
            "$group": { 
                _id: null, 
                followingIds: { "$addToSet": "$followingId" } 
            }
        }
    ]).toArray();
    const followingIds = followingIdList?.followingIds || []

    const result = await activities.aggregate([
        {
            $match: {
                userId: {
                    $in: followingIds
                },
                isPublic: true
            }
        },
        ...activities.lookupCourse,
        ...activities.lookupUserData,
        ...activities.getUserReactionsCommentsListArray,
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $limit: limit
        }
    ]).toArray()
    return result;
}

export const aggregate = (pipeline: object[]) => db().collection('userFollowings').aggregate(pipeline);
