class User{
    /**
     * @class
     * User's Class Constructor
     * 
     * @param {int}     id          = *Required*            User ID.
     * @param {string}  firstName   = *Required*            First Name of User.
     * @param {bool}    isBot       = [DEFAULT: false]      Is User a bot?
     * @param {string}  lastName    = [DEFAULT: undefined]  Last Name of User.
     * @param {string}  username    = [DEFAULT: undefined]  User's username.
     * @param {string}  lang        = [DEFAULT: EN]         User's IETF Language Tag (device dependant).
     * @param {int}     timeZone    = [DEFAULT: 0]          User's time zone relative to (UTC) Coordinated Universal Time.
     * @param {bool}    isPrivate   = [DEFAULT: false]      Has the User restricted it's privacy forwarding settings?
     * @param {bool}    isAdmin     = [DEFAULT: false]      Is User admin?
     * @param {bool}    isBan       = [DEFAULT: false]      Is User banned?
     * @param {bool}    isActive    = [DEFAULT: true]       Does User have active chat with BOT?
     */
    constructor(id, firstName, isBot=false, lastName=undefined, username=undefined, lang="EN", timeZone=0, isPrivate=false, isAdmin=false, isBan=false, isActive=true){
        //User infos
        this.id = id;
        this.firstName = firstName;
        this.isBot = isBot;
        this.lastName = lastName;
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
     * @return {int} User ID.
     */
    get id(){return this.id;}
    
    /**
     * @return {string} User's first name.
     */
    get firstName(){return this.firstName;}

    /**
     * @return {bool} Is User a bot.
     */
     get isBot(){return this.isBot;}
    
    /**
     * @return {string} User's last name.
     */
    get lastName(){return this.lastName;}
    
    /**
     * @return {string} User's username.
     */
    get username(){return this.username;}
    
    /**
     * @return {string} User's IETF Language Tag (device dependant).
     */
    get lang(){return this.lang;}
    
    /**
     * @return {int} User's time zone UTC
     */
    get timeZone(){return this.timeZone;}
    
    /**
     * @return {bool} Has the User restricted it's privacy forwarding settings?
     */
    get isPrivate(){return this.isPrivate;}
    
    /**
     * @return {bool} Is User admin?
     */
    get isAdmin(){return this.isAdmin;}
    
    /**
     * @return {bool} Is User banned?
     */
    get isBan(){return this.isBan;}
    
    /**
     * @return {bool} Does User have active chat with BOT?
     */
    get isActive(){return this.isActive;}

    /**
     * 
     * @param {int} *Required* User ID.
     */
    set id(id){this.id = id;}

    /**
     * 
     * @param {string} *Required* First name of User.
     */
    set firstName(firstName){this.firstName = firstName;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User a bot?
     */
    set isBot(isBot){this.isBot = isBot;}

    /**
     * 
     * @param {string} [DEFAULT = undefined] Last Name of User.
     */
    set lastName(lastName){this.lastName = lastName;}

    /**
     * 
     * @param {string} [DEFAULT = undefined] User's username.
     */
    set username(username){this.username = username;}

    /**
     * 
     * @param {string} [DEFAULT = EN] User's IETF Language Tag (device dependant).
     */
    set lang(lang){this.lang = lang;}

    /**
     * 
     * @param {int} [DEFAULT = 0] User's time zone relative to (UTC) Coordinated Universal Time.
     */
    set timeZone(timeZone){this.timeZone = timeZone;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Has the User restricted it's privacy forwarding settings?
     */
    set isPrivate(isPrivate){this.isPrivate = isPrivate;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User admin?
     */
    set isAdmin(isAdmin){this.isAdmin = isAdmin;}

    /**
     * 
     * @param {bool} [DEFAULT = false] Is User banned?
     */
    set isBan(isBan){this.isBan = isBan;}

    /**
     * 
     * @param {bool} [DEFAULT = true] Does User have active chat with BOT?
     */
    set isActive(isActive){this.isActive = isActive;}


}