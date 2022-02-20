//Add admin to list
function pushAdmin(a) {
    admins.push(a);
}

//Sleep in ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Trasform unix time in readable time
function UnixTimestamp(b){
    const a = new Date(b * 1000);
    const mesi = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const anno = a.getFullYear();
    const mese = mesi[a.getMonth()];
    const giorno = a.getDate();
    var ora = a.getHours()+1;  //server is located in 1 h behind time zone
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if(ora<10) ora='0'+ora;
    if(min<10) min='0'+min;
    if(sec<10) sec='0'+sec;
    return giorno + ' ' + mese + ' ' + anno + '\t-\t' + ora + ':' + min + ':' + sec;
}

//Set online status on log channel and ask for possible new username of the channel
function startup(){
    const testo="---------\n\n@DoggoReportBot: ✅ Online\n\n---------";
    bot.telegram.sendMessage(canaleLOG,testo);
    const richiesta="Bot is currently online again.\nIs the channel username still @"+channelName+"?\n\n"
                   +"If yes then don't do anything. Otherwise set the new username using the command:\n/setusername your_new_username.";
    bot.telegram.sendMessage(adminID,richiesta);
    console.log("Bot online\n");
}

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
    const d=UnixTimestamp(data.date);
    const lang=data.language.toUpperCase();
    var t="";
    if(data.surname == undefined && data.username == undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else if(data.surname==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.name+"\nSurname: "+data.surname+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    return t;
}

async function toAdmin(a){
    //if admin didn't reply to himself, forward the reply
    if(a.message.from.id != adminID){
        a.forwardMessage(adminID,a.message.text);

        //if the user has strict privacy forwarding settings, send dummy message for admin
        if(privacy==true){
            await sleep(500);  //delays the next message for 0,5 sec. This way it's sure it will always be 2nd
            var m="";
            if(a.from.last_name == undefined && a.from.username == undefined)
                m='👆 Message sent by '+a.from.first_name+' [<code>'+a.from.id+'</code>]\n'
                 //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                 +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else if(a.from.username == undefined)
                m='👆 Message sent by '+a.from.first_name+' '+a.from.last_name+' [<code>'+a.from.id+'</code>]\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else if(a.from.last_name == undefined)
                m='👆 Message sent by '+a.from.first_name+' [<code>'+a.from.id+'</code>] - @'+a.from.username+'\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            else
                m='👆 Message sent by '+a.from.first_name+' '+a.from.last_name+' [<code>'+a.from.id+'</code>] - @'+a.from.username+'\n'
                //+'This user has hidden the link to its account from forwarded messages. 👀\n'
                +'\n<b><u>Reply to this message instead of the one above.</u></b>\nThis way I can still send your reply.';
            a.telegram.sendMessage(adminID,m,{parse_mode: 'HTML'});
            await sleep(500);  //delays the next message for 0,5 sec. This way it's sure it will always be 3rd
            a.telegram.sendMessage(adminID,info(a));
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
    const d=UnixTimestamp(data.date);
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
    if(a.message.chat.id === creator.get_id){
        //Creator of the bot, no need to do anything as this user is already set up
        return creator;
    }else{
        if(a.message.hasOwnProperty('reply_to_message') && a.message.reply_to_message.hasOwnProperty('forward_from')){
            //have to set current user from replied message
            current_user.set_id         =   a.message.reply_to_message.forward_from.id;
            current_user.set_firstName  =   a.message.reply_to_message.forward_from.first_name;
            current_user.set_isBot      =   a.message.reply_to_message.forward_from.isBot;
            current_user.set_lastName   =   a.message.reply_to_message.forward_from.last_name;
            current_user.set_fullName   =   current_user.get_firstName + ' ' + current_user.get_lastName;
            current_user.set_username   =   a.message.reply_to_message.forward_from.username;
            current_user.set_lang       =   a.message.reply_to_message.forward_from.language_code;
            //I set privacy as false, because if the user is able to get here, it means he has free privacy settings
            current_user.set_isPrivate  =   false;
        }
    }
}

module.exports = {
    pushAdmin,
    sleep,
    UnixTimestamp,
    startup,
    info,
    toAdmin,
    infoCommand,
    setUser
}