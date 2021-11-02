import * as dotenv from 'dotenv';

dotenv.config({path: `${__dirname}/.env`});

const config = {
    environment: process.env.NODE_ENV,
    mongoDB: {
        uri: process.env.MONGODB_URI
    },
    gmail: {
        password: process.env.GMAIL_PASSWORD
    },
    apiHostUrl: process.env.API_HOST_URL,
    jwtSecret: process.env.JWT_SECRET as string
}

export default config