import {Storage} from '@google-cloud/storage'

export const storage = new Storage({
    projectId: 'fitness-coaching-app',
    keyFilename: `${__dirname}/../../google-cloud/fitness-coaching-app-5942f56e3512.json`
});

export const getPublicUrl = (bucketName: string, fileName: string) => `https://storage.googleapis.com/${bucketName}/${fileName}`;
