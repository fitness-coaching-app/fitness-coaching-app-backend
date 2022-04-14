import { NextFunction, Request, Response } from 'express';
import { success } from "../utils/responseApi";
import { Double, Long, Int32, ObjectId } from 'mongodb';
import models from '../models';
import fs from 'fs';
import os from 'os';
import YAML from 'yaml';
import { uploadLocalFile } from '../utils/gcsFileUtil';
import { level, difficultyScore } from '../utils/userScore';
import { Action, ExerciseEvent } from '../utils/achievementUtil';

export const complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user: any = req.user!
        user.xp = user.xp || 0;
        let body: any = req.body

        // Get the course info
        const courseInfo: any = await models.courses.findOne({ _id: new ObjectId(body.courseId) })
        // Calculate xp = (difficulty * 10) + (score * 20)
        const xpEarned = difficultyScore[courseInfo.difficulty] + (body.score * 20);

        // Check if the user is level up
        const isLevelUp = level(user.xp) !== level(user.xp + xpEarned);
        const newXp = user.xp + xpEarned;
        const currentLevel = level(newXp);

        const timestamp = new Date(Date.now());

        // Create PoseData temp file waiting for upload
        const doc = new YAML.Document()
        doc.contents = body.poseData
        const tempFilePath: string = `${os.tmpdir()}/exercise_complete_tmp_${user._id}_${Date.now()}.yaml`

        fs.writeFileSync(tempFilePath, doc.toString())

        // Upload the temp file
        const poseDataURL = await uploadLocalFile(tempFilePath, user._id.toString(), "poseData", "text/yaml")

        const activityInfo = {
            userId: new ObjectId(user._id),
            activityType: "EXERCISE",
            timestamp: timestamp,
            isPublic: body.isPublic,
            data: {
                courseId: new ObjectId(body.courseId),
                duration: new Double(body.duration),
                calories: new Double(body.calories),
                score: body.score,
                xpEarned: xpEarned,
                poseData: poseDataURL
            },
            reactions: [],
            comments: []
        }

        // mongoDB insert activities
        const activityId = (await models.activities.insertOne(activityInfo)).insertedId.toString()
        // if level up, insert
        if (isLevelUp) {
            const activityLevelUpInfo = {
                userId: new ObjectId(user._id),
                activityType: "LEVEL_UP",
                timestamp: timestamp,
                isPublic: true, // TODO: Can change later
                data: {
                    level: new Int32(currentLevel)
                },
                reactions: [],
                comments: []
            };
            await models.activities.insertOne(activityLevelUpInfo);
        }
        // Check if the user is eligible for any new achievement
        const newAchievementList = await Action.Exercise.newAchievement(user);
        let newAchievementObjList = [];
        let newAchievementForResults = [];
        for (let i of newAchievementList) {
            newAchievementObjList.push({
                achievementId: i,
                timestamp
            })
            newAchievementForResults.push(i.toString());
        }

        // Update user's xp and newAchievements
        await models.users.updateOne({ _id: user._id }, { $set: { xp: new Long(newXp) }, $push: { achievement: { $each: newAchievementObjList } } });




        const result = {
            levelUp: isLevelUp,
            currentLevel: currentLevel,
            currentXp: user.xp + xpEarned,
            xpEarned: xpEarned,
            newAchievementsId: newAchievementForResults,
            activityId
        }

        res.status(200).send(success(res.statusCode, "Exercise data is received successfully", result))
    } catch (error) {
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


