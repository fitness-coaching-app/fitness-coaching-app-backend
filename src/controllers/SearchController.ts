import {NextFunction, Request, Response} from 'express'
import models from '../models'
import {error, success} from '../utils/responseApi'


export const search = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const searchString = req.query.q;
		console.log(searchString);

		res.status(200).send(success(res.statusCode, "Searching has been done successfully", []))
	} catch (e){
		next(e)
	}
}