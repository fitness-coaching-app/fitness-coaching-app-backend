import {NextFunction, Request, Response} from 'express';
import models from '../models'
import {success} from '../utils/responseApi'
import {hashPassword} from '../utils/passwordUtil'
import {sendVerificationEmail} from "../utils/emailUtil";
import jwt from "jsonwebtoken";
import config from "../config";

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


const verifyEmailErrorMessage = (errorString: string): string => {
    return `<h1>There's a problem with the verification process.</h1>Please try again.<br><br>Error Message: ${errorString}`;
}


export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token as string | undefined;

        if (!token) res.status(500).send(verifyEmailErrorMessage("Token Not Found"));

        let decoded: any = jwt.verify(token!, config.jwtSecret);
        let userInfo = await models.users.findOne({email: decoded.email});
        if (!userInfo) {
            res.status(500).send(verifyEmailErrorMessage("Can't find the account"));
            return;
        }
        if (userInfo.status !== "VERIFICATION") {
            res.status(500).send(verifyEmailErrorMessage("Status doesn't match"));
            return;
        }

        await models.users.updateEmailVerificationComplete(decoded.email);
        res.status(200).send(`<h1>Email Verification Success!</h1>You can close this window now.`);
    } catch (e: any) {
        next(e);
    }
}