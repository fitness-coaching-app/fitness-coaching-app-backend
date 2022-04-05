import models from '../src/models'
import { hashPassword } from '../src/utils/passwordUtil'
import { db } from '../src/utils/mongoUtil'

export const mockUser = async () => {
	await models.users.insertOne({
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
		achievement: []
	})
}


export const mockCourse = async () => {
	return await db().collection('courses').insertOne({
		bodyParts: ["legs"],
		category: "TEST",
		description: "For testing purpose only",
		difficulty: "EASY",
		name: "test",
		viewCount: 0
	})
}