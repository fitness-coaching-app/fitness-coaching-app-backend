import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import models from '../models'
import { success } from '../utils/responseApi'


export const fetch = async (req: Request, res: Response, next: NextFunction) => {
	try {


		res.status(200).send(success(res.statusCode, "News fetch successfully", []))
	} catch (e) {
		next(e);
	}
}