/**
  * @class ParamChecker
  * @description handles the parameter checks
  * @method checkString
  */
export default class ParamChecker {

    /**
     * @method checkString 
     * @description returns 'true' if the varaible is an acceptable String
     * @param {any} variable to check 
     * @returns {Boolean} return true/false if the variable is acceptable/not
     */
    static checkString(variable){
        if (typeof(variable) != "string"){
            console.error(variable + " is not a string")
            return false
        }
        else if (variable == ""){
            console.error(variable + " is empty")
            return false
        }
        else return true
    }

    /**
     * @method checkMail 
     * @description returns 'true' if the varaible is an acceptable Mail
     * @param {any} variable to check 
     * @returns {Boolean} return true/false if the variable is acceptable/not
     */
    static checkMail(variable){
        if (typeof(variable) != "string"){
            console.error(variable + " is not a string")
            return false
        }
        else if (variable == ""){
            console.error(variable + " is empty")
            return false
        }
        else if (!ParamChecker.verifyMailFormat(variable)){
            console.error(variable + " is not a mail address")
            return false
        }
        else return true
    }

    /**
     * @method checkPassword 
     * @description returns 'true' if the varaible is an acceptable Password
     * @param {any} variable to check 
     * @returns {Boolean} return true/false if the variable is acceptable/not
     */
    static checkPassword(variable){
        if (typeof(variable) != "string"){
            console.error(variable + " is not a string")
            return false
        }
        else if (variable == ""){
            console.error(variable + " is empty")
            return false
        }
        else if (variable.length < 6){
            console.error(variable + " is too short for a password (at least 6 characters)")
            return false
        }
        else return true
    }


    static verifyMailFormat(mail){
        var mailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
        var validMail = mail.match(mailRegex);
        return (validMail == mail)
    }

}