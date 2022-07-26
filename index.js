#!/usr/bin/env node
require('dotenv').config();
const {Telegraf} = require('telegraf');
const editJsonFile = require("edit-json-file");
let blacklist = editJsonFile('./blacklist.json');
let admins = editJsonFile('./admins.json');
const User = require('./User');
const functions = require('./functions');

const bot_test=true;

global.botID = 5198012118;   //ID: @DoggoReportBot

//set environment variables
global.adminID = process.env.CREATOR_ID;     //ID of the creator
global.adminName = process.env.CREATOR_NAME; //Name && Username of the creator
global.LogChannel = process.env.LOG_CHANNEL;   //Log Channel
global.channelName = process.env.CHANNEL_NAME; //Name of Channel linked to bot
global.privacy=false;  //privacy variable for user forwarded messages

global.creator = new User(adminID,adminName,false,undefined,adminName,adminName,"EN",1,true,true,true,false,true);
global.current_user = new User();

const bot = new Telegraf(process.env.BOT_TOKEN);


//if it's not a test, then send classic log messages
if(!bot_test) functions.startup(bot);

//Bot start
bot.start((ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkCreator(current_user)) {
        //creator started the bot
        if(creator.get_username != undefined || creator.get_username != null){
            //has username set
            ctx.reply('Welcome My Lord <b>@'+creator.get_username+'</b>! 🎉🎉\n'
                     +'I\'m going to explain how this whole things works even if you should know already since you literally created me! 👀\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as the <b><u>CREATOR</u></b> of this bot! 👑\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply('Welcome My Lord <b>'+creator.get_fullName+'</b>! 🎉🎉\n'
                     +'I\'m going to explain how this whole things works even if you should know already since you literally created me! 👀\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as the <b><u>CREATOR</u></b> of this bot! 👑\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }
    }else if(functions.checkSuperior(current_user)) {
        //superior admin started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply('Welcome <b>@'+ctx.message.chat.username+'</b>! 🎉🎉\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as a <b><u>SUPERIOR ADMINISTRATOR</u></b> for this bot! 💎\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply('Welcome <b>'+ctx.message.chat.firstName+'</b>! 🎉🎉\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as a <b><u>SUPERIOR ADMINISTRATOR</u></b> for this bot! 💎\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }
    }else if(functions.checkAdmin(current_user)) {
        //admin started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply('Welcome <b>@'+ctx.message.chat.username+'</b>! 🎉🎉\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as an <b><u>ADMINISTRATOR</u></b> for this bot! 👮\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply('Welcome <b>'+ctx.message.chat.firstName+'</b>! 🎉🎉\n'
                     +'This bot lets you manage messages from users on behalf of @'+channelName+'.\n\n'
                     +'You\'re set as an <b><u>ADMINISTRATOR</u></b> for this bot! 👮\n'
                     +'Just reply to any message I forward you and I will send your reply to the selected user! 🚀\n'
                     +'You can check anytime for all your available commands by typing /help in chat! 💡\n', {parse_mode: 'HTML'});
        }
    }else{
        //normal user started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply('Hey <b>@'+ctx.message.chat.username+'</b>, thanks for dropping by. 👋🏻\n'
                     +'This bot lets you contact the admins of @'+channelName+'.\n\n'
                     +'Just write to me anything and admins will see and reply to your message. 👨‍💻\n'
                     +'You can send me funny images of scammers if you wish. 🤡', {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply('Hey <b>'+ctx.message.chat.firstName+'</b>, thanks for dropping by. 👋🏻\n'
                     +'This bot lets you contact the admins of @'+channelName+'.\n\n'
                     +'Just write to me anything and admins will see and reply to your message. 👨‍💻\n'
                     +'You can send me funny images of scammers if you wish. 🤡', {parse_mode: 'HTML'});
        }
        functions.toAdmin(ctx);
    }
    functions.clearUser();
});

//help command
bot.help((ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkCreator(current_user)){
        //creator help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'\t\t# Your status: Creator 👑\n'
                 +'\nBot-related commands:\nIn order to use this commands just type them in chat normally.\n'
                 +'~ /help \t=>\t this command;\n'
                 +'~ /setusername [new_username] \t=>\t lets the bot know the new linked channel username;\n'
                 +'~ /resetadmins \t=>\t demotes all admins and superior admins to normal users except for creator;\n'
                 +'~ /adminlist \t=>\t see a list of all admins of this bot with infos about everyone;\n'
                 +'~ /blacklist \t=>\t see a list of banned users;\n'
                 +'\nUser-related commands:\nIn order to use this commands reply to user\'s message.\n'
                 +'~ /info \t=>\t reply to a message with this command to get infos about the user;\n'
                 +'~ /admin \t=>\t set an user as an admin of the bot;\n'
                 +'~ /unadmin OR /demote \t=>\t if an user is superior admin, he will become admin and if he\'s admin he will become normal user;\n'
                 +'\nUser\'s ID commands:\nIn order to use this commands type the command followed by user\'s ID.\n'
                 +'~ /superior [id] OR /promote [id] \t=>\t set an admin as a superior admin of the bot;\n'
                 +'~ /ban [id] \t=>\t forbids an user to keep using the bot;\n'
                 +'~ /unban [id] \t=>\t allows a banned user to keep using the bot;\n\n'
                 +'\nDo you want to know how to reply to users?\nJust reply to the user message bro, it\'s that simple. 🤷🏻‍♂️\n');
    }else if(functions.checkSuperior(current_user)) {
        //superior admin help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'\t\t# Your status: Superior Admin 💎\n'
                 +'\nBot-related commands:\nIn order to use this commands just type them in chat normally.\n'
                 +'~ /help \t=>\t this command;\n'
                 +'~ /setusername [new_username] \t=>\t lets the bot know the new linked channel username;\n'
                 +'~ /adminlist \t=>\t see a list of all admins of this bot with infos about everyone;\n'
                 +'~ /blacklist \t=>\t see a list of banned users;\n'
                 +'\nUser-related commands:\nIn order to use this commands reply to user\'s message.\n'
                 +'~ /info \t=>\t reply to a message with this command to get infos about the user;\n'
                 +'~ /admin \t=>\t set an user as an admin of the bot;\n'
                 +'~ /unadmin OR /demote \t=>\t demote admin to normal user;\n'
                 +'\nUser\'s ID commands:\nIn order to use this commands type the command followed by user\'s ID.\n'
                 +'~ /ban [id] \t=>\t forbids an user to keep using the bot;\n'
                 +'~ /unban [id] \t=>\t allows a banned user to keep using the bot;\n\n'
                 +'\nDo you want to know how to reply to users?\nJust reply to the user message bro, it\'s that simple. 🤷🏻‍♂️\n');
    }else if(functions.checkAdmin(current_user)) {
        //admin help
        ctx.reply('❔ Help for @DoggoReportBot:\n\n'
                 +'\t\t# Your status: Admin 👮‍♀️\nIn order to use this commands just type them in chat\n'
                 +'\nBot-related commands:\n'
                 +'~ /help \t=>\t this command;\n'
                 +'~ /blacklist \t=>\t see a list of banned users;\n'
                 +'\nUser\'s ID commands:\nIn order to use this commands type the command followed by user\'s ID.'
                 +'~ /ban [id] \t=>\t forbids an user to keep using the bot;\n'
                 +'~ /unban [id] \t=>\t allows a banned user to keep using the bot;\n\n'
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
    functions.clearUser();
});

//Get info about user
bot.command('info', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    //only superior admins can use this command
    if(functions.checkSuperiorId(ctx.message.chat.id)) {
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
    functions.clearUser();
});

//set username for the channel - it's used to print it during the "/start" comand
bot.command('setusername', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkSuperior(current_user)) {
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
    functions.clearUser();
});

//Make user into admin
bot.command(['admin'], (ctx) => {
    //only superior admins can add an admin
    if(functions.checkSuperiorId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        if(functions.checkBanned(current_user)){
            //User can NOT be promoted, he is currently banned.. have to unban first
            if(current_user.get_username != undefined)  //user has username
                ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\n can\'t be added to the admin list! 🎉\n'+
                          'The probable reason is cause he is currently banned. You have to unban him first by running /unban '+current_user.get_id,{parse_mode: 'HTML'});
            else  //user doesn't have an username
                ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\n can\'t be added to the admin list! 🎉\n'+
                          'The probable reason is cause he is currently banned. You have to unban him first by running /unban '+current_user.get_id,{parse_mode: 'HTML'});
        }
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
                   +'When you do that, you\'ll see the status set to Admin. 👀';
                   //+'\n\n\nNow that you\'ve joined the admins, you should provide us with your timezone.\n'
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

                        current_user.set_isAdmin=true;
                        if(functions.add_AdminToFile(current_user,ctx.message.date)){
                            //User can be promoted, he is not banned
                            //FIXME: bug, user in admins.json isn't "isAdmin" field isn't set to true
                            if(current_user.get_username != undefined)  //user has username
                                ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
                            else  //user doesn't have an username
                                ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\nhas been added to the admin list! 🎉',{parse_mode: 'HTML'});
                            ctx.telegram.sendMessage(current_user.get_id,m);
                        }else if(functions.add_AdminToFile(current_user,ctx.message.date) == -1){
                            //User can NOT be promoted, he is currently banned.. have to unban first
                            if(current_user.get_username != undefined)  //user has username
                                ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\n can\'t be added to the admin list! 🎉\n'+
                                          'The probable reason is cause he is currently banned. You have to unban him first by running /unban '+current_user.get_id,{parse_mode: 'HTML'});
                            else  //user doesn't have an username
                                ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\n can\'t be added to the admin list! 🎉\n'+
                                          'The probable reason is cause he is currently banned. You have to unban him first by running /unban '+current_user.get_id,{parse_mode: 'HTML'});
                        }
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
        functions.clearUser();
    }
});

//Demote an user from admin
bot.command(['unadmin','demote'], (ctx) => {
    //only creator can demote an admin
    if(ctx.message.chat.id == creator.get_id) {
        functions.setUser(ctx);
        if(functions.checkBanned(current_user)) return;
        //check if user is creator and isn't a bot
        if(functions.checkAdmin(current_user) && !current_user.get_isBot) {
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const newAdminUsername=input;

            if(newAdminUsername=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition - admin replied to user message or bot message if the user had privacy setting up
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info

                        switch(functions.demote_AdminToFile(current_user.get_id)){
                            case -1000:
                                //ERROR: User is not admin, can't be demoted
                                ctx.reply('The user is not admin so he can\'t be demoted from the list. 👀');
                                break;
                            
                            case -1005:
                                //ERROR: Loop ended without finding a match to demote
                                ctx.reply('Error processing the demotion command. Please try again!');
                                break;

                            case -1:
                                //SUCCESS: User has been successfully demoted back to admin role
                                if(current_user.get_username != undefined)
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been demoted from Superior Admin to Admin! ✓',{parse_mode: 'HTML'});
                                else
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\nhas been demoted from Superior Admin to Admin! ✓',{parse_mode: 'HTML'});
                                
                                const mm='Sadly you have been demoted from your Superior Admin role. 👮‍♂️\n'
                                        +'Don\'t worry though, you can still use the bot like an Admin.\n'
                                        +'You can get more infos by typing /help in the chat.\n'
                                        +'When you do that, you\'ll see the status set to Admin. 👀';
                                ctx.telegram.sendMessage(current_user.get_id,mm);
                                break;

                            case 1:
                                //SUCCESS: User has been successfully demoted back to user role
                                if(current_user.get_username != undefined)
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been removed to the admin list! ✓',{parse_mode: 'HTML'});
                                else
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\nhas been removed to the admin list! ✓',{parse_mode: 'HTML'});
                                
                                const m='Sadly you have been demoted from your admin role. 👮‍♂️\n'
                                       +'Don\'t worry though, you can still use the bot like a normal user.\n'
                                       +'You can get more infos by typing /help in the chat.\n'
                                       +'When you do that, you\'ll see the status set to User. 👀';
                                ctx.telegram.sendMessage(current_user.get_id,m);
                                break;
                        }
                        current_user.set_isAdmin=false;
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
                            ctx.reply('You can\'t demote yourself. Who will keep company to me?\n'
                                     +'Lmao. 😂');
                        }else{
                            //admin tries to reply to bot - no important message
                            ctx.reply('Bruh 😐, I\'m not even angry, just disappointed.\n'
                                     +'Please remember I have more power than you do.\n'
                                     +'There\'s no way you could ever demote me. Lmao. 😂');
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply('Who should I remove from the admin list? You haven\'t given me any target.\n'
                             +'Reply to the message of the user you want to demote from admin position.');
                }
            }else{
                //admin has written something after the admin command
                ctx.reply('I\'m sorry, I can\'t demote an user this way yet.\n'
                         +'Just reply to the message of the user you want to demote from admin position.');
            }
        }
        else if(current_user.get_id==creator.get_id) ctx.reply('You can\'t demote yourself from admin position! ✌🏻\nBut you already knew that, since you developed me. 💡');
        else{
            //User is not admin, he can't be demoted from admin role
            ctx.reply('The user is not admin so he can\'t be demoted from the list. 👀');
        }
        functions.clearUser();
    }
});

//ban user from the bot, impeding him to write to admins
bot.command(['ban','terminate'], (ctx) => {
    //check if the person who sent the command is admin
    if(functions.checkAdminId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        if(functions.checkBanned(current_user)) return;

        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');

        const m='I\'m sad to announce that you\'ve been banned from using this bot! 😅\n'
               +'You\'ll get notified if an admin will eventually unban you. 🤷🏻‍♂️\n'
               +'Until then every message you\'ll send here, won\'t be delivered to admins. 👀';

        if(input==""){
            //there is no parameter/id specified
            //There is no text after the command
            //check if I am actually replying to someone
            if(ctx.message.hasOwnProperty('reply_to_message')){
                //success condition - admin replied to user message or bot message if the user had privacy setting up
                if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                    //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                    //OR
                    //user has limited privacy and I can only print up a little amount of info

                    if(functions.add_BannedToFile(current_user,ctx.message.date)){
                        //User can be banned, he is not admin
                        current_user.set_isBan=true;

                        if(current_user.get_username != undefined)  //user has username
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>] terminated successfully! 🎉\n'
                                     +'It won\'t be able to disturb you anymore. 😈\n', {parse_mode: 'HTML'});
                        else  //user doesn't have an username
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>] terminated successfully! 🎉\n'
                                     +'It won\'t be able to disturb you anymore. 😈\n', {parse_mode: 'HTML'});
                        ctx.telegram.sendMessage(current_user.get_id,m);
                    }else if(functions.add_BannedToFile(current_user,ctx.message.date) == -1){
                        //User can NOT be banned, he is currently admin.. have to unadmin first
                        if(current_user.get_username != undefined)  //user has username
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\n can\'t be banned! 👀\n'+
                                      'The probable reason is cause he is currently set as admin. You have to unadmin him first by running /unadmin in reply to his message.',{parse_mode: 'HTML'});
                        else  //user doesn't have an username
                            ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\n can\'t be banned! 👀\n'+
                                      'The probable reason is cause he is currently set as admin. You have to unadmin him first by running /unadmin in reply to his message.',{parse_mode: 'HTML'});
                    }
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
                        ctx.reply('You can\'t ban yourself.\n'
                                 +'Lmao. 😂');
                    }else{
                        //admin tries to reply to bot - no important message
                        ctx.reply('Bruh 😐, you can\'t ban me. I have more power than you do.\n'
                                 +'If you don\'t behave well, you\'ll be the one to get banned. Lmao. 😂');
                    }
                }
            }else{
                //admin hasn't selected any message to reply to
                ctx.reply('Who should I ban? You haven\'t given me any target.\n'
                         +'Reply to the message of the user you want to ban.');
            }
        }else{
            ctx.reply("Sorry, this functionality is not available yet.\n"+
                      "But you can still use this command by replying to the user you want to ban.");
        }
        functions.clearUser();
    }
});

//Unban user
bot.command('unban', (ctx) => {
    //only admin can unban users
    if(functions.checkAdminId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        //check if user is admin and isn't a bot
        if(functions.checkBanned(current_user)) {
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const newUnbanUsername=input;

            if(newUnbanUsername=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition - admin replied to user message or bot message if the user had privacy setting up
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info

                        switch(functions.remove_BannedFromFile(current_user.get_id)){
                            case -1000:
                                //ERROR: There is no banned user
                                ctx.reply('There doesn\'t seem to be any banned user. Therefore I can\'t unban him. 👀');
                                break;
                            
                            case -1005:
                                //ERROR: Loop ended without finding a match to unban
                                ctx.reply('The user is not banned so he can\'t be unbanned.');
                                break;

                            case 1:
                                //SUCCESS: User has been successfully unbanned
                                if(current_user.get_username != undefined)
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b>\t-\t@'+current_user.get_username+' [<code>'+current_user.get_id+'</code>]\nhas been unbanned! ✓',{parse_mode: 'HTML'});
                                else
                                    ctx.reply('User: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\nhas been unbanned! ✓',{parse_mode: 'HTML'});
                                
                                const mm='You have been unbanned from this bot. From now on, you are free to use it normally. 👀\n'+
                                         'For more infos about this bot please execute /help.';
                                ctx.telegram.sendMessage(current_user.get_id,mm);
                                break;
                        }
                        current_user.set_isBan=false;
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
                            ctx.reply('You can\'t unban yourself.\n'
                                     +'Lmao. 😂');
                        }else{
                            //admin tries to unban the bot
                            ctx.reply('Bruh 😐, I\'m not even angry, just disappointed.\n'
                                     +'Please remember I have more power than you do.\n'
                                     +'There\'s no way you could ever ban me, so there\'s no need for unban. Lmao. 😂');
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply('Who should I remove from the banned list? You haven\'t given me any target.\n'
                             +'Reply to the message of the user you want to unban.');
                }
            }else{
                //admin has written something after the admin command
                ctx.reply('I\'m sorry, I can\'t unban an user this way yet.\n'
                         +'Just reply to the message of the user you want to demote from admin position, no further text is allowed.');
            }
        }
        else if(current_user.get_id==creator.get_id) ctx.reply('You can\'t unban yourself! ✌🏻\nBut you already knew that, since you developed me. 💡');
        else{
            //User is not banned, he can't be unbanned
            ctx.reply('The user is not banned so he can\'t be unbanned. 👀');
        }
        functions.clearUser();
    }
});

//list admin users
bot.command('adminlist', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkSuperior(current_user)) {
        admins = editJsonFile('./admins.json');
        //only superior admins can use this command
        const list=JSON.stringify(admins.toObject(),null,'\t\t');
        ctx.reply(list);
    }else if(functions.checkAdmin(current_user)){
        //normal admins
        const m='Admin: <b>'+current_user.get_fullName+'</b> [<code>'+current_user.get_id+'</code>]\n'
               +'has requested the permission to use the command \'/adminlist\' in order to list all the admins.\n'
               +'If you wish to grant him this permission, use /superior '+current_user.get_id;
        //only creator can grant Superior permissions to an admin
        bot.sendMessage(creator.get_id,m,{parse_mode: 'HTML'});

        //Warn the user that he isn't allowed to use this command yet, but a request has been done to the creator
        ctx.reply('I am sorry, you are not allowed to view a list of all admins at this moment. 😬\n'
                 +'But your request has been sent to the bot\'s creator. 🤩\n'
                 +'He will decide if you should be allowed to use this command. 🧐\n\n'
                 +'You will get notified with a message if he grants you this permission. 😎\nGood luck!');
    }
    functions.clearUser();
});

//list banned users
bot.command('blacklist', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkAdmin(current_user)) {
        blacklist = editJsonFile('./blacklist.json');
        //only admins can use this command
        const list=JSON.stringify(blacklist.toObject(),null,'\t\t');
        ctx.reply(list);
    }
    functions.clearUser();
});

//grant an admin the superior admin permissions
bot.command(['promote','superior'], (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
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
                     +'Please write the id of the user you wish to promote after the /promote command!');
        }else if(functions.checkAdminId(id)){
            //User is admin already, so he can be promoted
            if(functions.checkSuperiorId(id)){
                //User is already superior admin
                ctx.reply('This user is already a Superior Admin!\n'
                         +'If you wish to demote the user to simple admin, you can type /demote replying to his message.\n'
                         +'User ID is: <code>'+id+'</code>',{parse_mode: 'HTML'});
            }else{
                //User is admin, but not superior
                switch(functions.setSuperiorId(id)){
                    case -1000:
                        //ERROR: There is no admin other than creator, user can't be promoted
                        ctx.reply('Oops. This user is not admin yet.\n'
                                 +'Before using promote command on a user, the user must be admin.\n'
                                 +'To make user to admin, you have to use /admin while replying to his message.');
                        break;
                    case -1005:
                        //ERROR: Loop has ended without a match
                        ctx.reply('An error has occurred, possible cause:\n'
                                 +'This user is already a Superior Admin!\n'
                                 +'If you wish to demote the user to simple admin, you can type /demote replying to his message.\n'
                                 +'User ID is: <code>'+id+'</code>',{parse_mode: 'HTML'});
                        break;
                    case 1:
                        //SUCCESS: User has been promoted to superior admin.. tell the user that he has been promoted
                        ctx.reply('User has been successfully promoted to superior admin! 🎉');
                        const m='Congrats! 🎉 You are now part of the Super Admins of this bot! 👮‍♂️\n'
                               +'Discover the new commands available to you.\n'
                               +'You can check them out by typing /help in the chat.\n'
                               +'When you do that, you\'ll see the status set to Superior Admin. 👀';
                        ctx.telegram.sendMessage(id,m);
                        break;
                }
            }
        }else{
            //User is not admin, can't be superior
            ctx.reply('Oops. This user is not admin yet.\n'
                     +'Before using superior command on a user, the user must be admin.\n'
                     +'To make user to admin, you have to use /admin while replying to his message.');
        }
    }
    functions.clearUser();
});

//Clears the admins list and the only admin left is the creator
bot.command('resetadmins', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    //the only admin is the creator, nothing has to be reset
    if(admins.get("Admins Number") == 1){
        ctx.reply('There is only 1 admin, and that is you. There\'s no need to reset the list! 👌🏻');
        functions.clearUser();
        return;
    }
    if(functions.checkCreator(current_user)) {
        //Creator of the bot
        const a=admins.toObject();
        let n=admins.get("Admins Number")-1;
        //send communication to all former admins that they have been demoted
        for(let i=1;i<=n;i++){
            const m='Sadly you have been demoted from your admin role. 👮‍♂️\n'
                   +'Don\'t worry though, you can still use the bot like a normal user.\n'
                   +'You can get more infos by typing /help in the chat.\n'
                   +'When you do that, you\'ll see the status set to User. 👀';
            ctx.telegram.sendMessage(a.List[i].ID,m);
        }
        a.List.splice(1,n);
        admins.set("Admins Number",1);  //only creator is there
        admins.save();
        functions.initFiles();
        ctx.reply('Admin list successfully cleared! 👌🏻');
    }
    functions.clearUser();
});

//sender_chat
//deleteMessage for deleting a message the admin has sent
//my_chat_member for letting the admin know if an user ended the bot

//Bot manages normal messages from/to admins
bot.hears(/(.+)/, async(ctx) => {
    if(functions.checkAdminId(ctx.message.chat.id)) {
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
        functions.setUser(ctx);
        //check if the user is banned
        if(functions.checkBanned(current_user)){
            //User is banned
            ctx.reply("You're banned");
        }else{
            //it's a normal user who texted the bot, forward the content to admin
            let id=ctx.from.id;
            const chat = await ctx.telegram.getChat(id);
            privacy=chat.has_private_forwards;
            functions.toAdmin(ctx);
        }
        functions.clearUser();
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
        if(functions.checkBanned(current_user)) return;
        //it's a normal user who texted the bot, forward the content to admin
        functions.toAdmin(ctx);
    }
});

bot.launch();    //Bot execution

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));