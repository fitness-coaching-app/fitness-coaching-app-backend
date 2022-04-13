import { NextFunction, Request, Response } from 'express'
import models from '../models'
import { error, success } from '../utils/responseApi'


export const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const query = req.query.q as string | undefined
		const searchString = query? query.split(' '): [""];
		const filter = req.query

		let userResults = await models.users.search(searchString, 10)
		let courseResults = await models.courses.search(searchString,filter, 10)

		const result = {
			users: userResults,
			courses: courseResults
		}

		res.status(200).send(success(res.statusCode, "Searching has been done successfully", result))
	} catch (e) {
		next(e)
	}
}