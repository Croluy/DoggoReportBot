class User{
    /**
     * @class
     * User's Class Constructor
     * 
     * @param {string}  id          = *Required*                    User ID.
     * @param {string}  firstName   = *Required*                    First Name of User.
     * @param {bool}    isBot       = [DEFAULT: false]              Is User a bot?
     * @param {string}  lastName    = [DEFAULT: undefined]          Last Name of User.
     * @param {string}  fullName    = [DEFAULT: firstName+lastName] Full Name of User.
     * @param {string}  username    = [DEFAULT: undefined]          User's username.
     * @param {string}  lang        = [DEFAULT: EN]                 User's IETF Language Tag (device dependant).
     * @param {int}     timeZone    = [DEFAULT: 0]                  User's time zone relative to (UTC) Coordinated Universal Time.
     * @param {bool}    isPrivate   = [DEFAULT: false]              Has the User restricted it's privacy forwarding settings?
     * @param {bool}    isAdmin     = [DEFAULT: false]              Is User admin?
     * @param {bool}    isBan       = [DEFAULT: false]              Is User banned?
     * @param {bool}    isActive    = [DEFAULT: true]               Does User have active chat with BOT?
     */
     constructor(id, firstName, isBot=false, lastName=undefined, fullName=firstName+' '+lastName, username=undefined, lang="EN", timeZone=0, isPrivate=false, isAdmin=false, isBan=false, isActive=true){
        //User infos
        this.id = id;
        this.firstName = firstName;
        this.isBot = isBot;
        this.lastName = lastName;
        this.fullName = fullName;
        this.username = username;
        this.lang = lang;
        this.timeZone = timeZone;
        this.isPrivate = isPrivate;

        //Chat infos
        this.isAdmin=isAdmin;
        this.isBan = isBan;
        this.isActive = isActive;
    }

    /**
     * @return {string} User ID.
     */
    get get_id(){return this.id;}
    
    /**
     * @return {string} User's first name.
     */
    get get_firstName(){return this.firstName;}

    /**
     * @return {bool} Is User a bot.
     */
     get get_isBot(){return this.isBot;}
    
    /**
     * @return {string} User's last name.
     */
    get get_lastName(){return this.lastName;}

    /**
     * @return {string} User's full name.
     */
     get get_fullName(){return this.fullName;}
    
    /**
     * @return {string} User's username.
     */
    get get_username(){return this.username;}
    
    /**
     * @return {string} User's IETF Language Tag (device dependant).
     */
    get get_lang(){return this.lang;}
    
    /**
     * @return {int} User's time zone UTC
     */
    get get_timeZone(){return this.timeZone;}
    
    /**
     * @return {bool} Has the User restricted it's privacy forwarding settings?
     */
    get get_isPrivate(){return this.isPrivate;}
    
    /**
     * @return {bool} Is User admin?
     */
    get get_isAdmin(){return this.isAdmin;}
    
    /**
     * @return {bool} Is User banned?
     */
    get get_isBan(){return this.isBan;}
    
    /**
     * @return {bool} Does User have active chat with BOT?
     */
    get get_isActive(){return this.isActive;}

    /**
     * 
     * @param {string} *Required* User ID.
     */
    set set_id(id){this.id = id;}

    /**
     * 
     * @param {string} *Required* First name of User.
     */
    set set_firstName(firstName){this.firstName = firstName;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User a bot?
     */
    set set_isBot(isBot){this.isBot = isBot;}

    /**
     * 
     * @param {string} [DEFAULT = undefined] Last Name of User.
     */
    set set_lastName(lastName){this.lastName = lastName;}

    /**
     * 
     * @param {string} [DEFAULT = undefined] Full Name of User.
     */
     set set_fullName(fullName){this.fullName = fullName;}

    /**
     * 
     * @param {string} [DEFAULT = undefined] User's username.
     */
    set set_username(username){this.username = username;}

    /**
     * 
     * @param {string} [DEFAULT = EN] User's IETF Language Tag (device dependant).
     */
    set set_lang(lang){this.lang = lang;}

    /**
     * 
     * @param {int} [DEFAULT = 0] User's time zone relative to (UTC) Coordinated Universal Time.
     */
    set set_timeZone(timeZone){this.timeZone = timeZone;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Has the User restricted it's privacy forwarding settings?
     */
    set set_isPrivate(isPrivate){this.isPrivate = isPrivate;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User admin?
     */
    set set_isAdmin(isAdmin){this.isAdmin = isAdmin;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User banned?
     */
    set set_isBan(isBan){this.isBan = isBan;}

    /**
     * 
     * @param {bool} [DEFAULT = true] Does User have active chat with BOT?
     */
    set set_isActive(isActive){this.isActive = isActive;}


}

module.exports = User;  //Export the class