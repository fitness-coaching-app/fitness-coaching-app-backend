import {Request} from "express";
import {storage} from "./googleCloudStorage";
import Busboy, {BusboyHeaders} from "busboy";
import mime from 'mime-types';

const uploadSingle = (field: string, type: string, ownerDisplayName: string, bucketName: string = 'fca-bucket') => {
    return async (req: Request) => {
        let bucket = storage.bucket(bucketName);
        let fileExt = mime.extension(type);
        let gcsFile = bucket.file(`${field}/${field}_${ownerDisplayName}_${Date.now()}.${fileExt}`)

        let busboy = new Busboy({headers: req.headers as BusboyHeaders});

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.on('error', (err) => console.log(err))
            if (!(fieldname == field && mimetype == type)) {
                file.resume();
                busboy.emit('error', new Error("Invalid fieldname or mimetype"))
            } else {
                console.log(`Uploading File [${fieldname}] filename: ${gcsFile.name}, mimetype: ${mimetype}`);
                const gcsStream = gcsFile.createWriteStream()
                gcsStream.on('error', (err) => {
                    busboy.emit('error', err)
                })

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
    }
}

export default uploadSingle