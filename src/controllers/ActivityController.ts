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
		const activity = await models.activities.getPublicActivityById(new ObjectId(activityId));

		if (activity.length === 0) {
			res.status(400).send(error(res.statusCode, "Activity not found", [ErrorCode.notFound]));
		}
		else {
			res.status(200).send(success(res.statusCode, "Activity fetched successfully", activity));
		}
	} catch (e) {
		next(e);
	}
} 

export const addReaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user! as any;
		const activityId = req.params.activityId as string;
		const reaction = req.query.reaction as string;

		const reactionUpdateResult = await (await models.activities.fn()).updateOne({ _id: new ObjectId(activityId) }, 
			{
				$set: { 
					"reactions.$[elem]": {
						userId: user._id,
						reaction: reaction,
						timestamp: new Date()
					} 
				}
			},
			{
				arrayFilters: [
					{ "elem.userId": user._id }
				]
			}
		);
		if (reactionUpdateResult.modifiedCount === 0) {
			// If user isn't yet react on the activity
			await models.activities.updateOne({ _id: new ObjectId(activityId) }, {
				$push: {
					reactions: {
						userId: user._id,
						reaction: reaction,
						timestamp: new Date()
					} 
				}
			})
		}
		res.status(200).send(success(res.statusCode, "Reaction added successfully", await models.activities.findOne({_id: new ObjectId(activityId)})));
	} catch (e) {
		next(e);
	}
} 

export const removeReaction = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user! as any;
		const activityId = req.params.activityId as string;
		const result = await models.activities.updateOne({ _id: new ObjectId(activityId) }, {
			$pull:{
				reactions:{
					userId: user._id
				}
			}
		})
		
		res.status(200).send(success(res.statusCode, "Reaction removed successfully", await models.activities.findOne({_id: new ObjectId(activityId)})));
	} catch (e) {
		next(e);
	}
} 

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user! as any;
		const activityId = req.params.activityId as string;
		const comment = req.body.comment as string;
		const result = await models.activities.updateOne({ _id: new ObjectId(activityId) }, {
			$push:{
				comments:{
					userId: user._id,
					comment: comment,
					timestamp: new Date()
				}
			}
		})

		res.status(200).send(success(res.statusCode, "Comment added successfully", await models.activities.findOne({_id: new ObjectId(activityId)})));
	} catch (e) {
		next(e);
	}
} 