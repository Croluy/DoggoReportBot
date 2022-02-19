const {Telegraf} = require('telegraf');
require('dotenv').config();
const editJsonFile = require("edit-json-file");

let file = editJsonFile(`./blacklist.json`);

const adminID = process.env.CREATOR_ID;  //ID creator
const botID = 5198012118;   //ID: @DoggoReportBot
const canaleLOG = process.env.CANALE_LOG;    //canale log attività
var channelName = process.env.CHANNEL_NAME;
var privacy=false;  //privacy variable for user forwarded messages

const bot = new Telegraf(process.env.BOT_TOKEN);

//sleep in ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Trasformo unix in data normale
function UnixTimestamp(b){
    const a = new Date(b * 1000);
    const mesi = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const anno = a.getFullYear();
    const mese = mesi[a.getMonth()];
    const giorno = a.getDate();
    var ora = a.getHours()+1;  //server gcloud è su fuso orario indietro di un'ora rispetto a Italia
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
        "nome": a.message.chat.first_name,
        "cognome": a.message.chat.last_name,
        "username": a.message.chat.username,
        "lingua": a.from.language_code,
        "data": a.message.date,
        "messaggio": a.message.text
    }
    const d=UnixTimestamp(data.data);
    const lang=data.lingua.toUpperCase();
    var t="";
    if(data.cognome == undefined && data.username == undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.nome+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else if(data.cognome==undefined)
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.nome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    else
        t="*************INFO*************\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\nDate: "+d+"\n******************************";
    return t;
}

async function toAdmin(a){
    //if admin didn't reply to himself, forward the reply
    if(a.message.from.id != adminID){
        a.forwardMessage(adminID,a.message.text);

        //if the user has strict privacy forwarding settings, send dummy message for admin
        if(privacy==true){
            await sleep(500);  //delays the next message for 0,5 sec.. this way it's sure it will always be 2nd
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
            await sleep(500);  //delays the next message for 0,5 sec.. this way it's sure it will always be 3rd
            a.telegram.sendMessage(adminID,info(a));
        }
    }
}

function infoCommand(a){
    const data={
        "id":a.message.reply_to_message.forward_from.id,
        "isBot":a.message.reply_to_message.forward_from.is_bot,
        "nome":a.message.reply_to_message.forward_from.first_name,
        "cognome":a.message.reply_to_message.forward_from.last_name,
        "username":a.message.reply_to_message.forward_from.username,
        "lingua":a.message.reply_to_message.forward_from.language_code,
        "data":a.message.reply_to_message.forward_date
    }
    const d=UnixTimestamp(data.data);
    const lang=data.lingua.toUpperCase();
    var bot="";
    if(data.isBot) bot="✅"; else bot="❌";
    var t="";
    if(data.cognome == undefined && data.username == undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nLanguage: "+lang+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nLanguage: "+lang+"\n******************************";
    else if(data.cognome==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    else
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    return t;
}

function infoStrictCommand(a){
    const s=a.message.reply_to_message.text;
    const startID = s.indexOf("[")+1;
    const endID = s.indexOf("]");
    var newId="";
    for(let i=startID;i<endID;i++)
        newId=newId+''+s[i];
    

    
    const data={
        "id":newId,
        "isBot":a.message.reply_to_message.forward_from.is_bot,
        "nome":a.message.reply_to_message.forward_from.first_name,
        "cognome":a.message.reply_to_message.forward_from.last_name,
        "username":a.message.reply_to_message.forward_from.username,
        "lingua":a.message.reply_to_message.forward_from.language_code,
        "data":a.message.reply_to_message.forward_date
    }
    const d=UnixTimestamp(data.data);
    const lang=data.lingua.toUpperCase();
    var bot="";
    if(data.isBot) bot="✅"; else bot="❌";
    var t="";
    if(data.cognome == undefined && data.username == undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nLanguage: "+lang+"\n******************************";
    else if(data.username==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nLanguage: "+lang+"\n******************************";
    else if(data.cognome==undefined)
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    else
        t="*************INFO*************\nIs Bot: "+bot+"\nID: "+data.id+"\nName: "+data.nome+"\nSurname: "+data.cognome+"\nUsername: @"+data.username+"\nLanguage: "+lang+"\n******************************";
    return t;
    
}

startup();

//Funzione start
bot.start((ctx) => {
    if(ctx.message.chat.id == adminID) {
        ctx.reply('Welcome @'+ctx.message.chat.username+'! 🎉🎉\n'
                 +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n'
                 +'You\'re set as an admin for this bot! 👮\n'
                 +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀');
    }else{
        ctx.reply('Hey, thanks for dropping by. 👋🏻\n'
                 +'This bot lets you contact the admins of @'+channelName+'.\n'
                 +'Just write to me anything and admins will see and reply to your message. 👨‍💻\n'
                 +'You can send me funny images of scammers. 🤡');
        toAdmin(ctx);
    }
});

bot.command('info', (ctx) => {
    if(ctx.message.chat.id == adminID) {
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendMessage(ctx.message.chat.id, infoCommand(ctx));
            }else{
                if(ctx.message.reply_to_message.forward_sender_name !== undefined){
                    //user has blocked the bot from sending his ID alongside forwarded messages
                    //admin tries to reply to the user message but it will NOT work
                    //admin has to reply to dummy message instead
                    ctx.reply('I am sorry. I can\'t provide you the info on this user.\n'
                             +'The user has restricted that info from the Privacy Settings.\n\n'
                             +'You can still see all the infos of this user in the 2nd message below.');
                }else if(ctx.message.reply_to_message.from.id == adminID){
                    //Admin uses info on himself
                    ctx.reply(info(ctx));
                }else if(ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text)){
                    //admin tries to reply to bot - dummy message
                    //ctx.telegram.sendMessage(adminID,infoStrictCommand(ctx));
                    ctx.reply('Unfortunately it is not possible to gather infos about this user.\n'
                             +'But you can still see all the infos of this user in the 2nd message below.');
                }else{
                    //User uses comand on bot
                    ctx.reply('You can\'t use this command on the bot. Why would you even need to know that?\n'
                             +'Lmao. 😂');
                }
            }
        }else{
            //admin hasn't selected any message to check the user info
            ctx.reply('Please select a message to check the user info! 👍🏻');
        }
    }
});

//set username for the channel - it's used to print it during the "/start" comand
bot.command('setusername', (ctx) => {
    if(ctx.message.chat.id == adminID) {
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');
        channelName=input;

        ctx.reply('Username of the channel changed successfully! 🎉\n'
                 +'Please remember to set this username to the main channel too.\n\n'
                 +'Have you done it already?\nThen you should be able to enter the channel from @'+channelName+'.');
    }
});

//ban user from the bot, impeding him to write to admins
bot.command(['ban','terminate'], (ctx) => {
    if(ctx.message.chat.id == adminID) {
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');

        {/**
        fs.writeFile(blacklist_filename, JSON.stringify(blacklist), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Successfully written data to file");
        });
        */}



        ctx.reply('Username of the channel terminated successfully! 🎉\n'
                 +'That moron won\'t be able to disturb you anymore. 😈\n'
                 +'\nIf for whatever reason you\'ll change your mind, use /unban or /save command.');
    }
});

//help command
bot.help((ctx) => {
    if(ctx.message.chat.id == adminID) {
        //admin help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'Your status: Admin 👮‍♀️\n'
                 +'\nCommands:\n'
                 +'~ /help \t=>\t this command;\n'
                 +'~ /setusername [new_username] \t=>\t lets the bot know the new linked channel username;\n'
                 +'~ /info \t=>\t reply to a message with this command to get infos about the user;\n\n'
                 +'~ /ban OR /terminate \t=>\t forbids an user to keep using the bot;\n'
                 +'~ /blackli \t=>\t this command;\n'
                 +'Do you want to know how to reply to users?\nJust reply to the user message bro, it\'s that simple. 🤷🏻‍♂️\n');
    }else{
        //user help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'Your status: User 👤\n'
                 +'\nCommands:\n'
                 +'~ /help \t=>\t this command;\n'
                 +'\nThis bot lets you contact the admins of @'+channelName+'.\n'
                 +'Just write to me anything and admins will eventually reply to your message. 👨‍💻\n'
                 +'You can send me screenshots of funny scammers chat. 🤡');
    }
});

//list banned users
bot.command(['blacklist','banlist'], (ctx) => {
    if(ctx.message.chat.id == adminID) {
        ctx.reply(file.get());
    }
});

//sender_chat
//forward_from_chat
//deleteMessage for deleting a message the admin has sent
//my_chat_member for letting the admin know if an user ended the bot

bot.hears(/(.+)/, async(ctx) => {
    if(ctx.message.chat.id == adminID) {
        const m=ctx.message.text;
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendMessage(ctx.message.reply_to_message.forward_from.id, m);
            }else{
                if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                    //user has blocked the bot from sending his ID alongside forwarded messages
                    //admin tries to reply to the user message but it will NOT work
                    //admin has to reply to dummy message instead
                    ctx.reply('This user has hidden the link to its account from forwarded messages. 👀\n'
                             +'Check for the bot\'s message immediately below the one you wish and reply to that one instead.');
                }else if(ctx.message.reply_to_message.from.id==adminID){
                    //admin tries to reply to its own message
                    ctx.reply('You can\'t message yourself. Who should I forward that to?\n'
                             +'To yourself? Lmao. 😂');
                }else if(ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text)){
                    //admin tries to reply to bot - dummy message
                    const s=ctx.message.reply_to_message.text;
                    const startID = s.indexOf("[")+1;
                    const endID = s.indexOf("]");
                    var newId="";
                    for(let i=startID;i<endID;i++)
                        newId=newId+''+s[i];
                    ctx.telegram.sendMessage(newId,m);
                }else{
                    //admin tries to reply to bot - no important message
                    ctx.reply('You can\'t message the bot mate. Who should I forward that to?\n'
                             +'To yourself? Lmao. 😂');
                }
            }
        }else{
            //admin hasn't selected any message to reply to
            ctx.reply('Please select a message to reply to! 👍🏻');
        }
    }else{
        //it's a normal user who texted the bot, forward the content to admin
        let id=ctx.from.id;
        const chat = await ctx.tg.getChat(id);
        privacy=chat.has_private_forwards;
        toAdmin(ctx);
    }
});

bot.on('photo', (ctx) => {
    if(ctx.message.chat.id == adminID) {
        const p=ctx.message.photo;
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
            console.log(ctx.message.reply_to_message);
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendPhoto(chatID=ctx.message.reply_to_message.forward_from.id, photo=ctx.message.photo.file_id);
            }else{
                //user has blocked the bot from sending his ID alongside forwarded messages
                //admin has to reply to dummy message
                //TODO
                if(ctx.message.reply_to_message.forward_sender_name !== undefined){
                    console.log("\n\nForward from chat:"+ctx.message.reply_to_message.forward_from_chat+"\n\n");
                    //ctx.telegram.sendMessage(ctx.message.reply_to_message.from.id, m);
                }else{
                    ctx.reply('You can\'t message the bot mate. Who should I forward that to?\n'
                            +'To yourself? Lmao. 😂');
                }
            }
        }else{
            //admin hasn't selected any message to reply to
            ctx.reply('Please select a message to reply to! 👍🏻');
        }
    }else{
        //it's a normal user who texted the bot, forward the content to admin
        toAdmin(ctx);
    }
});

bot.launch();    //Esecuzione bot

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));