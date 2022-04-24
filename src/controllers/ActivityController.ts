import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb';
import models from '../models'
import { error, ErrorCode, success } from '../utils/responseApi'


export const feed = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: any = req.user!;
		const result = await models.userFollowings.getActivityFeed(user._id);

		res.status(200).send(success(res.statusCode, "Get activity feed successfully", result))
	} catch (e) {
		next(e);
	}
}

export const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const activityId = req.params.activityId as string;
		const activity = await models.activities.aggregate([
			{
				$match: { 
					_id: new ObjectId(activityId),
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
            	$match:{
            		"userData.userPreference.publishActivityToFollowers": true
            	}
            }
		]).toArray();

		if (activity === null) {
			res.status(400).send(error(res.statusCode, "Activity not found", [ErrorCode.notFound]));
		}
		else {
			res.status(200).send(success(res.statusCode,"Activity fetched successfully",activity));
		}
	} catch (e) {
		next(e);
	}
} 