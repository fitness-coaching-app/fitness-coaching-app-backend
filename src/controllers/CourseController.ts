import {NextFunction, Request, Response} from 'express';
import {success} from "../utils/responseApi";
import {ObjectId} from 'mongodb';
import models from '../models';

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.courseId;

        const result = await models.courses.findOne({_id: new ObjectId(courseId)});

        res.status(200).send(success(res.statusCode, "Get Course Successfully", result))

    } catch (error) {
        next(error)
    }
}