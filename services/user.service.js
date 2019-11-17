import User from '../models/user.model.js'
import mongoose from 'mongoose'



/**
  * @class UserService
  * @description handle user operation in database
 * @method create
  * @method update
  * @method getById
  * @method query
  * @method delete
  */
export default class UserService {

    /**
     * @method create
     * @description save a user model in the database
     * @param {String} mail of user 
     * @param {String} username of user 
     * @returns {Object} return id of user if done or null if fail
     */
    static async create(mail, username) {
        if (mail === undefined || mail === null || username === undefined || username === null) {
            return null
        }

        try {
            let userInformation = new User({
                username,
                mail
            })

            let userSaved = await userInformation.save()

            return userSaved.id
        }
        catch (error) {
            console.log('error while creating user in database in service')
            console.log(error)
            return null
        }
    }

    /**
     * @method update
     * @description detete file with specific id
     * @param {String} userId id the user to be updated
     * @param {json} userInfo info to update in the user
     * @returns {Object} returned old user if found or null if fail
     */
    static async update(userId, userInfo) {
        if (userId === undefined || userId === null || userInfo === undefined || userInfo === {} || userInfo === null) {
            return null
        }

        try {
            let oldUser = await User.findOneAndUpdate({ _id: userId }, userInfo)

            if (oldUser) {
                return oldUser
            }

            return null
        }
        catch (error) {
            console.log('error while updating user in database in service')
            console.log(error)
            return null
        }
    }

    /**
 * @method getById
 * @description return user by id
 * @param {String} userId id of the user to return
 * @returns {Object} return user if found or null if fail
 */
    static async getById(userId) {
        if (userId === undefined || userId === null) {
            return null
        }

        try {
            let userFound = await User.findById(userId)

            if (userFound) {
                console.log('user exist')
                return userFound
            }
            return null
        }
        catch (error) {
            console.log('error while looking of a user in the database the in service')
            console.log(error)
            return null
        }
    }

    /**
 * @method query
 * @description return several user with specific query
 * @param {json} queryInfo  
 * @returns {Object} return users if found of null if fail
 */
    static async query(queryInfo) {
        if (queryInfo === undefined || queryInfo === null) {
            return null
        }
        try {
            let usersFound = await User.find(queryInfo)

            if (usersFound) {
                return usersFound
            }
            return null
        }
        catch (error) {
            console.log('error while looking of a user in the database the in service')
            console.log(error)
            return null
        }
    }

    /**
 * @method delete
 * @description delete a user with it's id
 * @param {String} userId id of the user you're trying to delete
 * @returns {Object} return status if found or null if fail
 */
    static async delete(userId) {
        if (userId === undefined || userId === null) {
            return null
        }
        try {
            let usersFound = await User.deleteOne({ "_id": userId })

            if (usersFound) {
                return usersFound
            }
            return null
        }
        catch (error) {
            console.log('error while looking of a user in the database the in service')
            console.log(error)
            return null
        }
    }

}