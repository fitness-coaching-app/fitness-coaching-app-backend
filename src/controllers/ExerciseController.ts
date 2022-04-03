import {NextFunction, Request, Response} from 'express';
import {success} from "../utils/responseApi";
import {ObjectId} from 'mongodb';
import models from '../models';

export const complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        let body = req.body;
        

    } catch (error) {
        next(error)
    }
}