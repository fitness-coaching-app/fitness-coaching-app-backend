import {NextFunction, Request, Response} from 'express';
import Busboy, {BusboyHeaders} from 'busboy';
import path from "path";
import * as fs from "fs";
import * as os from "os";
import {success} from "../utils/responseApi";


export const editUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("OK");
}

export const editProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    let busboy = new Busboy({headers: req.headers as BusboyHeaders});
    const displayName = req.params.displayName;

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log(`File [${fieldname}] filename: ${filename}, mimetype: ${mimetype}`);

        const filepath = path.join(os.tmpdir(), fieldname);
        console.log(`Saving '${fieldname}' to ${filepath}`);

        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', function () {

        res.status(200).send(success(res.statusCode, "Profile Picture Upload Success", {}));
    });

    // @ts-ignore
    busboy.end(req.rawBody);
}