import jwt from "jsonwebtoken";
import config from "../config";

export const generateAccessToken = (displayName: string) => {
    return jwt.sign({
            type: 'accessToken',
            displayName
        },
        config.jwtSecret, {
            expiresIn: '10m'
        }
    )
}

export const generateRefreshToken = (displayName: string) => {
    return jwt.sign({
            type: 'refreshToken',
            displayName
        },
        config.jwtSecret, {
            expiresIn: '90d'
        }
    )
}