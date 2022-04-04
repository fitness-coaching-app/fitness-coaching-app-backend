import { NextFunction, Request, Response } from 'express';
import { success } from "../utils/responseApi";
import { Double, ObjectId } from 'mongodb';
import models from '../models';
import fs from 'fs';
import os from 'os';
import YAML from 'yaml';
import { uploadLocalFile } from '../utils/gcsFileUtil';

const difficultyScore: {
    [key: string]: number,
} = {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300
}

export const complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!
        let body: any = req.body

        // Get the course info
        const courseInfo: any = await models.courses.findOne({ _id: new ObjectId(body.courseId) })
        // Calculate xp = (difficulty * 10) + (score * 20)
        const xpEarned = difficultyScore[courseInfo.difficulty] + (body.score * 20);

        // TODO: Check if the user is level up
        // TODO: Check if the user is eligible for any new achievement


        // Create PoseData temp file waiting for upload
        const doc = new YAML.Document()
        doc.contents = body.poseData
        const tempFilePath: string = `${os.tmpdir()}/exercise_complete_tmp_${user._id}_${Date.now()}.yaml`

        fs.writeFileSync(tempFilePath, doc.toString())

        // Upload the temp file
        const poseDataURL = await uploadLocalFile(tempFilePath, user._id.toString(), "poseData", "text/yaml")

        const data = {
            courseId: new ObjectId(body.courseId),
            duration: new Double(body.duration),
            calories: new Double(body.calories),
            score: body.score,
            xpEarned: xpEarned,
            poseData: poseDataURL
        }

        const infoToInsert = {
            userId: new ObjectId(user._id),
            activityType: "EXERCISE",
            timestamp: new Date(Date.now()),
            isPublic: body.isPublic,
            data: data,
            reactions: [],
            comments: []
        }

        // mongoDB insert
        await models.activities.insertOne(infoToInsert)

        const result = {
            levelUp: false, // TODO: Change this
            xpEarned: xpEarned
        }

        res.status(200).send(success(res.statusCode, "The exercise data is received successfully.",result))
    } catch (error) {
        console.log(JSON.stringify(error))
        next(error)
    }
}