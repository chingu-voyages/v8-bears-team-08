'use strict'

/**
 * Create an error object in JSON format which can be returned to the client.
 * If anything but a valid error code is provided, the function will return 500.
 * 
 * @param {int} errorCode - optional - The error code.
 * @param {string} errorMessage - optional - Additional details about the error that was thrown.
 */
module.exports = function createJsonErrorResponse(errorCode, errorMessage) {
    const errResponse = { 
        error: { 
            code: errorCode
        } 
    }
    
    switch(errResponse.error.code) {
        case 401:
            errResponse.error.status = 'UNAUTHORIZED'
            errResponse.error.message = 'Unauthorized'
            break
        case 403:
            errResponse.error.status = 'FORBIDDEN'
            errResponse.error.message = 'Forbidden'
            break
        case 404: 
            errResponse.error.status = 'NOT_FOUND'
            errResponse.error.message = 'Not found'
            break
        default:
            errResponse.error.code = 500
            errResponse.error.status = 'INTERNAL_ERROR'
            errResponse.error.message = 'Internal server error'
    }
    
    // if the caller sent a specific error message, overwrite the generic one with it
    if (errorMessage) {
        errResponse.error.message = errorMessage;
    }

    return errResponse
}