'use strict'

/**
 * Create a response object in JSON format which can be returned to the client.
 * If no code is provided, or the provided code is not handled by this function, the function will return Internal Error.
 * 
 * @param {int} statusCode - optional - The HTTP status code.
 * @param {string} message - optional - Additional details about the response
 */
module.exports = function createJsonResponse(code, message) {
    const response = {}
    let responseStatus
    let responseMessage
    response.code = code || 500

    switch(response.code) {
        case 200:
            responseStatus = "OK"
            responseMessage = "OK"
            break
        case 201:
            responseStatus = "CREATED"
            responseMessage = "Created"
            break
        case 400:
            responseStatus = "BAD_REQUEST"
            responseMessage = "Bad request"
            break
        case 401:
            responseStatus = "UNAUTHORIZED"
            responseMessage = "Unauthorized"
            break
        case 403:
            responseStatus = "FORBIDDEN"
            responseMessage = "Forbidden"
            break
        case 404: 
            responseStatus = "NOT_FOUND"
            responseMessage = "Not found"
            break
        case 500:            
        default:
            responseStatus = "INTERNAL_ERROR"
            responseMessage = "Internal server error"
    }
    
    // if the caller sent a specific message, overwrite the generic one with it.
    // response bodies of created/retrieve objects will go here
    if (message) {
        responseMessage = message
    }

    // if we have an error code, then we move the response under the error key
    if (response.code >= 400) {
        response.message = {
            error: {
                status: responseStatus,
                message: responseMessage
            }
        }
    } else {
        response.message = responseMessage
    }

    return response
}