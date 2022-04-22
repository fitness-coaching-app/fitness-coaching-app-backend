import {NextFunction, Request, Response} from 'express';
import {success} from "../utils/responseApi";
import models from '../models';

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sectionResult = await models.sections.find({})

        for(var i = 0;i < sectionResult.length;i++){
            if(sectionResult[i].sectionType === "COURSE"){
                for(var j = 0;j < sectionResult[i].data.length;j++){
                    const courseInfo: any = (await models.courses.findOne({_id: sectionResult[i].data[j].courseId}))
                    sectionResult[i].data[j] = {
                        courseId: courseInfo._id,
                        name: courseInfo.name,
                        difficulty: courseInfo.difficulty,
                        coverPicture: courseInfo.coverPicture,
                        overallRating: courseInfo.overallRating || 0.0
                    }
                }
            }
        }

        res.status(200).send(success(res.statusCode, "Home feed sections fetched successfully", sectionResult))
    } catch (error) {
        next(error)
    }
}