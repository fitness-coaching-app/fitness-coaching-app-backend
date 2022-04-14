import { ObjectId } from 'mongodb';
import models from '../models';

export class ExerciseEvent {
	private user: any;

	constructor(user: any) {
		this.user = user;
	}
	private currentStreakCount = async () => {
		let userExerciseActivity = await models.activities.aggregate([
			{
				$match: {
					userId: new ObjectId(this.user._id),
					activityType: "EXERCISE"
				}
			},
			{ $sort: { timestamp: -1 } },
			{
				$project: {
					_id: true,
					timestamp: true
				}
			}
		]).toArray();

		if(userExerciseActivity.length == 0) return 0;

		let count = 0;
		let dateToCheck = new Date();
		dateToCheck.setUTCHours(0, 0, 0, 0);
		let temp = new Date(userExerciseActivity[0].timestamp);
		temp.setUTCHours(0, 0, 0, 0);

		if (temp.getTime() === dateToCheck.getTime()) {
			dateToCheck.setDate(dateToCheck.getDate() - 1);// Go back 1 day
			count++;
			for (let i of userExerciseActivity) {
				let temp = new Date(i.timestamp);
				temp.setUTCHours(0, 0, 0, 0);
				if (temp.getTime() === dateToCheck.getTime()) {
					dateToCheck.setDate(dateToCheck.getDate() - 1);// Go back 1 day
					count++;
				}
				else if (temp.getTime() <= dateToCheck.getTime()) {
					break;
				}
			}
		}
		return count;
	}

	currentStreak = {
		count: this.currentStreakCount
	}

	duration = {
		count: (timeframe: string) => {

		}
	}
}

const newAchievementCheck = async (user: any, action: string): Promise<any[]> => {
	// Shim for allowing async function creation via new Function
	const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

	const event = new ExerciseEvent(user);
	const achievementList = await models.achievements.find({ action });
	const userAchievement = user.achievement || [] as any[];
	const newAchievementList = [] as ObjectId[];
	for (let i of achievementList) {
		if (!userAchievement.some((e: any) => e.achievementId.toString() === i._id.toString())) {
			const func = new AsyncFunction("action", i.criteria);
			if (await func(event)) {
				newAchievementList.push(i._id);
			}
		}
	}
	return newAchievementList;
}

export const Action = {
	Exercise: {
		newAchievement: async (user: any) => newAchievementCheck(user, "EXERCISE")
	},
	LevelUp:{
		newAchievement: async (user: any) => newAchievementCheck(user, "LEVEL_UP")
	}
}