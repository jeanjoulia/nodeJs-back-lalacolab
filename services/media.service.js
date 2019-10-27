
//import logger from 'config/logger'
import mongoose from 'mongoose'
import multer from 'helpers/multer'


/**
  * @class MediaService
  * @description handle file operation
  * @method getWriteStream
  * @method deleteById
  */
export default class MediaService {

    /**
     * @method getWriteStream
     * @description return write stream to return image
     * @param {String} mediaId media id
     * @returns {Object} writestream
     */
    static async getWriteStream(mediaId) {
        try {
            // eslint-disable-next-line new-cap
            const result = await multer.getGridFSBucket().find(mongoose.Types.ObjectId(mediaId))
                .toArray()

            if (result[0] == null &&
                result[0].contentType === 'image/jpeg' &&
                result[0].contentType === 'image/png') {
                return null
            }

            // eslint-disable-next-line new-cap
            return await multer.getGridFSBucket().openDownloadStream(mongoose.Types.ObjectId(mediaId))
        }
        catch (error) {
            //logger.error(error)
        }
        return null
    }

    /**
     * @method deleteById
     * @description detete file with specific id
     * @param {String} mediaId media id
     * @returns {Object} return information of file deleted or null if doesn't exist
     */
    static async deleteById(mediaId) {
        const bucket = multer.getGridFSBucket()

        try {
            // eslint-disable-next-line new-cap
            const result = await multer.getGridFSBucket().find(mongoose.Types.ObjectId(mediaId))
                .toArray()

            if (result[0] == null) {
                return null
            }

            // eslint-disable-next-line new-cap
            await bucket.delete(mongoose.Types.ObjectId(mediaId))
            return result[0]
        }
        catch (error) {
            //logger.error(error)
        }
        return null
    }

}