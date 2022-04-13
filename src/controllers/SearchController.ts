import { NextFunction, Request, Response } from 'express'
import models from '../models'
import { error, success } from '../utils/responseApi'


export const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const searchString = req.query.q as string;

		const rawUserResults = await models.users.search(searchString)

		const result = {
			users: await rawUserResults.toArray(),
			courses: []
		}

		res.status(200).send(success(res.statusCode, "Searching has been done successfully", result))
	} catch (e) {
		next(e)
	}
}