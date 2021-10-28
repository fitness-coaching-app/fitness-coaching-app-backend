import * as dotenv from 'dotenv';

dotenv.config({path: `${process.cwd()}/.env`});

const config = {
    mongoDB: {
        uri: process.env.MONGODB_URI
    }
}

export default config