import mediaService from '../../services/media.service.js'

export default class userController {

    creat(req, res) {

    }

    delete(req, res) {

    }

    get(req, res) {

    }

    patch(req, res) {

    }

    /**
     * @description add a profile picture
     * @listens /add-profile-picture/:id
     * @method addProfilePicture
     * @param {req} req request
     * @param {res} res response
     * @returns {Object} return the status of the operation
     */
    static async addProfilePicture(req, res) {
        const { id } = req.params
        const userTargeted = await userService.getById(id)
        const userConnected = req.user

        // check if the user targeted for the profile picture exist
        if (userTargeted == null) {
            return res.status(HTTP_STATUS.NO_CONTENT).json({ error: 'User doesnt exist' })
        }

        if (userTargeted.profilePictureId != null) {
            mediaService.deleteById(userTargeted.profilePictureId)
        }

        // check if the user connected have the correct right to add the profile picture
        if (userConnected.role.label === 'Admin' || userTargeted.id === userConnected.id) {
            try {

                const upload = await Multer.getStorageSingle('profilePicture')

                // upload the profile picture in the database
                upload(req, res, async () => {

                    // put the id of the profilePicture file in the correct user
                    await UserService.update(userTargeted.id, { profilePictureId: req.file.id })

                })
                return res.status(HTTP_STATUS.OK).json({ status: 'profilePicture corectly add' })
            }
            catch (error) {
                logger.error(error)
                return res.status(HTTP_STATUS.INTERNAL).json({ error: 'something went wrong while putting the file' })
            }
        }

        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'you dont have the correct right' })
    }

    query(req, res) {

    }

    signIn(req, res) {

    }

    signOut(req, res) {

    }

    validate(req, res) {

    }

}