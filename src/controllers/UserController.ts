import {NextFunction, Request, Response} from 'express';
import uploadSingle from "../utils/fileUpload";


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
        const user: any = req.user!;
        await (uploadSingle('profilePicture', 'image/jpeg', user.displayName))(req)

        res.status(200).send("OK")
    } catch (e) {
        next(e)
    }
}