import nodemailer from 'nodemailer';
import config from '../config';
import jwt from 'jsonwebtoken';

export const sendVerificationEmail = (userInfo: { displayName: string, email: string, password: string }) => {
    const token = jwt.sign(
        {
            displayName: userInfo.displayName,
        },
        userInfo.password,
        {
            expiresIn: '10m'
        }
    )

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fitnesscoachingapp@gmail.com',
            pass: config.gmail.password,
        },
    });

    const link = config.apiHostUrl + `/auth/verifyEmail?displayName=${userInfo.displayName}&token=${token}`;

    return transporter.sendMail({
        from: '"Fitness Coaching App" <fitnesscoachingapp@gmail.com>',
        to: userInfo.email,
        subject: "Verify your email address",
        html: `Please verify in 10 minutes by clicking this link<br><br><a href="${link}">Verify Email</a>`,
    });
}