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
						$gte: [{ $size: "$userIdLike" }, 1]
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


export const like = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newsId: any = req.params.newsId;
		const user: any = req.user!;

		// Check if the user is liked
		const userCheck: any = await models.news.findOne({
			_id: new ObjectId(newsId),
			likes: {
				$elemMatch: {
					userId: user._id	
				}
			}
		});

		if (userCheck === null) {
			await models.news.updateOne({ _id: new ObjectId(newsId) }, {
				$push: {
					likes: {
						userId: user._id,
						timestamp: new Date()
					}
				}
			})
			res.status(200).send(success(res.statusCode, "The news is liked"))
		}
		else {
			res.status(200).send(success(res.statusCode, "User already liked"))
		}
	} catch (e) {
		next(e);
	}
}

export const unlike = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newsId: any = req.params.newsId;
		const user: any = req.user!;

		const updateResult = await models.news.updateOne({ _id: new ObjectId(newsId) }, {
			$pull: {
				likes: {
					userId: user._id
				}
			}
		})
		if(updateResult.modifiedCount === 0){
			res.status(200).send(success(res.statusCode, "User hasn't been liked"))
		}
		else{
			res.status(200).send(success(res.statusCode, "The news is unliked"))
		}
		
	} catch (e) {
	next(e);
}
}

