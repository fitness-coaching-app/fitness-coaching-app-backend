import config from '../config';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import path from "path";

const mailjet = require('node-mailjet').connect(config.mailjetApiKey, config.mailjetSecretKey);

export const sendVerificationEmail = async (userInfo: { displayName: string, email: string }) => {
    const token = jwt.sign(
        {
            email: userInfo.email,
        },
        config.jwtSecret,
        {
            expiresIn: '10m'
        }
    )
    const link = config.apiHostUrl + `/auth/verifyEmail/${token}`;
    const html = await ejs.renderFile(path.join(__dirname, "emailFormat/verification_email.ejs"), { name: userInfo.displayName, verificationEmailLink: link });

    return mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "fitnesscoachingapp@gmail.com",
                        "Name": "Fitness Coaching Application"
                    },
                    "To": [
                        {
                            "Email": userInfo.email
                        }
                    ],
                    "Subject": "Fitness Coaching App - Verify Email Address",
                    "HTMLPart": html
                }
            ]
        })
}


export const sendForgetPasswordEmail = async (email: string, rawPassword: string) => {
    const html = await ejs.renderFile(path.join(__dirname, "emailFormat/forget_password_email.ejs"), { rawPassword: rawPassword });

    return mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "fitnesscoachingapp@gmail.com",
                        "Name": "Fitness Coaching Application"
                    },
                    "To": [
                        {
                            "Email": email
                        }
                    ],
                    "Subject": "Fitness Coaching App - Forget Password",
                    "HTMLPart": html
                }
            ]
        })
}






