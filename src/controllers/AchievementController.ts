import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import models from '../models'
import { success } from '../utils/responseApi'


export const getList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const results = await models.achievements.find({}, {criteria: false});

		res.status(200).send(success(res.statusCode, "Achievements fetched successfully", results))
	} catch (e) {
		next(e);
	}
}