import config from 'config/config'
import crypto from 'crypto'
import database from './database.js'
import GridFsStorage from 'multer-gridfs-storage'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'

let upload = null

let gridFSBucket = null

/**
 * @class Util
 * @description class that manage the file upload
 * @method initStorage
 * @method getStorageSingle
 * @method getGridFSBucket
 */
export default class Multer {

    /**
     * @method initStorage
     * @description init the upload object that manage file upload on database
     * @returns {Number} upload object
     */
    static initStorage() {
        const storage = new GridFsStorage({
            url: 'mongodb://localhost/siima_db',
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err)
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname)
                        const fileInfo = {
                            filename,
                            bucketName: config.get('BUCKET_NAME'),
                        }

                        resolve(fileInfo)
                    })
                })
            },
        })

        // eslint-disable-next-line new-cap
        gridFSBucket = new mongoose.mongo.GridFSBucket(database.getConnection().db, { bucketName: config.get('BUCKET_NAME') })

        // tell multer to use the storage object to save the incomming file
        upload = multer({ storage })
        return upload
    }

    /**
     * @method getStorageSingle
     * @description return the upload object used to opload a single file
     * @param {Object} keyFile key value of the file being upload
     * @returns {Number} upload object
     */
    static getStorageSingle(keyFile) {
        return upload.single(keyFile)
    }

    /**
     * @method getGridFSBucket
     * @description return the bucket connection used to read and delete file
     * @returns {Number} Bucket connection
     */
    static getGridFSBucket() {
        return gridFSBucket
    }

}