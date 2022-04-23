export const success = (statusCode: number, message: string, results: object | null = {}) => {
    return {
        code: statusCode,
        message: message,
        error: false,
        results,
    }
}

export const error = (statusCode: number, message: string, errorCode: Array<string> | undefined) => {
    return {
        code: statusCode,
        message: message,
        error: true,
        errorCode: errorCode,
    }
}

export const ErrorCode = {
    mongoDBError: "MONGODB_ERROR",
    emailAlreadyExists: "DUPLICATE_EMAIL",
    userNotFound: "USER_NOT_FOUND",
    incorrectPassword: "INCORRECT_PASSWORD",
    displayNameAlreadyExists: "DUPLICATE_DISPLAY_NAME",
    tokenTypeMismatch: "TOKEN_TYPE_MISMATCH",
    tokenMismatch: "TOKEN_MISMATCH",
    jwtError: "JWT_ERROR",
    userStatusError: "USER_STATUS_ERROR",
    requestError: "REQUEST_ERROR",
    invalidParameter: "INVALID_PARAMETER",
    otherError: "OTHER_ERROR",
    userActivityPrivate: "USER_ACTIVITY_PRIVATE",
}