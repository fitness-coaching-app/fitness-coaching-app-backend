import { NextFunction, Request, Response } from 'express';
import { success } from "../utils/responseApi";
import { Double, Long, ObjectId } from 'mongodb';
import models from '../models';
import fs from 'fs';
import os from 'os';
import YAML from 'yaml';
import { uploadLocalFile } from '../utils/gcsFileUtil';
import { level, difficultyScore } from '../utils/userScore';
import { Action, ExerciseEvent } from '../utils/achievementUtil';

export const complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!
        let body: any = req.body

        // Get the course info
        const courseInfo: any = await models.courses.findOne({ _id: new ObjectId(body.courseId) })
        // Calculate xp = (difficulty * 10) + (score * 20)
        const xpEarned = difficultyScore[courseInfo.difficulty] + (body.score * 20);

        // Check if the user is level up
        const isLevelUp = level(user.xp || 0) !== level((user.xp || 0) + xpEarned);
        const newXp = (user.xp || 0) + xpEarned;


        // TODO: Check if the user is eligible for any new achievement
        const newAchievementList = await Action.Exercise.newAchievement(user);
        const timestamp = new Date(Date.now());
        let newAchievementObjList = [];
        for(let i of newAchievementList){
            newAchievementObjList.push({
                achievementId: i,
                timestamp
            })
        }

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
            timestamp: timestamp,
            isPublic: body.isPublic,
            data: data,
            reactions: [],
            comments: []
        }

        // mongoDB insert activities
        const activityId = (await models.activities.insertOne(infoToInsert)).insertedId.toString()
        // Update user's xp and newAchievements
        await models.users.updateOne({ _id: user._id }, { $set: { xp: new Long(newXp) }, $push: { achievement: {$each: newAchievementObjList}}});

        const result = {
            levelUp: isLevelUp,
            currentLevel: level(user.xp + xpEarned),
            currentXp: user.xp + xpEarned,
            xpEarned: xpEarned,
            activityId
        }

        res.status(200).send(success(res.statusCode, "Exercise data is received successfully", result))
        // res.status(200).send(success(res.statusCode, "Exercise data is received successfully"))
    } catch (error) {
        console.log(JSON.stringify(error))
        next(error)
    }
}

export const postExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const body = req.body;

        await models.activities.updateOne({ _id: new ObjectId(body.activityId) }, { $set: { isPublic: body.isPublic } })
        if (body.courseRating != null) {
            const userRating = {
                userId: user._id,
                rating: body.courseRating
            }
            const pipeline = {
                $set: {
                    ratings: {
                        $concatArrays: ["$ratings", [userRating]]
                    }
                }
            }
            await models.courses.updateOneAggregate({ _id: new ObjectId(body.courseId) }, pipeline);
        }

        res.status(200).send(success(res.statusCode, "Exercise data is received successfully"))
    } catch (e) {
        console.log(JSON.stringify(e));
        next(e)
    }
}


