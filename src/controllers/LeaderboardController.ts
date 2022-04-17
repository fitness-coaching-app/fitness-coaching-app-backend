import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import models from '../models'
import { success } from '../utils/responseApi'


export const globalLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { limit, start } = req.query as any;
		const result = await (await models.users.aggregate([{
			$match: {
				status: "ACTIVE"
			}
		},
		{
			$sort: {
				xp: -1,
				displayName: 1
			}
		},
		{
			$skip: start - 1
		},
		{
			$limit: limit
		},
		{
			$project: {
				_id: true,
				displayName: true,
				profilePicture: true,
				xp: true
			}
		}
		])).toArray();

		res.status(200).send(success(res.statusCode, "Global leaderboard fetched successfully", result))
	} catch (e) {
		next(e);
	}
}

export const followingUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: any = req.user!;
		const { limit, start } = req.query as any;
		const followingList = await models.userFollowings.find({ followerId: new ObjectId(user._id) });
		const followingListObjectId: ObjectId[] = [];
		for (let i of followingList) {
			followingListObjectId.push(i.followingId);
		}
		console.log(followingListObjectId);

		const results = await (await models.users.aggregate([{
			$match: {
				_id: {
					$in: followingListObjectId
				},
				status: "ACTIVE"
			}
		},
		{
			$sort: {
				xp: -1,
				displayName: 1
			}
		},
		{
			$skip: start - 1
		},
		{
			$limit: limit
		},
		{
			$project: {
				_id: {
					$toString: "$_id"
				},
				displayName: true,
				profilePicture: true,
				xp: true
			}
		}
		])).toArray();

		res.status(200).send(success(res.statusCode, "Following user leaderboard fetched successfully", results))
	} catch (e) {
		next(e)
	}
}


