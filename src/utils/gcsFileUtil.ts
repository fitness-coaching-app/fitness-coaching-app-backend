import { Request } from "express";
import { storage, getPublicUrl, parseURL } from "./googleCloudStorage";
import Busboy, { BusboyHeaders } from "busboy";
import mime from 'mime-types';

export const uploadSingle = async (req: Request, field: string, type: string, ownerDisplayName: string, bucketName: string = 'fca-bucket') => {
    let bucket = storage.bucket(bucketName);
    let fileExt = mime.extension(type);
    let gcsFile = bucket.file(`${field}/${field}_${ownerDisplayName}_${Date.now()}.${fileExt}`)
    const gcsStream = gcsFile.createWriteStream()
    gcsStream.on('error', (err) => {
        busboy.emit('error', err)
    })

    let busboy = new Busboy({ headers: req.headers as BusboyHeaders });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('error', (err) => busboy.emit('error', err))
        if (!(fieldname == field && mimetype == type)) {
            file.resume();
            busboy.emit('error', new Error("Invalid fieldname or mimetype"))
        } else {
            console.log(`Uploading File [${fieldname}] filename: ${gcsFile.name}, mimetype: ${mimetype}`);

            file.pipe(gcsStream)
        }
    })
    busboy.on('error', (err) => {
        throw err
    })
    busboy.on('finish', () => {
        console.log(`Finished`);
    });
    // @ts-ignore
    busboy.end(req.rawBody);
    return getPublicUrl(bucketName, gcsFile.name)
}

export const uploadLocalFile = async (path: string, userId: string, field: string, mimetype: string, bucketName: string = 'fca-bucket') => {
    let bucket = storage.bucket(bucketName);
    let fileExt = mime.extension(mimetype);
    let gcsFile = bucket.file(`${field}/${field}_${userId}_${Date.now()}.${fileExt}`)

    await bucket.upload(path, {destination: gcsFile})

    return getPublicUrl(bucketName, gcsFile.name)
}

export const deleteByURL = async (url: string) => {
    const { bucketName, fileName } = parseURL(url);
    return await storage.bucket(bucketName).file(fileName).delete();
}