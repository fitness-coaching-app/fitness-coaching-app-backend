import {NextFunction, Request, Response} from 'express';
import models from '../models'
import {error, success, ErrorCode} from '../utils/responseApi'
import {hashPassword} from '../utils/passwordUtil'
import {sendVerificationEmail, sendForgetPasswordEmail} from "../utils/emailUtil";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import config from "../config";
import {generateAccessToken, generateRefreshToken} from "../utils/tokenUtil";

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;

        const accessToken = generateAccessToken(user.displayName);
        const refreshToken = generateRefreshToken(user.displayName);

        res.status(200).json(success(res.statusCode, "Sign in success", {
            user: {...user, password: undefined},
            accessToken,
            refreshToken
        }));

    } catch (e) {
        next(e);
    }
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
        let isEmailDuplicate = !!(await models.users.findOne({email: info.email}));
        if (isEmailDuplicate) {
            res.status(400).json(error(res.statusCode, "Register Failed: Email Already Exists", [ErrorCode.emailAlreadyExists]));
            return;
        }
        let isDisplayNameDuplicate = !!(await models.users.findOne({displayName: info.displayName}));
        if (isDisplayNameDuplicate) {
            res.status(400).json(error(res.statusCode, "Register Failed: Display Name Already Exists", [ErrorCode.displayNameAlreadyExists]));
            return;
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
            res.status(500).send(verifyEmailErrorMessage("Can't Find the Account"));
            return;
        }
        if (userInfo.status !== "VERIFICATION") {
            res.status(500).send(verifyEmailErrorMessage("Account Already Verified"));
            return;
        }

        await models.users.updateEmailVerificationComplete(decoded.email);
        res.status(200).send(`<h1>Email Verification Success!</h1>You can close this window now.`);
    } catch (e: any) {
        if (e instanceof TokenExpiredError) {
            res.status(500).send(verifyEmailErrorMessage("Token Expired"));
        } else {
            res.status(500).send(verifyEmailErrorMessage(e.toString()));
        }
        next(e)
    }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const info = req.body
        const isUserExists = !!(await models.users.findOne({email: info.email}))
        if (!isUserExists) {
            res.status(400).json(error(res.statusCode, "User email not found", [ErrorCode.userNotFound]));
            return;
        }
        const newPasswordRaw = Math.random().toString(36).slice(-8);
        const newPasswordHashed = hashPassword(newPasswordRaw);

        await models.users.updateOne({email: info.email}, {password: newPasswordHashed});
        await sendForgetPasswordEmail(info.email, newPasswordRaw);

        res.status(200).json(success(res.statusCode, "Reset password success", null));
    } catch (e: any) {
        next(e)
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user!
    const accessToken = generateAccessToken(user.displayName)

    res.status(200).json(success(res.statusCode, "New Access Token Generated", {accessToken}));
    next();
}