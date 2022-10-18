/**
 * DoggoReportBot - functions.js - file with all the useful functions.
 * Copyright (C) 2022   Croluy
 * 
 * This program comes with ABSOLUTELY NO WARRANTY;
 * This is free software, and you are welcome to redistribute it under certain conditions;
 * See https://www.gnu.org/licenses/ for details.
 */
const editJsonFile = require("edit-json-file");
const admins = editJsonFile('./admins.json');
let adminListIndex=admins.get("Admins Number");
const banned = editJsonFile('./blacklist.json');
let bannedListIndex=banned.get("Banned Users");
const User = require('./User');
const fs = require("fs");
const path = require("path");

//importing Replies from BotReplies.json
const res = fs.readFileSync(path.resolve(__dirname, "BotReplies.json"));
const BotReplies = JSON.parse(res);
const {
    functions: {
        startup: {
            _bot_online_channel,
            bot_online_creator
        },
        info: {
            no_surname_and_username_info,
            no_username_info,
            no_surname_info,
            complete_info
        },
        toAdmin: {
            no_surname_and_username_usr_err_toAdmin,
            no_username_usr_err_toAdmin,
            no_surname_usr_err_toAdmin,
            complete_usr_err_toAdmin,

            no_surname_and_username_usr_privacy_toAdmin,
            no_username_privacy_usr_toAdmin,
            no_surname_privacy_usr_toAdmin,
            complete_privacy_usr_toAdmin,

            no_surname_and_username_admin_err_toAdmin,
            no_username_admin_err_toAdmin,
            no_surname_admin_err_toAdmin,
            complete_admin_err_toAdmin,

            no_surname_and_username_admin_privacy_toAdmin,
            no_username_privacy_admin_toAdmin,
            no_surname_privacy_admin_toAdmin,
            complete_privacy_admin_toAdmin,
        },
        infoCommand: {
            no_surname_and_username_infoCommand,
            no_username_infoCommand,
            no_surname_infoCommand,
            complete_infoCommand
        },
        adminsToMessage: {
            no_username_adminsToMessage,
            username_adminsToMessage
        },
        bannedToMessage: {
            no_username_bannedToMessage,
            username_bannedToMessage
        }
    }
} = BotReplies;

//Parse template literal so it can be used in JSON elements
function s(expression, variablesObj){
    const regexp = /\${\s?([^{}\s]*)\s?}/g;
    let t = expression.replace(regexp, (substring, variables, index) => {
        variables = variablesObj[variables];
        return variables;
    });
    return t;
}

//Sleep in ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Reset all current_user parameters to default values
function clearUser(){
    current_user = new User(undefined,undefined,false,undefined,undefined,undefined,undefined,0,false,false,false,false,true);
}

//Trasform unix time in readable time
function UnixTimestamp(b){
    const a = new Date(b * 1000);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let y = a.getFullYear();
    let m = months[a.getMonth()];
    let d = a.getDate();
    let h = a.getHours()+current_user.get_timeZone;

    //Manage edge cases where the hour change (due to timeZone), also changes day and eventually also month and year
    //  WARNINGS: -  Only works with time zones where difference from UTC is measured in hours
    //               Users with timezones where also minutes differ, will experience bugs
    //            -  If February has 29 days (once every 4 years), errors might occur
    if(h>23){
        d++;
        h-=24;
    }else if(h<0){
        d--;
        h+=24;
    }

    //Special conditions for February
    if(d>28 && m=="February"){
        //last day of February for UTC - user is a day ahead
        m=months[a.getMonth()+1];
        d=1;
    }else if(d<1 && m=="March"){
        //first day of March for UTC - user is a day behind
        m=months[a.getMonth()-1];
        d=28;
    }

    //Special conditions for the end and the start of the year
    if(d>31 && m=="December"){
        //last day of December for UTC - user is a day ahead - year changes
        m=months[0];
        d=1;
        y++;
    }else if(d<1 && m=="January"){
        //first day of January for UTC - user is a day behind - year changes
        m=months[11];
        d=31;
        y--;
    }

    //Special conditionts for the end and the start of the months with 31 days
    if(d>31 && (m=="January" || m=="March" || m=="May" || m=="July" || m=="August" || m=="October")){
        //last day of months with 31 days for UTC - user is a day ahead
        m=months[a.getMonth()+1];
        d=1;
    }else if(d<1 && (m=="April" || m=="June" || m=="August" || m=="September" || m=="November")){
        //first day of months where previous month has 31 days for UTC - user is a day behind
        m=months[a.getMonth()-1];
        d=31;
    }

    //Special conditions for the end and the start of the months with 30 days
    if(d>30 && (m=="April" || m=="June" || m=="September" || m=="November")){
        //last day of months with 30 days for UTC - user is a day ahead
        m=months[a.getMonth()+1];
        d=1;
    }else if(d<1 && (m=="March" || m=="May" || m=="July" || m=="October" || m=="December")){
        //first day of months where previous month has 30 days for UTC - user is a day behind
        m=months[a.getMonth()-1];
        d=30;
    }

    let min = a.getMinutes();
    let sec = a.getSeconds();

    //if number is lower than 10, it gets represented as 2 digit number starting with 0
    if(h<10) h='0'+h;
    if(min<10) min='0'+min;
    if(sec<10) sec='0'+sec;

    //Format  ->  DD Month YYYY  -  hh:mm:ss
    if(d==1) return d + 'st ' + m + ' ' + y + '  -  ' + h + ':' + min + ':' + sec;
    if(d==2) return d + 'nd ' + m + ' ' + y + '  -  ' + h + ':' + min + ':' + sec;
    if(d==3) return d + 'rd ' + m + ' ' + y + '  -  ' + h + ':' + min + ':' + sec;
    return d + 'th ' + m + ' ' + y + '  -  ' + h + ':' + min + ':' + sec;
}

//Set online status on log channel, ask for possible new username of the channel and initializes admin.json file
function startup(b){
    clearUser();
    b.telegram.sendMessage(LogChannel,BotReplies.functions.startup._bot_online_channel);     //logs on log_channel that bot is online
    b.telegram.sendMessage(adminID,s(BotReplies.functions.startup.bot_online_creator,{channelname: channelName}));          //asks creator if the channel name is still correct
    //initialize the files
    initFiles();
}

//Gets user info from a message
function info(a){
    const data = {
        "id": a.message.chat.id,
        "name": a.message.chat.first_name,
        "surname": a.message.chat.last_name,
        "username": a.message.chat.username,
        "language": a.from.language_code,
        "date": a.message.date,
        "messagge": a.message.text
    }
    const lang=data.language.toUpperCase();
    let t="";
    //last name AND username unset
    if(data.surname == undefined && data.username == undefined)
        t=s(BotReplies.functions.infos.no_surname_and_username, {id:data.id, name:data.name, language: lang});
    //username unset
    else if(data.username==undefined)
        t=s(BotReplies.functions.infos.no_username, {id:data.id, name:data.name, surname:data.surname, language: lang});
    //last name unset
    else if(data.surname==undefined)
        t=s(BotReplies.functions.infos.no_surname, {id:data.id, name:data.name, username:data.username, language: lang});
    //last name AND username set
    else
        t=s(BotReplies.functions.infos.complete, {id:data.id, name:data.name, surname:data.surname, username:data.username, language: lang});
    
    return t;
}

//Sends message from user to admin
async function toAdmin(a){
    //if it was not ad admin to reply, send the message to all admins
    if(!checkAdminId(a.message.from.id)){
        //send message to all admins
        let err=toAllAdmins(a,a.message.text);
        //if there is an error, send it to the log channel
        if(err){
            let m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_and_username_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
            else if(a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_username_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            else if(a.from.last_name == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
            else
                m=s(BotReplies.functions.toAdmin.complete_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            
            a.telegram.sendMessage(LogChannel,m,{parse_mode: 'HTML'});
        }

        //if the user has strict privacy forwarding settings, also send dummy message for admin
        if(privacy==true){
            await sleep(500);  //delays the next message for 0,5 sec. This way it's sure it will always be 2nd
            let m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_and_username_usr_privacy_toAdmin, {name: a.from.first_name, id: a.from.id, });
            else if(a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_username_privacy_usr_toAdmin, {name: a.from.first_name, surname: a.from.last_name, id: a.from.id, });
            else if(a.from.last_name == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_privacy_usr_toAdmin, {name: a.from.first_name, id: a.from.id, username: a.from.username});
            else
                m=s(BotReplies.functions.toAdmin.complete_privacy_usr_toAdmin, {name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            const newMessage=m.concat('\n\n',info(a));

            //send message to all admins
            let err=toAllAdmins(a,newMessage,false);
            //if there is an error, send it to the log channel
            if(err){
                let m="";
                if(a.from.last_name == undefined && a.from.username == undefined)
                    m=s(BotReplies.functions.toAdmin.no_surname_and_username_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
                else if(a.from.username == undefined)
                    m=s(BotReplies.functions.toAdmin.no_username_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
                else if(a.from.last_name == undefined)
                    m=s(BotReplies.functions.toAdmin.no_surname_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
                else
                    m=s(BotReplies.functions.toAdmin.complete_usr_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
                
                a.telegram.sendMessage(LogChannel,m,{parse_mode: 'HTML'});
            }
        }
    }else if(checkAdminId(a.message.from.id)){
        //if the user is an admin, send the message to all admins except himself
        let err=toAllAdmins(a,a.message.text,true,a.message.from.id);
        //if there is an error, send it to the log channel
        if(err){
            let m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_and_username_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
            else if(a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_username_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            else if(a.from.last_name == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
            else
                m=s(BotReplies.functions.toAdmin.complete_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            
            a.telegram.sendMessage(LogChannel,m,{parse_mode: 'HTML'});
        }

        //if the user has strict privacy forwarding settings, also send dummy message for admin
        if(privacy==true){
            await sleep(500);  //delays the next message for 0,5 sec. This way it's sure it will always be 2nd
            let m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_and_username_admin_privacy_toAdmin, {name: a.from.first_name, id: a.from.id, });
            else if(a.from.username == undefined)
                m=s(BotReplies.functions.toAdmin.no_username_privacy_admin_toAdmin, {name: a.from.first_name, surname: a.from.last_name, id: a.from.id, });
            else if(a.from.last_name == undefined)
                m=s(BotReplies.functions.toAdmin.no_surname_privacy_admin_toAdmin, {name: a.from.first_name, id: a.from.id, username: a.from.username});
            else
                m=s(BotReplies.functions.toAdmin.complete_privacy_admin_toAdmin, {name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
            const newMessage=m.concat('\n\n',info(a));

            //send message to all admins
            let err=toAllAdmins(a,newMessage,false,a.message.from.id);
            //if there is an error, send it to the log channel
            if(err){
                let m="";
                if(a.from.last_name == undefined && a.from.username == undefined)
                    m=s(BotReplies.functions.toAdmin.no_surname_and_username_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
                else if(a.from.username == undefined)
                    m=s(BotReplies.functions.toAdmin.no_username_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
                else if(a.from.last_name == undefined)
                    m=s(BotReplies.functions.toAdmin.no_surname_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, id: a.from.id});
                else
                    m=s(BotReplies.functions.toAdmin.complete_admin_err_toAdmin, {message: a.message.text, name: a.from.first_name, surname: a.from.last_name, id: a.from.id, username: a.from.username});
                
                a.telegram.sendMessage(LogChannel,m,{parse_mode: 'HTML'});
            }
        }
    }
}

//Sends a specific message to all admins
function toAllAdmins(ctx,m,forward=true,adminsender=null){
    if(adminListIndex==0 || adminListIndex==null){
        return 1;  //ERROR: no admins found
    }
    const a = admins.toObject();

    let aID=null;

    if(adminsender==null){
        //Loop through the admins and send them message
        for(let i=0;i<adminListIndex;i++){
            //update the admin id
            aID=a.List[i].ID;
            //the message is being forwarded by default, if the 3rd parameter is set to false, it will be sent as a regular message
            if(forward==false) ctx.telegram.sendMessage(aID,m,{parse_mode: 'HTML'});
            else if(forward==true) ctx.forwardMessage(aID,m);
        }
    }else{
        //Loop through the admins and send the message to everyone except the one who sent the message
        for(let i=0;i<adminListIndex;i++){
            //update the admin id
            aID=a.List[i].ID;
            if(aID!=adminsender){
                //the message is being forwarded by default, if the 3rd parameter is set to false, it will be sent as a regular message
                if(forward==false) ctx.telegram.sendMessage(aID,m,{parse_mode: 'HTML'});
                else if(forward==true) ctx.forwardMessage(aID,m);
            }
        }
    }
    return 0;
}

//Sends user's info to admin when /info command is run
function infoCommand(a){
    const data={
        "id":a.message.reply_to_message.forward_from.id,
        "isBot":a.message.reply_to_message.forward_from.is_bot,
        "name":a.message.reply_to_message.forward_from.first_name,
        "surname":a.message.reply_to_message.forward_from.last_name,
        "username":a.message.reply_to_message.forward_from.username,
        "language":a.message.reply_to_message.forward_from.language_code,
        "date":a.message.reply_to_message.forward_date
    }
    //const d=UnixTimestamp(data.date);
    const lang=data.language.toUpperCase();
    let bot="";
    if(data.isBot) bot="✅"; else bot="❌";
    let t="";
    if(data.surname == undefined && data.username == undefined)
        t=s(BotReplies.functions.infoCommand.no_surname_and_username_infoCommand, {isbot: bot, id:data.id, name:data.name, language: lang});
    else if(data.username==undefined)
        t=s(BotReplies.functions.infoCommand.no_username_infoCommand, {isbot: bot, id:data.id, name:data.name, surname:data.surname, language: lang});
    else if(data.surname==undefined)
        t=s(BotReplies.functions.infoCommand.no_surname_infoCommand, {isbot: bot, id:data.id, name:data.name, username:data.username, language: lang});
    else
        t=s(BotReplies.functions.infoCommand.complete_infoCommand, {isbot: bot, id:data.id, name:data.name, surname:data.surname, username:data.username, language: lang});
    return t;
}

//Using ctx parameter and sets an User object from that (current_user)
function setUser(a){
    clearUser();
    if(a.message.from.id == creator.get_id && a.message.hasOwnProperty('reply_to_message')==false){
        //Creator of the bot, no need to do anything as this user is already set up
        current_user=creator;
    }else if(a.message.hasOwnProperty('reply_to_message')){
        if(a.message.reply_to_message.hasOwnProperty('forward_from')){
            //have to set current user from replied message (free privacy)
            current_user.set_id         =   a.message.reply_to_message.forward_from.id.toString();
            current_user.set_firstName  =   a.message.reply_to_message.forward_from.first_name;
            current_user.set_isAdmin    =   checkAdminId(current_user.get_id);
            current_user.set_isSuperior =   checkSuperiorId(current_user.get_id);
            current_user.set_isBot      =   a.message.reply_to_message.forward_from.isBot;
            current_user.set_lastName   =   a.message.reply_to_message.forward_from.last_name;
            current_user.set_fullName   =   current_user.get_firstName + ' ' + current_user.get_lastName;
            current_user.set_username   =   a.message.reply_to_message.forward_from.username;
            current_user.set_lang       =   a.message.reply_to_message.forward_from.language_code.toUpperCase();
            current_user.set_timeZone   =   0;
            current_user.set_isPrivate  =   false;      //if user gets to this condition, it means he has free privacy settings
            current_user.set_isActive   =   true;
            current_user.set_isCreator  =   false;
        }else if(a.message.reply_to_message.from.id==botID && /^👆/.test(a.message.reply_to_message.text)){
            //reply to dummy, the user has restricted privacy settings, only info I can get is full name and id
            current_user.set_id         =   idFromDummy(a);
            current_user.set_firstName  =   undefined;
            current_user.set_lastName   =   undefined;
            current_user.set_fullName   =   nameFromDummy(a);
            //if the user name was set from admin dummy message, correct the full name
            if(current_user.get_fullName.startsWith("dmin:")) current_user.set_fullName = adminNameFromDummy(a);
            current_user.set_isAdmin    =   checkAdminId(current_user.get_id);
            current_user.set_isSuperior =   checkSuperiorId(current_user.get_id);
            current_user.set_username   =   usernameFromDummy(a);
            current_user.set_lang       =   langFromDummy(a).toUpperCase();
            current_user.set_timeZone   =   0;
            current_user.set_isBot      =   false;  //bots can't restrict privacy settings, so it's not a bot
            current_user.set_isPrivate  =   true;
            current_user.set_isActive   =   true;
            current_user.set_isCreator  =   false;
        }
    }else{
        //set user from his normal message to the bot
        current_user.set_id         =   a.message.from.id;
        current_user.set_firstName  =   a.message.from.first_name;
        current_user.set_isBot      =   a.message.from.isBot;
        current_user.set_lastName   =   a.message.from.last_name;
        current_user.set_fullName   =   current_user.get_firstName + ' ' + current_user.get_lastName;
        current_user.set_username   =   a.message.from.username;
        current_user.set_lang       =   a.message.from.language_code.toUpperCase();
    }
}

//Using admins.json file set current user
function setUserFromAdminFile(i){
    const a=admins.toObject();

    current_user.set_id = a.List[i].ID;
    current_user.set_fullName = a.List[i]["Full Name"];
    if(a.List[i].Username != null || a.List[i].Username != undefined) current_user.set_username = a.List[i].Username;
    current_user.set_lang = a.List[i].Language;
    current_user.set_isPrivate = a.List[i].isPrivate;
    current_user.set_isAdmin = a.List[i].isAdmin;
    current_user.set_isSuperior = a.List[i].isSuperior;
}

//Using blacklist.json file set current user
function setUserFromBannedFile(i){
    const a=banned.toObject();

    current_user.set_id = a.List[i].ID;
    current_user.set_fullName = a.List[i]["Full Name"];
    if(a.List[i].Username != null || a.List[i].Username != undefined) current_user.set_username = a.List[i].Username;
    current_user.set_lang = a.List[i].Language;
    current_user.set_isPrivate = a.List[i].isPrivate;
    current_user.set_isBan = a.List[i].isBan;
}

//Using admin ID, set the user
function setAdminUser(id){
    clearUser();

    let i=0;
    const a=admins.toObject();

    /*/it's the ID of creator or there is only an element in Admin array (creator) - set user as creator
    if(id==creator.get_id && a.List.length==1){
        current_user=creator;
        return true;
    }*/

    //loop though all the admins except the 1st one
    do{
        //if user's ID attribute is equal to id, set user
        if(a.List[i].ID==id){
            setUserFromAdminFile(i);
            return true;
        }
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, user is not admin
    return false;
}

//Using banned ID, set the user
function setBannedUser(id){
    clearUser();

    let i=0;
    const a=banned.toObject();

    //if there are no users in the banned list, exit the function
    if(banned.get("Banned Users") == null || banned.get("Banned Users") == 0) return false;

    //loop though all the banned users
    do{
        //if user's ID attribute is equal to id, set user
        if(a.List[i].ID==id){
            setUserFromBannedFile(i);
            return true;
        }
        i++;
    }while(i<bannedListIndex);

    //if loop ends without finding a match, user is not banned
    return false;
}

//Initializes admins.json file with admins number and the creator
function initFiles(){
    /**ADMIN FILE */
    //if the file is empty (admin number doesn't exist), set admins number to 0
    if(admins.get("Admins Number") == null || admins.get("Admins Number") == undefined) adminListIndex=0;
    admins.set("Admins Number",adminListIndex);  //write the number of admins at the beginning of the file
    //if there is no admin
    if(admins.get("Admins Number") == 0){
        //write creator as 1st admin
        admins.append("List", {"Admin #":adminListIndex, "ID":creator.get_id,
                               "Full Name":creator.get_fullName, "isSuperior":creator.get_isSuperior,
                               "Username":creator.get_username, "Language":creator.get_lang,
                               "isPrivate":creator.get_isPrivate, "Time Zone (UTC)":creator.get_timeZone,
                               "Date of Promotion":"Since the creation of this bot. LMAO 😂"});
        adminListIndex++;   //increment number of the next admin
        admins.set("Admins Number",adminListIndex);  //update admin index
        admins.save();      //save file
    }

    /**BAN FILE */
    //if the file is empty (banned users number doesn't exist), set banned users to 0
    if(banned.get("Banned Users") == null || banned.get("Banned Users") == undefined) bannedListIndex=0;
    banned.set("Banned Users",bannedListIndex);    //write the number of banned users at the beginning of the file
    banned.save();      //save file
}

//Adds user to admins.json file
function add_AdminToFile(u,d){
    //user is banned, can't promote banned user. You have to unban first
    if(checkBanned(u)) return -1;

    admins.append("List", {"Admin #":adminListIndex, "ID":u.get_id,
                           "Full Name":u.get_fullName, "isAdmin":u.get_isAdmin, "isSuperior":u.get_isSuperior,
                           "Username":u.get_username, "Language":u.get_lang,
                           "isPrivate":u.get_isPrivate, "Time Zone (UTC)":u.get_timeZone,
                           "Date of Promotion":UnixTimestamp(d)});
    adminListIndex++;   //increment number of the next admin
    admins.set("Admins Number",adminListIndex);  //update admin index
    admins.save();
    return 1;
}

//Adds user to blacklist.json
function add_BannedToFile(u,d){
    //user is admin, can't ban admin. He has to get demoted first
    if(checkAdmin(u)) return -1;

    banned.append("List", {"Banned User #":bannedListIndex, "ID":u.get_id,
                           "Full Name":u.get_fullName,
                           "Username":u.get_username, "Language":u.get_lang,
                           "isPrivate":u.get_isPrivate, "Time Zone (UTC)":u.get_timeZone,
                           "Date of Ban":UnixTimestamp(d)});
    bannedListIndex++;   //increment number of the next admin
    banned.set("Banned Users",bannedListIndex);  //update admin index
    banned.save();
    return 1;
}

//Remove admin at index i from admins.json List array
function removeFromFile(i,bannedORadmin){
    let a=null;
    if(bannedORadmin=="admin") a=admins.toObject();
    else if(bannedORadmin=="banned") a=banned.toObject();
    let k=i;

    //use parameter i to determine which admin has to be removed from the list
    a.List.splice(i,1);

    if(i!=a.List.length){
        //decrements "admin #" of all admins who have been promoted after the demoted admin
        do{
            if(bannedORadmin=="admin") a.List[k]["Admin #"]=a.List[k]["Admin #"]-1;
            else if(bannedORadmin=="banned") a.List[k]["Banned User #"]=a.List[k]["Banned User #"]-1;
            k++;
        }while(k < a.List.length);
    }

    //update index
    if(bannedORadmin=="admin"){
        adminListIndex--;
        admins.set("Admins Number",adminListIndex);
        admins.save();
    }else if(bannedORadmin=="banned"){
        bannedListIndex--;
        banned.set("Banned Users",bannedListIndex);
        banned.save();
    }
}

//Demotes superior admins to admins OR admins to normal users given an id
function demote_AdminToFile(id,is_creator){
    let i=1;    //start check at index 1, because index 0 of List will always be creator and creator can't be demoted
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be demoted if he's not even an admin
    if(a.List.length==1) return -1000;

    //loop though all the admins except the 1st one (because he is creator)
    do{
        //if user's ID attribute is equal to id (parameter) and the user has isAdmin set to true, transfom user in normal user and return success
        if(a.List[i].ID==id && a.List[i].isAdmin==true){
            //if admin is superior and it's the creator who tryies to demote him, he will be demoted to normal admin
            if(a.List[i].isSuperior==true && is_creator==true){
                a.List[i].isSuperior=false;
                admins.save();
                return -1;
            }else if(a.List[i].isSuperior==true && is_creator==false){
                //superior admin is trying to demote another superior admin
                return -1010;
            }
            removeFromFile(i,"admin");
            return 1;
        }
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, error has occoured, possible cause: user never was admin
    return -1005;
}

//Removes banned user given an id
function remove_BannedFromFile(id){
    let i=0;    //start check at index 0 of List
    const a=banned.toObject();

    //there are no banned users - user can't be demoted if he's not even banned
    if(a.List.length==0) return -1000;

    //loop though all the banned users
    do{
        //if user's ID attribute is equal to id (parameter), remove him from the list
        if(a.List[i].ID==id){
            removeFromFile(i, "banned");
            return 1;
        }
        i++;
    }while(i<bannedListIndex);

    //if loop ends without finding a match, error has occoured, possible cause: user never was banned
    return -1005;
}

//Sets an admin as superior admin
function setSuperiorId(id){
    let i=1;    //start check at index 1, because index 0 of List will always be creator
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be superior if he's not even admin
    if(a.List.length==1) return -1000;

    //loop though all the admins except the 1st one (because he is creator)
    do{
        //if user's ID attribute is equal to id (parameter) and the user has isSuperior set to false, transfom user in superior and return success
        if(a.List[i].ID==id && a.List[i].isSuperior==false){
            a.List[i].isSuperior=true;
            admins.save();
            return 1;
        }
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, error has occoured, possible cause: user is already superior
    return -1005;
}

//Checks if parameter user is banned by running through blacklist.json file
function checkBanned(u){
    const id=u.get_id;
    //creator is never banned
    if(id==creator.get_id) return false;

    let i=0;
    const b=banned.toObject();

    //there is no one in the file, so user can't be banned
    if(b["Banned Users"]==0 || bannedListIndex == 0) return false;

    //loop though all the banned users
    do{
        //if user's id is listed in 'blacklist.json' he is banned
        if(b.List[i].ID==id) return true;
        i++;
    }while(i<bannedListIndex);

    //if loop ends without finding a match, user is not banned
    return false;
}

//Checks if parameter user is admin by running through admins.json file
function checkAdmin(u){
    const id=u.get_id;
    //creator is always admin
    if(id==creator.get_id) return true;

    let i=1;    //start check at index 1, cause index 0 will always be creator
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be admin
    if(a.List.length==1) return false;

    //loop though all the admins except the 1st one
    do{
        //if user's id is listed in 'admins.json' he is admin
        if(a.List[i].ID==id) return true;
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, user is not admin
    return false;
}

//Checks if parameter user OR parameter user_id is creator comparing to "creator" User
function checkCreator(u){
    //u can be either User object or an ID to check
    //check if u is Object or an ID of the creator - otherwise return false
    if(u.get_id==creator.get_id || u==creator.get_id) return true;
    else return false;
}

//Checks if parameter user is superior admin by running through admins.json file
function checkSuperior(u){
    const id=u.get_id;
    //creator is always superior
    if(id==creator.get_id) return true;

    let i=1;    //start check at index 1, cause index 0 will always be creator
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be superior
    if(a.List.length==1) return false;

    //loop though all the admins except the 1st one
    do{
        //if user's isSuperior attribute is set to true, exit condition, he is superior
        if(a.List[i].ID==id && a.List[i].isSuperior) return true;
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, user is not superior
    return false;
}

//Checks if parameter user_id is admin by running through admins.json file
function checkBannedId(id){
    //creator is never banned
    if(id==creator.get_id) return false;

    let i=0;
    const b=banned.toObject();

    //loop though all the banned users
    do{
        //if user's ID attribute is equal to id, exit condition, he is banned
        if(b.List[i].ID==id) return true;
        i++;
    }while(i<bannedListIndex);

    //if loop ends without finding a match, user is not banned
    return false;
}

//Checks if parameter user_id is admin by running through admins.json file
function checkAdminId(id){
    //creator is always admin
    if(id==creator.get_id) return true;

    let i=1;    //start check at index 1, cause index 0 will always be creator
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be admin
    if(a.List.length==1) return false;

    //loop though all the admins except the 1st one
    do{
        //if user's ID attribute is equal to id, exit condition, he is admin
        if(a.List[i].ID==id) return true;
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, user is not admin
    return false;
}

//Checks if parameter user_id is superior admin by running through admins.json file
function checkSuperiorId(id){
    //creator is always superior
    if(id==creator.get_id) return true;

    let i=1;    //start check at index 1, cause index 0 will always be creator
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be superior
    if(a.List.length==1) return false;

    //loop though all the admins except the 1st one
    do{
        //if user's ID attribute is equal to id and his isSuperior is set to 1, exit condition, he is superior
        if(a.List[i].ID==id && a.List[i].isSuperior) return true;
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, user is not superior
    return false;
}

//Check if there are banned users
function existsBannedUsers(){
    //if the number of banned users is 0 or null, there are no banned users
    if(banned.get("Banned Users")== null || banned.get("Banned Users")== 0) return true;
    else return false;
}

//Using ctx parameter returns id from dummy message for every user with restricted privacy settings
function idFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("[")+1;
    const end = t.indexOf("]");
    var newId = "";
    for(let i=start; i<end; i++)
        newId = newId +''+ t[i];
    return newId;
}

//Using ctx parameter returns full_name from dummy message for every user with restricted privacy settings
function nameFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("by")+5;
    const end = t.indexOf("[")-1;
    var name = "";
    for(let i=start; i<end; i++)
        name = name +''+ t[i];
    return name;
}

//Using ctx parameter returns full_name from admin dummy message for every admin with restricted privacy settings
function adminNameFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("Admin:")+8;
    const end = t.indexOf("[")-1;
    var name = "";
    for(let i=start; i<end; i++)
        name = name +''+ t[i];
    return name;
}

//Using ctx parameter returns username from dummy message for every user with restricted privacy settings
function usernameFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("@")+1;
    const end = t.indexOf("\n\nR");
    var username = "";
    for(let i=start; i<end; i++)
        username = username +''+ t[i];
    return username;
}

//Using ctx parameter returns sys language from dummy message for every user with restricted privacy settings
function langFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("\nLanguage:")+11;
    const end = t.indexOf("\n******************************");
    var lang = "";
    for(let i=start; i<end; i++)
        lang = lang +''+ t[i];
    return lang;
}

//Using ctx parameter returns the list of admins in an ordered way
function adminsToMessage(context){
    const a = admins.toObject();

    let sup='';
    let priv='';
    for(let i=0; i<admins.get("Admins Number"); i++){
        if(a.List[i].isSuperior) sup='✅';
        else sup='🚫';

        if(a.List[i].isPrivate) priv='✅';
        else priv='🚫';

        if(a.List[i].Username != null || a.List[i].Username != undefined || a.List[i].Username != "")
            context.reply(s(BotReplies.functions.adminsToMessage.username_adminsToMessage, {id: a.List[i].ID, name: a.List[i]["Full Name"], superior: sup, username: a.List[i].Username, lang: a.List[i].Language, private: priv, promotion: a.List[i]["Date of Promotion"]}),{parse_mode: 'HTML'});
        else context.reply(s(BotReplies.functions.adminsToMessage.no_username_adminsToMessage, {id: a.List[i].ID, name: a.List[i]["Full Name"], superior: sup, lang: a.List[i].Language, private: priv, promotion: a.List[i]["Date of Promotion"]}),{parse_mode: 'HTML'});
    }
}

//Using ctx parameter returns the list of banned users in an ordered way
function bannedToMessage(context){
    const a = banned.toObject();

    let priv='';
    for(let i=0; i<banned.get("Banned Users"); i++){

        if(a.List[i].isPrivate) priv='✅';
        else priv='🚫';

        if(a.List[i].Username != null || a.List[i].Username != undefined || a.List[i].Username != "")
            context.reply(s(BotReplies.functions.adminsToMessage.username_adminsToMessage, {id: a.List[i].ID, name: a.List[i]["Full Name"], username: a.List[i].Username, lang: a.List[i].Language, private: priv, ban: a.List[i]["Date of Ban"]}),{parse_mode: 'HTML'});
        else context.reply(s(BotReplies.functions.adminsToMessage.no_username_adminsToMessage, {id: a.List[i].ID, name: a.List[i]["Full Name"], lang: a.List[i].Language, private: priv, ban: a.List[i]["Date of Ban"]}),{parse_mode: 'HTML'});
    }
}

//Update info about admin whenever he sends a message to the bot
function update_admin(ctx,user) {
    //Check if the user is admin
    if(checkAdminId(ctx.message.from.id)){
        //Gets the position of that admin user
        let pos=null;
        const a = admins.toObject();
        for(let i=0;i<adminListIndex;i++) {
            if(a.List[i].ID == ctx.message.from.id) {
                pos=i;
                break;
            }
        }

        update_admin_fullname(pos,user);
        update_admin_username(pos,user);
        update_admin_private(pos,user);
    }
}

//Update admin full name
function update_admin_fullname(pos,user){
    const a = admins.toObject();
    if(a.List[pos]["Full Name"] != user.fullname){
        a.List[pos]["Full Name"] = user.fullName;
        admins.save();
    }
}

//Update admin username
function update_admin_username(pos,user){
    const a = admins.toObject();
    if(a.List[pos].Username != user.username){
        a.List[pos].Username = user.username;
        admins.save();
    }
}

//Update admin private state
function update_admin_private(pos,user){
    const a = admins.toObject();
    if(a.List[pos].isPrivate != user.isPrivate){
        a.List[pos].isPrivate = user.isPrivate;
        admins.save();
    }
}

//Export functions
module.exports = {
    s,
    sleep,
    clearUser,
    UnixTimestamp,
    startup,
    info,
    toAdmin,
    toAllAdmins,
    infoCommand,
    setUser,
    setUserFromAdminFile,
    setUserFromBannedFile,
    setAdminUser,
    setBannedUser,
    initFiles,
    add_AdminToFile,
    add_BannedToFile,
    removeFromFile,
    demote_AdminToFile,
    remove_BannedFromFile,
    setSuperiorId,
    checkBanned,
    checkAdmin,
    checkCreator,
    checkSuperior,
    checkBannedId,
    checkAdminId,
    checkSuperiorId,
    existsBannedUsers,
    idFromDummy,
    nameFromDummy,
    adminNameFromDummy,
    usernameFromDummy,
    langFromDummy,
    adminsToMessage,
    bannedToMessage,
    update_admin
}