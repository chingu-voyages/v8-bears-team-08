'use strict'

const dao = require('../dao')
const Error = require('../helpers/error')


module.exports.createUser = function(req, res) {

}

module.exports.getUserById = async function(req, res, next) {
    let userIdToGet = req.params.userId
    console.log('Checking for user:', userIdToGet)
    
    try {
        let userData = await dao.getUserData(userIdToGet)
        if (userData) {
            // never send the created time back to the client.
            // only send sensitive data such as email if the user is getting their own user details
            delete userData.created
            if (req.user.uid !== userIdToGet) {
                delete userData.email
            }

            res.status(200).send(userData)
        } else {
            next(Error(404, 'User not found'))
        }
    } catch (error) {
        console.error(error)
        next(Error())
    }
}