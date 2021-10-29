import {ValidationError} from 'express-json-validator-middleware';

export const success = (statusCode: number, message: string, results: any) => {
    return {
        code: statusCode,
        message: message,
        error: false,
        results,
    }
}

export const error = (statusCode: number, message: string) => {
    return {
        code: statusCode,
        message: message,
        error: true
    }
}

export const validationError = (statusCode: number, message: string, errors: ValidationError) => {
    return {
        code: statusCode,
        message: message,
        error: true,
        errorMessage: errors.validationErrors
    }
}