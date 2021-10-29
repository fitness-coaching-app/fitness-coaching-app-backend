import {Request, Response} from 'express';
import models from '../models'
import {success, error} from '../utils/responseApi'

export const signIn = async (req: Request, res: Response) => {
    res.status(200).send('AuthController.signIn');
}

export const register = async (req: Request, res: Response) => {
    console.log(req.body);
    let userInfo = await models.users.getUserInfo({displayName: "poramee"})
    console.log(userInfo)
    res.status(200).json(success(res.statusCode, "Register Completed", {data: "AuthController.register"}));
}