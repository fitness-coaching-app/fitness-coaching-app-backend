import nodemailer from 'nodemailer';
import config from '../config';
import jwt from 'jsonwebtoken';

const createTransport = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fitnesscoachingapp@gmail.com',
            pass: config.gmail.password,
        },
    });
}

export const sendVerificationEmail = (userInfo: { displayName: string, email: string, password: string }) => {
    const token = jwt.sign(
        {
            email: userInfo.email,
        },
        config.jwtSecret,
        {
            expiresIn: '10m'
        }
    )

    const transporter = createTransport();

    const link = config.apiHostUrl + `/auth/verifyEmail/${token}`;

    return transporter.sendMail({
        from: '"Fitness Coaching App" <fitnesscoachingapp@gmail.com>',
        to: userInfo.email,
        subject: "Verify your email address",
        html: `Please verify in 10 minutes by clicking this link<br><br><a href="${link}">Verify Email</a>`,
    });
}

export const sendForgetPasswordEmail = (email: string, rawPassword: string) => {
    const transporter = createTransport();

    return transporter.sendMail({
        from: '"Fitness Coaching App" <fitnesscoachingapp@gmail.com>',
        to: email,
        subject: "Fitness Coaching App - Forget Password",
        html: `Your new password is<br><br>${rawPassword}<br>`,
    });
}