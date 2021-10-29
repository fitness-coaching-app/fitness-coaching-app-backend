import {Request, Response, NextFunction} from 'express';
import models from '../models'

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('AuthController.signIn');
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.status(200).send('AuthController.register');
}