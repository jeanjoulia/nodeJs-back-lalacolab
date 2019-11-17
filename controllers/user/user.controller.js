import mediaService from '../../services/media.service.js'
import userService from '../../services/user.service.js'
import HTTP_STATUS from '../../constants/httpStatus.js'

export default class userController {

    /**
    * @description add a profile picture
    * @listens /create
    * @method create
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return the id of the user
    */
    static async create(req, res) {

    }

    /**
    * @description delete the user
    * @listens /delete/:id
    * @method delete
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return deleted user 
    */
    static async delete(req, res) {

    }

    /**
    * @description get the user using his id
    * @listens /get/:id
    * @method get
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return fetched user 
    */
    static async get(req, res) {

    }

    /**
    * @description edit a user 
    * @listens /edit/:id
    * @method patch
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return user before being modfied 
    */
    static async patch(req, res) {
        const body = req.body
        const id = req.params.id

        console.debug(body.length)
        console.debug(id)

        if (Object.entries(body).length === 0 || body === undefined || id === undefined) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'missing information in the request information' })
        }

        const userTargeted = await userService.update(id, body)
        console.debug(userTargeted)

        if (userTargeted === null) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'user dont exist' })
        }


        return res.status(HTTP_STATUS.OK).json({ oldUser: userTargeted })
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

    /**
    * @description fetch users that match 
    * @listens /query
    * @method query
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return list of user that match the given atribute 
    */
    static async query(req, res) {

    }

    /**
    * @description sign in the user 
    * @listens /signIn
    * @method signIn
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return .........
    */
    static async signIn(req, res) {

    }

    /**
    * @description sign out the user
    * @listens /signOut/:id
    * @method signOut
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return .......
    */
    static async signOut(req, res) {

    }

    /**
    * @description validate the user once created
    * @listens /validate/:id
    * @method validate
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return ......... 
    */
    static async validate(req, res) {

    }

}