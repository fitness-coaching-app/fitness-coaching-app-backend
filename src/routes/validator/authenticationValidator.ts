import {ValidateFunction} from "express-json-validator-middleware";

export const registerSchema: ValidateFunction = {
    type: "object",
    required: ["displayName", "email", "password"],
    additionalProperties: false,
    properties: {
        displayName: {type: "string"},
        email: {type: "string"},
        password: {type: "string"}
    }
};

export const signInSchema: ValidateFunction = {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
        email: {type: "string"},
        password: {type: "string"},
    }
}

export const forgetPasswordSchema: ValidateFunction = {
    type: "object",
    required: ["email"],
    additionalProperties: false,
    properties: {
        email: {type: "string"}
    }
}