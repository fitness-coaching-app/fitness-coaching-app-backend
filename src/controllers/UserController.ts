import {NextFunction, Request, Response} from 'express';
import Busboy, {BusboyHeaders} from 'busboy';
import path from "path";
import * as fs from "fs";
import * as os from "os";
import {error, ErrorCode, success} from "../utils/responseApi";
import {storage} from "../utils/googleCloudStorage";


export const editUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user: any = req.user!;
        console.log(user);

        res.status(200).send("OK");
    } catch (e) {
        next(e)
    }

}

export const editProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let bucket = storage.bucket('fca-bucket');

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
        const user: any = req.user!;
        if (user.displayName !== displayName) {
            res.status(400).send(error(res.statusCode, "Token mismatch with display name", [ErrorCode.tokenMismatch]))
            return;
        }
        // @ts-ignore
        busboy.end(req.rawBody);
    } catch (e) {
        next(e);
    }
}