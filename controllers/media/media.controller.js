import MediaService from '../../services/media.service.js'

/**
* @class MediaController
* @description Class handling medias requests.
* @method getMedia
*/
export default class MediaController {

    /**
    * @description return a media
    * @listens /get-media/
    * @method getMedia
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return the status of the process
    */
    static async getMediaImage(req, res) {

        // id of the media to recover from the database
        const { id } = req.params

        // getting the raw media file from the database
        const writeStream = await MediaService.getWriteStream(id)

        // checking if the media file exist

        if (writeStream == null) {
            res.status(404).json({
                err: 'image doesnt exist',
            })
        }
        else {
            writeStream.pipe(res)
        }
    }

}