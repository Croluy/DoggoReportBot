require('dotenv').config();
const {Telegraf} = require('telegraf');
const editJsonFile = require("edit-json-file");
let file = editJsonFile('./blacklist.json');
let admins = editJsonFile('./admins.json');
const User = require('./User');
const functions = require('./functions');

const bot_test=true;

global.botID = 5198012118;   //ID: @DoggoReportBot

//set environment variables
global.adminID = process.env.CREATOR_ID;     //ID of the creator
global.adminName = process.env.CREATOR_NAME; //Name && Username of the creator
global.canaleLOG = process.env.CANALE_LOG;   //Log Channel
global.channelName = process.env.CHANNEL_NAME; //Name of Channel linked to bot
global.privacy=false;  //privacy variable for user forwarded messages

global.admins = [];
global.creator = new User(adminID,adminName,false,undefined,adminName,adminName,"EN",1,true,true,false,true);
global.current_user = new User();

const bot = new Telegraf(process.env.BOT_TOKEN);

functions.pushAdmin(creator);

//if it's not a test, then send classic log messages
if(!bot_test) functions.startup();

//Bot start
bot.start((ctx) => {
    functions.setUser(ctx);
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
        functions.toAdmin(ctx);
    }
});

//Get info about user
bot.command('info', (ctx) => {
    if(ctx.message.chat.id == adminID) {
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendMessage(ctx.message.chat.id, functions.infoCommand(ctx));
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
        if(input[0]=="@") input.shift();    //User started username with @, so I remove that
        channelName=input;

        ctx.reply('Username of the channel changed successfully! 🎉\n'
                 +'Please remember to set this username to the main channel too.\n\n'
                 +'Have you done it already?\nThen you should be able to enter the channel from @'+channelName+'.');
    }
});

//Make user into admin
bot.command('admin', (ctx) => {
    if(ctx.message.chat.id == creator.get_id) {
        functions.setUser(ctx);
        //check if username with userId is an admin, scrolling through admin.json
        if(functions.isAdmin(current_user.get_id)) ctx.reply('This user is already Admin! 🙈');
        else{
            //Make sure only bot creator can use this command
            //also make sure the user isn't already Admin
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const newAdminUsername=input;

            const m='Congrats! 🎉 You are now part of the admins of this bot! 👮‍♂️\n'
                +'Discover the new commands available to you.\n'
                +'You can check them out by typing /help in the chat.\n'
                +'When you do that, you\'ll see the status set to Admin. 👀';

            if(newAdminUsername=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){
                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info
                        current_user.set_isAdmin=true;
                        functions.pushAdmin(current_user);
                        if(current_user.get_username != undefined)
                            ctx.reply('User: <b>'+current_user.get_firstName+' '+current_user.get_lastName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
                        else
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
                        ctx.telegram.sendMessage(current_user.get_id,m);
                    }else{
                        //errors
                        if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                            //user has blocked the bot from sending his ID alongside forwarded messages
                            //admin tries to reply to the user message but it will NOT work
                            ctx.reply('This user has hidden the link to its account from forwarded messages tweaking privacy settings.\n'
                                     +'Don\'t worry, we\'ll work around this. 👀\n\n'
                                     +'Check for the bot\'s message immediately below the one you wish and reply to that one instead. 😉');
                        }else if(ctx.message.reply_to_message.from.id==adminID){
                            //admin tries to reply to its own message
                            ctx.reply('You can\'t make yourself admin. You already are one.\n'
                                     +'Lmao. 😂');
                        }else{
                            //admin tries to reply to bot - no important message
                            ctx.reply('You can\'t make the bot an admin. He has even more power than you have\n'
                                     +'There\'s nothing you can offer to him that he doesn\'t already have. Lmao. 😂');
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply('Who should I make admin? You haven\'t given me any target.\nReply to the message of the user you want to make admin.');
                }
            }
            //write to file with admin list the changes
            //write a message to the current user to let him know he became an admin
            //set timezone
            
        }
    }else ctx.reply('I am sorry, you are not allowed to use this command.\n'
                   +'Only the creator of the bot can add or remove admins.');
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
                 +'\t\t# Your status: Admin 👮‍♀️\n'
                 +'\nBot-related commands:\n'
                 +'~ /help \t=>\t this command;\n'
                 +'~ /setusername [new_username] \t=>\t lets the bot know the new linked channel username;\n'
                 +'~ /adminlist \t=>\t see a list of admin users;\n'
                 +'~ /blacklist \t=>\t see a list of banned users;\n'
                 +'\nUser-related commands:\n'
                 +'~ /info \t=>\t reply to a message with this command to get infos about the user;\n'
                 +'~ /admin \t=>\t set an user as an admin of the bot;\n'
                 +'~ /unadmin \t=>\t set an admin as an user of the bot;\n'
                 +'~ /ban [username] OR /terminate [username] \t=>\t forbids an user to keep using the bot;\n'
                 +'~ /unban [username] \t=>\t allows a banned user to keep using the bot;\n\n'
                 +'\nDo you want to know how to reply to users?\nJust reply to the user message bro, it\'s that simple. 🤷🏻‍♂️\n');
    }else{
        //user help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'\t\t# Your status: User 👤\n'
                 +'\nCommand:\n'
                 +'~ /help \t=>\t this command;\n\n'
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
    console.log(ctx.message);
    functions.setUser(ctx);
    if(current_user.get_id == adminID) {
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
            ctx.reply('Please select a message to reply to! 👍🏻\n'
                     +'Or check out your available commands typing /help in chat.');
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