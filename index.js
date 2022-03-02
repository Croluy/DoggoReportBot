require('dotenv').config();
const {Telegraf} = require('telegraf');
const editJsonFile = require("edit-json-file");
let file = editJsonFile('./blacklist.json');
let admins = editJsonFile('./admins.json');
const User = require('./User');
const functions = require('./functions');

const bot_test=false;

global.botID = 5198012118;   //ID: @DoggoReportBot

//set environment variables
global.adminID = process.env.CREATOR_ID;     //ID of the creator
global.adminName = process.env.CREATOR_NAME; //Name && Username of the creator
global.canaleLOG = process.env.CANALE_LOG;   //Log Channel
global.channelName = process.env.CHANNEL_NAME; //Name of Channel linked to bot
global.privacy=false;  //privacy variable for user forwarded messages

global.creator = new User(adminID,adminName,false,undefined,adminName,adminName,"EN",1,true,true,true,false,true);
global.current_user = new User();

const bot = new Telegraf(process.env.BOT_TOKEN);


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
                    ctx.reply(functions.info(ctx));
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
    //only creator can add an admin
    if(ctx.message.chat.id == creator.get_id) {
        functions.setUser(ctx);
        //check if username with userId is an admin and has replied to someone and isn't a bot
        if(functions.checkAdmin(current_user) && !current_user.get_isBot && current_user.get_id!=creator.get_id) ctx.reply('This user is already Admin! 🙈');
        else if(current_user.get_id==creator.get_id) ctx.reply('You\'re already an already Admin! ✌🏻\nBut you already knew that, since you developed me. 💡');
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
                   +'When you do that, you\'ll see the status set to Admin. 👀\n\n\n';
                   //+'Now that you\'ve joined the admins, you should provide us with your timezone.\n'
                   //+'So that we can show you your correct local time when it\'s needed.\n'
                   //+'Just type /timezone in chat.\n'
                   //+'NOTICE: You are free to skip this step if you aren\'t interested. ✌🏻';

            if(newAdminUsername=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition - admin replied to user message or bot message if the user had privacy setting up
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info

                        functions.add_AdminToFile(current_user,ctx.message.date);
                        current_user.set_isAdmin=true;

                        if(current_user.get_username != undefined)
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
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
                            ctx.reply('Bruh 😐, I\'m delighted but you can\'t make me an admin. I already have more power than you do.\n'
                                     +'There\'s nothing you can offer to Doggo that he doesn\'t already have. Lmao. 😂');
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply('Who should I make admin? You haven\'t given me any target.\n'
                             +'Reply to the message of the user you want to make admin.');
                }
            }else{
                //admin has written something after the admin command
                ctx.reply('I\'m sorry, I can\'t make an user admin this way yet.\n'
                         +'Just reply to the message of the user you want to make admin.');
            }
        }
        //functions.clearUser(current_user);
    }else ctx.reply('I\'m sorry, you are not allowed to use this command.\n'
                   +'Only the creator of the bot can add or remove admins.');
});

//Make user into admin
bot.command('unadmin', (ctx) => {
    //only creator can remove an admin
    if(ctx.message.chat.id == creator.get_id) {
        functions.setUser(ctx);
        //check if username with userId is an admin and has replied to someone and isn't a bot
        if(functions.checkAdmin(current_user) && !current_user.get_isBot && current_user.get_id!=creator.get_id){
            ctx.reply('This user is already Admin! 🙈');
        }else if(functions.checkCreator(current_user)){
            //Creator used command on himself
            ctx.reply('You can\'t remove yourself from the admins! 😐\n'
                     +'But you already knew that, since you developed me. 💡');
        }
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
                   +'When you do that, you\'ll see the status set to Admin. 👀\n\n\n'
                   +'Now that you\'ve joined the admins, you should provide us with your timezone.\n'
                   +'So that we can show you your correct local time when it\'s needed.\n'
                   +'Just type /timezone in chat.\n'
                   +'NOTICE: You are free to skip this step if you aren\'t interested. ✌🏻';

            if(newAdminUsername=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition - admin replied to user message or bot message if the user had privacy setting up
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info

                        functions.add_AdminToFile(current_user,ctx.message.date);
                        current_user.set_isAdmin=true;

                        if(current_user.get_username != undefined)
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
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
                            ctx.reply('Bruh 😐, I\'m delighted but you can\'t make me an admin. I already have more power than you do.\n'
                                     +'There\'s nothing you can offer to Doggo that he doesn\'t already have. Lmao. 😂');
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply('Who should I make admin? You haven\'t given me any target.\n'
                             +'Reply to the message of the user you want to make admin.');
                }
            }else{
                //admin has written something after the admin command
                ctx.reply('I\'m sorry, I can\'t make an user admin this way yet.\n'
                         +'Just reply to the message of the user you want to make admin.');
            }
        }
    }else ctx.reply('I\'m sorry, you are not allowed to use this command.\n'
                   +'Only the creator of the bot can add or remove admins.');
    functions.clearUser(current_user);
});

//ban user from the bot, impeding him to write to admins
bot.command(['ban','terminate'], (ctx) => {
    if(ctx.message.chat.id == adminID) {
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');



        ctx.reply('Username of the channel terminated successfully! 🎉\n'
                 +'That moron won\'t be able to disturb you anymore. 😈\n'
                 +'\nIf for whatever reason you\'ll change your mind, use /unban or /save command.');
    }
});

//help command
bot.help((ctx) => {
    functions.setUser(ctx);
    if(functions.checkAdmin(current_user)) {
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
bot.command('adminlist', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkCreator(current_user) || functions.checkSuperior(current_user)) {
        //creator of the bot or superior admin
        const list=JSON.stringify(admins.toObject(),null,'\t\t');
        ctx.reply(list);
    }else if(functions.checkAdmin(current_user)){
        //normal admins
        const m='Admin: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\n'
               +'has requested the permission to use the command \'adminlist\' in order to list all the admins\n'
               +'If you wish to grant him this permission, use /superior [his_id]';
        //only creator can grant Superior permissions to an admin
        bot.sendMessage(creator.get_id,m,{parse_mode: 'HTML'});

        //Warn the user that he isn't allowed to use this command yet, but a request has been done to the creator
        ctx.reply('I am sorry, you are not allowed to view a list of all admins at this moment. 😬\n'
                 +'But your request has been sent to the bot\'s creator. 🤩\n'
                 +'He will decide if you should be allowed to use this command. 🧐\n\n'
                 +'You will get notified with a message as soon as he decides.\n'
                 +'Whether he approves or rejects your request.😎\nGood luck!');
    }
});

//list banned users
bot.command('superior', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkCreator(current_user)) {
        //only creator of the bot can use the superior command
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');
        const id=input;

        if(id==undefined || id==null || id=='') {
            //creator has not specified an ID to promote
            ctx.reply('You have not specified an ID to promote.\n'
                     +'Please write the id of the user you wish to promote after the /superior command!');
        }

        if(functions.checkAdminId(id)){
            if(functions.checkSuperiorId(id)){
                //User is already superior admin
                ctx.reply('This user is already a Superior Admin!\n'
                         +'If you wish to demote the user to simple admin, you can type /demote followed by his ID.\n'
                         +'User ID is: <code>'+id+'</code>',{parse_mode: 'HTML'});
            }else{
                //User is admin, but not superior
                switch(functions.setSuperiorId(id)){
                    case -1000:
                        //ERROR: There is no admin other than creator, user can't be promoted
                        ctx.reply('Oops. This user is not admin yet.\n'
                                 +'Before using superior command on a user, the user must be admin.\n'
                                 +'To promote the user to admin, you have to use /admin while replying to his message.');
                        break;
                    case -1000:
                        //ERROR: Loop has ended without a match
                        ctx.reply('An error has occurred, possible cause:\n'
                                 +'This user is already a Superior Admin!\n'
                                 +'If you wish to demote the user to simple admin, you can type /demote followed by his ID.\n'
                                 +'User ID is: <code>'+id+'</code>',{parse_mode: 'HTML'});
                        break;
                    case 1:
                        //SUCCESS: User has been promoted to superior admin.. tell the user that he has been promoted
                        ctx.reply('User has been successfully promoted to superior admin! 🎉');
                        const m='Congrats! 🎉 You are now part of the Super Admins of this bot! 👮‍♂️\n'
                               +'Discover the new commands available to you.\n'
                               +'You can check them out by typing /help in the chat.\n'
                               +'When you do that, you\'ll see the status set to Superior Admin. 👀\n\n\n';
                        ctx.telegram.sendMessage(id,m);
                        break;
                }
            }
        }else{
            //User is not admin, can't be superior
            //ctx.reply('');
        }
    }
});

bot.command('resetadmins', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkAdmin(current_user) && current_user.get_id == adminID) {
        //Creator of the bot
        admins.empty();
        admins.save();
        ctx.reply('Admin list successfully cleared!');
        functions.initFiles();
    }
});

//sender_chat
//deleteMessage for deleting a message the admin has sent
//my_chat_member for letting the admin know if an user ended the bot

//FIXME: not working when admin replies to user
bot.hears(/(.+)/, async(ctx) => {
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
                    const t = ctx.message.reply_to_message.text;
                    const start = t.indexOf("[")+1;
                    const end = t.indexOf("]");
                    var newId = "";
                    for(let i=start; i<end; i++)
                        newId = newId +''+ t[i];
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
    functions.clearUser(current_user);
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

bot.launch();    //Bot execution

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));