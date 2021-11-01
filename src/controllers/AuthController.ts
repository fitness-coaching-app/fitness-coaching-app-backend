import {NextFunction, Request, Response} from 'express';
import models from '../models'
import {error, success, ErrorCode} from '../utils/responseApi'
import {hashPassword} from '../utils/passwordUtil'
import {sendVerificationEmail} from "../utils/emailUtil";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import config from "../config";
import passport from 'passport';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            else if (!user) {
                res.status(400).json(error(res.statusCode, info.message, info.errorCode));
                return;
            } else {
                req.logIn(user, {session: false}, (err) => {
                    if (err) throw err;
                    else {
                        const accessToken = jwt.sign({
                                displayName: user.displayName
                            },
                            config.jwtSecret,
                        ) // TODO: Set access token expire date.

                        res.status(200).json(success(res.statusCode, "Sign in success", {accessToken: accessToken}));
                    }
                })
            }
        })(req, res, next);

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