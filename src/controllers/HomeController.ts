import {NextFunction, Request, Response} from 'express';
import {success} from "../utils/responseApi";
import models from '../models';

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sectionResult = await models.sections.find({})

        res.status(200).send(success(res.statusCode, "Home feed sections fetched successfully", sectionResult))
    } catch (error) {
        next(error)
    }
}