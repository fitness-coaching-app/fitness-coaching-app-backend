import passport from 'passport';
import models from '../models';
import {comparePassword} from "./passwordUtil";
import {error, ErrorCode} from './responseApi';
import config from '../config';
import {Request, Response, NextFunction} from "express";
import {JsonWebTokenError} from "jsonwebtoken";


let LocalStrategy = require('passport-local');
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// @ts-ignore
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email: string, password: string, callback: any) => {
        return await models.users.findOne({email: email})
            .then(user => {
                if (!user) {
                    return callback(null, false, {
                        message: `User with email '${email}' not found`,
                        errorCode: [ErrorCode.userNotFound]
                    })
                }

                // Check Password
                const isPasswordCorrect = comparePassword(password, user.password)
                if (!isPasswordCorrect) {
                    return callback(null, false, {
                        message: `Incorrect password`,
                        errorCode: [ErrorCode.incorrectPassword]
                    })
                }

                return callback(null, user, {message: 'Sign In Success'})
            })
            .catch(err => callback(err, false, {message: err.toString(), errorCode: [ErrorCode.mongoDBError]}))
    }
));

passport.use('accessTokenJwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
    },
    async (jwtPayload: any, callback: any) => {
        if (jwtPayload.type !== 'accessToken')
            return callback(new Error('Token type mismatch'), false, {
                message: 'Token type mismatch',
                errorCode: [ErrorCode.tokenTypeMismatch]
            });

        return await models.users.findOne({displayName: jwtPayload.displayName})
            .then(user => {
                return callback(null, user);
            })
            .catch(err => {
                return callback(err, false, {message: err.toString(), errorCode: [ErrorCode.mongoDBError]});
            });
    }
));

passport.use('refreshTokenJwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
    },
    async (jwtPayload: any, callback: any) => {
        if (jwtPayload.type !== 'refreshToken')
            return callback(new Error('Token type mismatch'), false, {
                message: 'Token type mismatch',
                errorCode: [ErrorCode.tokenTypeMismatch]
            });
        return await models.users.findOne({displayName: jwtPayload.displayName})
            .then(user => {
                if (!user)
                    return callback(new Error('User not found'), false, {
                        message: `User with display name ${jwtPayload.displayName} not found.`,
                        errorCode: [ErrorCode.userNotFound]
                    })
                else
                    return callback(null, user);
            })
            .catch(err => {
                return callback(err, false, {message: err.toString(), errorCode: [ErrorCode.mongoDBError]});
            });
    }
));

export const passportAuthenticate = (strategy: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) {
                console.log("Error in passportAuthenticate =====================");
                console.log(err);
                if (info == null) {
                    return res.status(500).json(error(res.statusCode, err.toString(), [ErrorCode.otherError]));
                } else return res.status(500).json(error(res.statusCode, info.message, info.errorCode));
            } else if (info instanceof JsonWebTokenError){
                return res.status(400).json(error(res.statusCode, info.message, [ErrorCode.jwtError]));
            }
            else if (!user) {
                return res.status(400).json(error(res.statusCode, info.message, info.errorCode));
            } else {
                req.logIn(user, {session: false}, (err) => {
                    if (err)
                        return res.status(500).json(error(res.statusCode, info.message, info.errorCode));
                    else {
                        next();
                    }
                })
            }
        })(req, res, next);
    }
}