const dao = require('../dao')


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
            next({code: 404, message: 'User not found'})
        }
    } catch (error) {
        next(error)
    }
}