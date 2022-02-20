require('dotenv').config();
const {Telegraf} = require('telegraf');
const editJsonFile = require("edit-json-file");
let file = editJsonFile('./blacklist.json');
const User = require('./User');
const functions = require('./functions');

const bot_test=true;

const botID = 5198012118;   //ID: @DoggoReportBot

//set environment variables
const adminID = process.env.CREATOR_ID;     //ID of the creator
const adminName = process.env.CREATOR_NAME; //Name && Username of the creator
const canaleLOG = process.env.CANALE_LOG;   //Log Channel
let channelName = process.env.CHANNEL_NAME; //Name of Channel linked to bot
let privacy=false;  //privacy variable for user forwarded messages

global.admins = [];
global.creator = new User(adminID,adminName,false,undefined,adminName,"EN",1,true,true,false,true);
global.current_user = new User();

const bot = new Telegraf(process.env.BOT_TOKEN);

functions.pushAdmin(creator);

//if it's not a test, then send classic log messages
if(!bot_test) startup();

//Bot start
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

//Get info about user
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

//Make user into admin
bot.command('admin', (ctx) => {
    if(ctx.message.chat.id == creator.get_id) {
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');
        const newAdminUsername=input;

        if(newAdminUsername==""){
            //There is no text after the command
            //check if I am actually replying to someone
            if(ctx.message.hasOwnProperty('reply_to_message')){
                if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                    //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                    functions.setUser(ctx);
                    current_user.set_isAdmin=true;
                    functions.pushAdmin(current_user);
                    console.log(admins);

                    ctx.reply('L\'utente '+current_user.get_firstName+' '+current_user.get_lastName+'\t-\t'+current_user.get_username+' ['+current_user.get_id+']\nè stato aggiunto alla lista degli admin! 🎉');
                }else{
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                        //user has blocked the bot from sending his ID alongside forwarded messages
                        //admin tries to reply to the user message but it will NOT work
                        //admin has to reply to dummy message instead
                        ctx.reply('This user has hidden the link to its account from forwarded messages. 👀\n'
                                +'Check for the bot\'s message immediately below the one you wish and reply to that one instead.');
                    }else if(ctx.message.reply_to_message.from.id==adminID){
                        //admin tries to reply to its own message
                        ctx.reply('You can\'t make yourself admin. You already are one.\n'
                                 +'Lmao. 😂');
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
                        ctx.reply('You can\'t make the bot an admin. He has even more power than you have\n'
                                 +'There\'s nothing you can offer to him that he doesn\'t already have. Lmao. 😂');
                    }
                }
            }else{
                //admin hasn't selected any message to reply to
                ctx.reply('Who should I make admin? You haven\'t given me any hint.\nTry again, please.');
            }
        }
        //write to file with admin list the changes
        //write a message to the current user to let him know he became an admin
        //set timezone
        const m='Congrats! You are now part of the admins of this bot! 🎉\n'
               +'Discover and enjoy your new commands available to you.\n'
               +'You can check them out by typing /help. 👀';
        ctx.telegram.sendMessage(current_user.get_id,m);
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
        functions.toAdmin(ctx);
    }
});

bot.on('photo', (ctx) => {
    if(ctx.message.chat.id == adminID) {
        const p=ctx.message.photo;
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
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
        functions.toAdmin(ctx);
    }
});

bot.launch();    //Esecuzione bot

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));