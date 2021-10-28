import {Request, Response, NextFunction} from 'express';
import models from '../models'

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('It Works! (AuthController.signIn)');
}