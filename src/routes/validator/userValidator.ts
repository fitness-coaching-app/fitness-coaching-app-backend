import {ValidateFunction} from "express-json-validator-middleware";

export const editUserInfo: ValidateFunction = {
    type: "object",
    additionalProperties: false,
    properties: {
        displayName: {type: "string"},
        birthYear: {type: "number"},
        gender: {
            type: "string",
            enum: ["MALE", "FEMALE", "OTHERS"]
        },
        exercisePreference: {
            type: "array",
            items: {
                type: "string"
            }
        },
        partToAvoid: {
            type: "array",
            items: {
                type: "string"
            }
        },
    }
}

export const newUserSetup: ValidateFunction = {
    type: "object",
    additionalProperties: false,
    required: ["birthYear", "gender", "exercisePreference", "partToAvoid"],
    properties: {
        birthYear: {type: "number"},
        gender: {
            type: "string",
            enum: ["MALE", "FEMALE", "OTHERS"]
        },
        exercisePreference: {
            type: "array",
            items: {
                type: "string"
            }
        },
        partToAvoid: {
            type: "array",
            items: {
                type: "string"
            }
        },
    }
}