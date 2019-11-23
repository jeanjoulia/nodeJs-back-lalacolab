import mediaService from '../../services/media.service.js'
import userService from '../../services/user.service.js'
import HTTP_STATUS from '../../constants/httpStatus.js'
import paramChecker from '../../helpers/paramChecker.js'
import firebase from "firebase"

export default class userController {

    /**
    * @description create a new User
    * @listens /create
    * @method create
    * @param {req} req request
    * @param {res} res response
    * @returns {Object} return the id of the user
    */
    static async create(req, res) {
        const userConnected = req.user
        const { username, mail, password } = req.body

        console.debug("--- ENTERING CREATE-USER ---")
        console.debug("CREATE USER 0: Request info: " + JSON.stringify(req.body))

        // check if a user is already connected
        if (userConnected != null) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'User already connected' })
        }
        console.debug("CREATE USER 1: Connection check")

        // check parameters
        if (!paramChecker.checkString(username) || !paramChecker.checkMail(mail) || !paramChecker.checkPassword(password)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: '"username", "mail" or "password" in request is not acceptable' })
        }
        console.debug("CREATE USER 2: Parameter check")

        // check if the mail is already taken
        let targetedUser = await userService.getByMail(mail)
        if (targetedUser == null || targetedUser.length > 0) {
            console.debug("CREATE USER - Error Database: Mail address already used")
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Mail address already in use' })
        }

        // create user in firebase
        try {
            let firebaseStatus = await firebase.auth().createUserWithEmailAndPassword(mail, password)
            // TODO: Verify this firebase check with Julien
            if (firebaseStatus.user == undefined) {
                console.debug("CREATE USER - Error Firebase: " + JSON.stringify(firebaseStatus))
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: firebaseStatus.message })
            }
        } catch (error) {
            console.debug("CREATE USER - Error Firebase: " + error)
            return res.status(HTTP_STATUS.INTERNAL).json({ error: 'Error while creating user in firebase' })
        }
        console.debug("CREATE USER 3: Firebase creation check")

        // create user in database
        let userId = await userService.create(mail, username)
        console.debug("CREATE USER 4: Database creation check")

        let userCreated = await userService.getById(userId)
        console.debug("CREATE USER 5: Firebase retrieve check")

        if (userCreated == null) {
            // delete firebase user if not created in database
            try {
                await firebase.auth().currentUser.delete()
            }
            catch (error) {
                console.debug("INTERNAL ERROR: can't delete firebase user")
                return res.status(HTTP_STATUS.INTERNAL).json({ error: 'Error while deleting user in firebase' })
            }
            console.debug("CREATE USER 5bis: Firebase not retrieved check")
            return res.status(HTTP_STATUS.INTERNAL).json({ error: 'Error while creating user in database' })
        }

        return res.status(HTTP_STATUS.OK).json({ status: 'User created', user: userCreated })
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
        const { id } = req.params
        const userTargeted = await userService.getById(id)
        const userConnected = req.user

        // check if the user targeted for the profile picture exist
        if (userTargeted == null) {
            return res.status(HTTP_STATUS.NO_CONTENT).json({ error: 'User doesnt exist' })
        }

        // check if the user connected have the correct right to add the profile picture
        if (userConnected.role.label === 'Admin' || userTargeted.id === userConnected.id) {
            try {

                // updates the user information with the requested modifications
                console.log("User to be removed:" + userTargeted + "\n")
                await userService.delete(userTargeted.id)

                let userRemoved = await userService.getById(id)
                onsole.log("User spot (null if removed correctly):" + userRemoved + "\n")

                return res.status(HTTP_STATUS.OK).json({ status: 'user corectly deleted' })
            }
            catch (error) {
                logger.error(error)
                return res.status(HTTP_STATUS.INTERNAL).json({ error: 'something went wrong while updating the user' })
            }
        }

        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'you dont have the correct right' })

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
        const { id } = req.params
        // TODO: Work In Progress
        const userConnected = req.user

        console.debug("--- ENTERING GET-USER ---")
        console.debug("GET USER 0: Request info: " + JSON.stringify(req.user))

        // check if the user targeted for the profile picture exist
        let userTargeted = await userService.getById(id)
        if (userTargeted == null) {
            console.debug("GET USER - Error Database: User does not Exist")
            return res.status(HTTP_STATUS.NO_CONTENT).json({ error: 'User doesnt exist' })
        }
        console.debug("GET USER 1: User existence check")

        // check if the user connected have the correct right to get user info
        if (!(userConnected.role.label === 'Admin' || userTargeted.id === userConnected.id)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'you dont have the correct right' })

        }
        console.debug("GET USER 2: User rights check")

        // return found user
        return res.status(HTTP_STATUS.OK).json({ status: 'user retrieved', user: userTargeted })


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

        if (Object.entries(body).length === 0 || body === undefined || id === undefined) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'missing information in the request information' })
        }

        const userTargeted = await userService.update(id, body)

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