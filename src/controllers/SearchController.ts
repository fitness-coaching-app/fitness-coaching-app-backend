import { NextFunction, Request, Response } from 'express'
import models from '../models'
import { error, success } from '../utils/responseApi'


export const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const query = req.query.q as string | undefined
		const searchString = query ? query.split(' ') : [""];
		const filter = req.query

		let userResults = await models.users.search(searchString, 10)
		let courseResults = await models.courses.search(searchString, filter, 10)

		const result = {
			users: userResults,
			courses: courseResults
		}

		res.status(200).send(success(res.statusCode, "Searching has been done successfully", result))
	} catch (e) {
		next(e)
	}
}

export const getFilterParams = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await models.courses.distinct('category');
		const [{ bodyParts }] = await (await models.courses.aggregate([
			{ "$unwind": "$bodyParts" },
			{
				"$group": { 
					_id: null, 
					bodyParts: { "$addToSet": "$bodyParts" } 
				}
			}
		])).toArray();
		const [{ minRating, maxRating }] = await (await models.courses.aggregate([
			{
				"$group": { 
					_id: null, 
					minRating: { "$min": "$overallRating" },
					maxRating: { "$max": "$overallRating"} 
				}
			}
		])).toArray();

		const result = {
			category,
			bodyParts,
			minRating,
			maxRating
		}
		res.status(200).send(success(res.statusCode, "Get filter parameters successfully", result))
	} catch (e) {
		next(e)
	}
}