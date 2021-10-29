import {NextFunction, Request, Response} from 'express';
import models from '../models'
import {success} from '../utils/responseApi'

export const signIn = async (req: Request, res: Response) => {
    res.status(200).send('AuthController.signIn');
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const info = req.body;
        const infoToInsert = {
            status: "VERIFICATION",
            displayName: info.displayName,
            email: info.email,
            password: info.password,
        }

        await models.users.insertOne(infoToInsert);

        res.status(200).json(success(res.statusCode, "Register Completed", {data: infoToInsert}));
    } catch (e: any) {
        next(e)
    }
}