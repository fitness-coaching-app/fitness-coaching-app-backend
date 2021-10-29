export const registerSchema = {
    type: "object",
    required: ["displayName", "email", "password"],
    additionalProperties: false,
    properties: {
        displayName: {type: "string"},
        email: {type: "string"},
        password: {type: "string"}
    }
};