import passport from 'passport';
import models from '../models';
import {comparePassword} from "./passwordUtil";
import {ErrorCode} from './responseApi';
import config from '../config';


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
            .catch(err => callback(err))

    }
));

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
    },
    async (jwtPayload: any, callback: any) => {
        return await models.users.findOne({displayName: jwtPayload.displayName})
            .then(user => {
                return callback(null, user);
            })
            .catch(err => {
                return callback(err);
            });
    }
));