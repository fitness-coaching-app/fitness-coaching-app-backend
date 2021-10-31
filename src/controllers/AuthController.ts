import {NextFunction, Request, Response} from 'express';
import models from '../models'
import {success} from '../utils/responseApi'
import {hashPassword} from '../utils/passwordUtil'
import {sendVerificationEmail} from "../utils/emailUtil";
import jwt from "jsonwebtoken";

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
            password: hashPassword(info.password),
        }

        await models.users.insertOne(infoToInsert);
        await sendVerificationEmail({...infoToInsert});

        res.status(200).json(success(res.statusCode, "Register Completed - Waiting for Verification", {data: infoToInsert}));
    } catch (e: any) {
        next(e)
    }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const displayName = req.query.displayName;
        const token = req.query.token as string | undefined;
        const userInfo = await models.users.findOne({displayName});

        if (!userInfo) next(new Error(`User with display name '${displayName}' not found`));
        else if (!token) next(new Error(`Token not found`))

        let decoded = jwt.verify(token!, userInfo!.password)
        await models.users.updateEmailVerificationComplete(userInfo!.displayName)

        res.status(200).send(`<h1>Email Verification Success!</h1>You can close this window now.`);
    } catch (e: any) {
        res.status(500).send(`<h1>There's a problem with the verification process.</h1>Please try again.`);
    }
}