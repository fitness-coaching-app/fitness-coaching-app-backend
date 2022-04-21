import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import models from '../models'
import { success } from '../utils/responseApi'


export const fetch = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.query.userId as string;
		const results = await models.news.aggregate([
			{
				$project: {
					_id: true,
					title: true,
					coverPicture: true,
					data: true,
					userIdLike: {
						$filter: {
							input: "$likes",
							as: "like",
							cond: {
								$eq: ["$$like.userId", new ObjectId(userId)]
							}
						}
					},
					likeCount: {
						$size: "$likes"
					}
				}
			},
			{
				$project: {
					_id: true,
					title: true,
					coverPicture: true,
					data: true,
					userIdLike: {
						$gte: [{$size: "$userIdLike"}, 1]
					},
					likeCount: true
				}

			}
		]).toArray();
		
		res.status(200).send(success(res.statusCode, "News fetch successfully", results))
	} catch (e) {
		next(e);
	}
}