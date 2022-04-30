import { NextFunction, Request, Response } from 'express';
import { deleteByURL, uploadSingle } from "../utils/gcsFileUtil";
import { error, ErrorCode, success } from "../utils/responseApi";
import models from '../models';
import { userExists } from '../models/users';
import { comparePassword, hashPassword } from "../utils/passwordUtil";
import { MongoServerError, ObjectId } from 'mongodb';


export const editUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user: any = req.user!;
        let infoToEdit: any = req.body;
        if (!!(infoToEdit.displayName)) {
            const isDuplicate: boolean = await userExists(infoToEdit.displayName)
            if (isDuplicate) {
                res.status(400).json(error(res.statusCode, "Display Name Already Exists", [ErrorCode.displayNameAlreadyExists]))
                return;
            }
        }
        await models.users.updateOne({ displayName: user.displayName }, { $set: infoToEdit })

        res.status(200).send(success(res.statusCode, "User Info Edit Successfully"))
    } catch (e) {
        next(e)
    }

}

export const editProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;

        // Delete old profile picture
        if (!!(user.profilePicture)) {
            await deleteByURL(user.profilePicture).catch((err) => console.log(err));
        }

        const gcsLink = await uploadSingle(req, 'profilePicture', 'image/webp', user.displayName)
        await models.users.updateOne({ displayName: user.displayName }, { $set: { profilePicture: gcsLink } })

        res.status(200).send(success(res.statusCode, "Profile Picture Changed Successfully", { profilePicture: gcsLink }))
    } catch (e) {
        next(e)
    }
}

export const newUserSetup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;
        let infoToUpdate: any = req.body;
        if (!(user.status === "SETTING_UP")) {
            res.status(400).send(error(res.statusCode, `User status is ${user.status} (SETTING_UP Required)`, [ErrorCode.userStatusError]))
            return;
        }

        await models.users.updateOne({ displayName: user.displayName }, { $set: { ...infoToUpdate, status: "ACTIVE" } });

        res.status(200).send(success(res.statusCode, "New User Setup Success"))
    } catch (e) {
        next(e)
    }
}

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const displayName = req.params.displayName;

        let result: any | null = await models.users.findOne({ displayName });
        if (result !== null) {
            const followerResult = await models.userFollowings.aggregate([{
                $match: {
                    followingId: result._id
                }
            },
            {
                $count: "followerCount"
            }]).toArray();

            var followerCount = 0;
            if (followerResult.length > 0) {
                followerCount = followerResult[0].followerCount;
            }


            const followingResult = await models.userFollowings.aggregate([{
                $match: {
                    followerId: result._id
                }
            },
            {
                $count: "followingCount"
            }
            ]).toArray();

            var followingCount = 0;
            if (followingResult.length > 0) {
                followingCount = followingResult[0].followingCount;
            }
            result = {
                ...result,
                followerCount,
                followingCount
            }
        }

        res.status(200).send(success(res.statusCode, "User Info Fetched", result));
    } catch (e) {
        next(e)
    }
}

export const getUserInfoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        let result: any | null = await models.users.findOne({ _id: new ObjectId(userId) });
        if (result !== null) {
            const followerResult = await models.userFollowings.aggregate([{
                $match: {
                    followingId: result._id
                }
            },
            {
                $count: "followerCount"
            }]).toArray();

            var followerCount = 0;
            if (followerResult.length > 0) {
                followerCount = followerResult[0].followerCount;
            }


            const followingResult = await models.userFollowings.aggregate([{
                $match: {
                    followerId: result._id
                }
            },
            {
                $count: "followingCount"
            }
            ]).toArray();

            var followingCount = 0;
            if (followingResult.length > 0) {
                followingCount = followingResult[0].followingCount;
            }
            result = {
                ...result,
                followerCount,
                followingCount
            }
        }

        res.status(200).send(success(res.statusCode, "User Info Fetched", result));
    } catch (e) {
        next(e)
    }
}

export const checkVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!
        const result = {
            displayName: user.displayName,
            status: user.status,
            isVerified: user.status != "VERIFICATION"
        }
        res.status(200).send(success(res.statusCode, "Verification status fetched successfully", result));
    } catch (e) {
        next(e)
    }
}

export const setNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const dbPassword = user.password;

        // Check old password
        if (!(comparePassword(oldPassword, dbPassword))) {
            res.status(400).send(error(res.statusCode, "Old password is incorrect", [ErrorCode.invalidParameter]));
            return;
        }
        // Check newPassword == confirmNewPassword
        if (newPassword !== confirmNewPassword) {
            res.status(400).send(error(res.statusCode, "New password and confirm new password didn't match", [ErrorCode.incorrectPassword]));
        }

        await models.users.updateOne({ email: user.email }, { $set: { password: hashPassword(newPassword) } });

        res.status(200).send(success(res.statusCode, "New password has been set", null));
    } catch (e) {
        next(e);
    }
}

export const addFollower = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.user!;
        const followingDisplayName: string = req.query.displayName as string;

        const followingUser = await models.users.findOne({ displayName: followingDisplayName });
        // check that display name exists
        if (followingUser === null) {
            res.status(400).send(error(res.statusCode, `User ${followingDisplayName} not found`, [ErrorCode.userNotFound]));
        }
        else {
            // insert the data to models
            await models.userFollowings.insertOne({
                followerId: userId._id,
                followingId: followingUser._id,
                timestamp: new Date()
            });

            res.status(200).send(success(res.statusCode, "Follower added successfully", null));
        }
    } catch (e) {
        if (e instanceof MongoServerError && e.code === 11000) {
            res.status(200).send(success(res.statusCode, "Follower already added", null));
            next();
        }
        else {
            next(e);
        }
    }
}


export const removeFollower = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.user!;
        const followingDisplayName: string = req.query.displayName as string;

        const followingUser = await models.users.findOne({ displayName: followingDisplayName });
        // check that display name exists
        if (followingUser === null) {
            res.status(400).send(error(res.statusCode, `User ${followingDisplayName} not found`, [ErrorCode.userNotFound]));
        }
        else {
            // insert the data to models
            const result = await models.userFollowings.deleteOne({
                followerId: userId._id,
                followingId: followingUser._id,
            });
            if (result.deletedCount === 0) {
                res.status(200).send(success(res.statusCode, "The follower is not in the list", [ErrorCode.otherError]));
            }
            else {
                res.status(200).send(success(res.statusCode, "Follower removed successfully", null));
            }
        }
    } catch (e) {
        next(e);
    }
}

export const getFollowerList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;
        const result = await models.userFollowings.getFollowerList(user._id);

        res.status(200).send(success(res.statusCode, "Follower list fetch successfully", result));
    } catch (e) {
        next(e)
    }
}


export const getFollowingList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;
        const result = await models.userFollowings.getFollowingList(user._id);

        res.status(200).send(success(res.statusCode, "Following list fetch successfully", result));
    } catch (e) {
        next(e)
    }
}


export const activity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user!;
        const result = await models.activities.getUserActivity(user._id);

        res.status(200).send(success(res.statusCode, "Get user's activity successfully", result));
    } catch (e) {
        next(e)
    }
}


export const activityDisplayName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const displayName = req.params.displayName;
        const user = await models.users.findOne({ displayName: displayName });
        if (user === null) {
            res.status(400).send(error(res.statusCode, `User ${displayName} not found`, [ErrorCode.userNotFound]));
        }
        else if (!user.userPreference.publishActivityToFollowers) {
            res.status(400).send(error(res.statusCode, `User ${displayName} is set to private`, [ErrorCode.userActivityPrivate]));
        }
        else {
            const result = await models.activities.getUserActivity(user._id);
            res.status(200).send(success(res.statusCode, "Get activity successfully", result));
        }
        
    } catch (e) {
        next(e)
    }
}
