import config from 'config/config'
import mongoose from 'mongoose'

let con = null

/**
 * @class database
 * @description class that manage the mongoDB database and it's connection object
 * @method connectToServer
 * @method getConnection
 */
export default class database {

    /**
     * @method connectToServer
     * @description init mongoDB connection object
     * @returns {Number} Connection object
     */
    static connectToServer() {
        mongoose.connect(config.get('DATABASE_URI'), {
            useNewUrlParser: true,
        })
        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', false)
        con = mongoose.connection
        return con
    }

    /**
     * @method getConnection
     * @description return mongoDB connection object
     * @returns {Number} Connection object
     */
    static getConnection() {
        return con
    }

}