const editJsonFile = require("edit-json-file");
const admins = editJsonFile('./admins.json');
let adminListIndex=admins.get("Admins Number");
const User = require('./User');


//Sleep in ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Reset all User parameters to default values
function clearUser(u){
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
    if(d>28 && m=="February"){
        //last day of February for UTC - user is a day ahead
        m=months[a.getMonth()+1];
        d=1;
    }else if(d<1 && m=="March"){
        //first day of March for UTC - user is a day behind
        m=months[a.getMonth()-1];
        d=28;
    }
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
    if(d>31 && (m=="January" || m=="March" || m=="May" || m=="July" || m=="August" || m=="October")){
        //last day of months with 31 days for UTC - user is a day ahead
        m=months[a.getMonth()+1];
        d=1;
    }else if(d<1 && (m=="April" || m=="June" || m=="August" || m=="September" || m=="November")){
        //first day of months where previous month has 31 days for UTC - user is a day behind
        m=months[a.getMonth()-1];
        d=31;
    }
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
    if(h<10) h='0'+h;
    if(min<10) min='0'+min;
    if(sec<10) sec='0'+sec;
    return d + ' ' + m + ' ' + y + '\t-\t' + h + ':' + min + ':' + sec;
}

//Set online status on log channel and ask for possible new username of the channel
function startup(){
    const text="---------\n\n@DoggoReportBot: ✅ Online\n\n---------";
    //bot.telegram.sendMessage(canaleLOG,text);
    const m="Bot is currently online again. ✅\nIs the channel's username still @"+channelName+"?\n\n"
           +"If yes then don't do anything. Otherwise set the new username using the command:\n/setusername your_new_username.";
    //bot.telegram.sendMessage(adminID,m);
    console.log("@DoggoReportBot online ✓\n");
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
    var t="";
    if(data.surname == undefined && data.username == undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nLanguage: "+lang+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nLanguage: "+lang+"\n******************************";
    else if(data.surname==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    else
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    return t;
}

//sends message from user to admin
async function toAdmin(a){
    //if admin didn't reply to himself, forward the reply
    if(a.message.from.id != adminID){
        a.forwardMessage(adminID,a.message.text);

        //if the user has strict privacy forwarding settings, send dummy message for admin
        if(privacy==true){
            await sleep(500);  //delays the next message for 0,5 sec. This way it's sure it will always be 2nd
            var m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m='👆 Message sent by: '+a.from.first_name+' [<code>'+a.from.id+'</code>]\n'
                 //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                 +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else if(a.from.username == undefined)
                m='👆 Message sent by: '+a.from.first_name+' '+a.from.last_name+' [<code>'+a.from.id+'</code>]\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                 +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else if(a.from.last_name == undefined)
                m='👆 Message sent by: '+a.from.first_name+' [<code>'+a.from.id+'</code>] - @'+a.from.username+'\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                 +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else
                m='👆 Message sent by: '+a.from.first_name+' '+a.from.last_name+' [<code>'+a.from.id+'</code>] - @'+a.from.username+'\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                 +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            //m=m+'\n\n'+info(a);
            const newMessage=m.concat('\n\n',info(a));
            a.telegram.sendMessage(adminID,newMessage,{parse_mode: 'HTML'});
        }
    }
}

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
    var bot="";
    if(data.isBot) bot="✅"; else bot="❌";
    var t="";
    if(data.surname == undefined && data.username == undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.name+"\nLanguage: "+lang+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nLanguage: "+lang+"\n******************************";
    else if(data.surname==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.name+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    else
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    return t;
}

//get ctx parameter and create an User object from that
function setUser(a){
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
            current_user.set_isBan      =   false;
            current_user.set_isActive   =   true;
            current_user.set_isCreator  =   false;
        }else if(a.message.reply_to_message.from.id==botID && /^👆/.test(a.message.reply_to_message.text)){
            //reply to dummy, the user has restricted privacy settings, only info I can get is full name and id
            current_user.set_id         =   idFromDummy(a);
            current_user.set_firstName  =   undefined;
            current_user.set_lastName   =   undefined;
            current_user.set_fullName   =   nameFromDummy(a);
            current_user.set_isAdmin    =   checkAdminId(current_user.get_id);
            current_user.set_isSuperior =   checkSuperiorId(current_user.get_id);
            current_user.set_username   =   usernameFromDummy(a);
            current_user.set_lang       =   langFromDummy(a).toUpperCase();
            current_user.set_timeZone   =   0;
            current_user.set_isBot      =   false;  //bots can't restrict privacy settings, so it's not a bot
            current_user.set_isPrivate  =   true;
            current_user.set_isBan      =   false;
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
        current_user.set_lang       =   a.message.from.language_code;
    }
}

function initFiles(){
    //if the file is empty (admin number doesn't exist), set admin number to 0
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
}

function add_AdminToFile(u,d){
    admins.append("List", {"Admin #":adminListIndex, "ID":u.get_id,
                           "Full Name":u.get_fullName, "isAdmin":u.get_isAdmin, "isSuperior":u.get_isSuperior,
                           "Username":u.get_username, "Language":u.get_lang,
                           "isPrivate":u.get_isPrivate, "Time Zone (UTC)":u.get_timeZone,
                           "Date of Promotion":UnixTimestamp(d)});
    adminListIndex++;   //increment number of the next admin
    admins.set("Admins Number",adminListIndex);  //update admin index
    admins.save();
}

function removeFromFile(i){
    let n=admins.get("Admins Number");
    const a=admins.toObject();

    //use parameter i to determine which admin has to be removed from the list
    a.List.splice(i,1);
    admins.set("Admins Number",n-1);    //update admin index
    admins.save();
}

function demote_AdminToFile(id){
    let i=1;    //start check at index 1, because index 0 of List will always be creator and creator can't be demoted
    const a=admins.toObject();

    //there is only an element in Admin array (creator) - user can't be demoted if he's not even an admin
    if(a.List.length==1) return -1000;

    //loop though all the admins except the 1st one (because he is creator)
    do{
        //if user's ID attribute is equal to id (parameter) and the user has isAdmin set to true, transfom user in normal user and return success
        if(a.List[i].ID==id && a.List[i].isAdmin==true){
            //if admin is superior, he will be demoted to normal admin
            if(a.List[i].isSuperior==true) {
                a.List[i].isSuperior=false;
                admins.save();
                return -1;
            }
            removeFromFile(i);
            return 1;
        }
        i++;
    }while(i<adminListIndex);

    //if loop ends without finding a match, error has occoured, possible cause: user never was admin
    return -1005;
}

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

function checkCreator(u){
    //u can be either User object or an ID to check
    //check if u is Object or an ID of the creator - otherwise return false
    if(u.get_id==creator.get_id || u==creator.get_id) return true;
    else return false;
}

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

function idFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("[")+1;
    const end = t.indexOf("]");
    var newId = "";
    for(let i=start; i<end; i++)
        newId = newId +''+ t[i];
    return newId;
}

function nameFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("by")+4;
    const end = t.indexOf("[")-1;
    var name = "";
    for(let i=start; i<end; i++)
        name = name +''+ t[i];
    return name;
}

function usernameFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("@")+1;
    const end = t.indexOf("\n\nR");
    var username = "";
    for(let i=start; i<end; i++)
        username = username +''+ t[i];
    return username;
}

function langFromDummy(a){
    const t = a.message.reply_to_message.text;
    const start = t.indexOf("\nLanguage:")+11;
    const end = t.indexOf("\n******************************");
    var lang = "";
    for(let i=start; i<end; i++)
        lang = lang +''+ t[i];
    return lang;
}

module.exports = {
    sleep,
    clearUser,
    UnixTimestamp,
    startup,
    info,
    toAdmin,
    infoCommand,
    setUser,
    initFiles,
    add_AdminToFile,
    removeFromFile,
    demote_AdminToFile,
    setSuperiorId,
    checkAdmin,
    checkCreator,
    checkSuperior,
    checkAdminId,
    checkSuperiorId,
    idFromDummy,
    nameFromDummy,
    usernameFromDummy,
    langFromDummy
}