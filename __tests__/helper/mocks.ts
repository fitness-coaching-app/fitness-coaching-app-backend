import models from '../../src/models'
import { hashPassword } from '../../src/utils/passwordUtil'
import { db } from '../../src/utils/mongoUtil'

export const mockUser = async (
	userInfoOverrides: {
		status?: string;
		email?: string;
		password?: string;
		displayName?: string;
		birthyear?: number;
		weightHistory?: [];
		heightHistory?: [];
		xp?: number;
		level?: number;
		profilePicture?: string;
		gender?: string;
		exercisePreference?: [];
		partToAvoid?: [];
		achievement?: []
	} = {}) => {
	return await models.users.insertOne({
		status: "ACTIVE",
		email: "test@jest.com",
		password: hashPassword("test"),
		displayName: "JestTest",
		birthyear: 2022,
		weightHistory: [],
		heightHistory: [],
		xp: 0,
		level: 0,
		profilePicture: "",
		gender: "MALE",
		exercisePreference: [],
		partToAvoid: [],
		achievement: [],
		...userInfoOverrides
	})
}


export const mockCourse = async (
	courseInfoToOverride: {
		bodyParts?: string[],
		category?: string,
		description?: string,
		difficulty?: string,
		name?: string,
		viewCount?: number
	} = {}
) => {
	return await db().collection('courses').insertOne({
		bodyParts: ["legs"],
		category: "TEST",
		description: "For testing purpose only",
		difficulty: "EASY",
		name: "test",
		viewCount: 0,
		...courseInfoToOverride
	})
}


export const mockAchievement = async (
	achievement: {
		title?: string,
		description?: string,
		picture?: string,
		criteria?: string,
	} = {
		title: "test",
		description: "test",
		picture: "",
		criteria: "return true;"
	}
) => {
	return await db().collection('achievements').insertOne(achievement)
}
