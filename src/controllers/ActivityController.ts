import { NextFunction, Request, Response } from 'express'
import models from '../models'
import { success } from '../utils/responseApi'


export const feed = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: any = req.user!;
		const [{ followingIds }] = await models.userFollowings.aggregate([
			{
				$match: {
					followerId: user._id
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
		const result = await models.activities.aggregate([
			{
				$match: {
					userId: {
						$in: followingIds
					},
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
								displayName: true,
								profilePicture: true,
							}
						}
					]
				}
			},
			{
				$project: {
					userId: true,
					activityType: true,
					timestap: true,
					isPublic: true,
					data: true,
					reactions: true,
					comments: true,
					userData: {
						$arrayElemAt: ["$userData", 0]
					}
				}
			},
			{
				$sort: {
					timestamp: -1
				}
			},
			{
				$limit: 50
			}
		]).toArray()

		res.status(200).send(success(res.statusCode, "Get activity feed successfully", result))
	} catch (e) {
		next(e);
	}
}