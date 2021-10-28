import {Request, Response, NextFunction} from 'express';

const AuthController: { [k: string]: any } = {};

AuthController.signIn = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('It Works! (AuthController.signIn)');
}

export default AuthController;