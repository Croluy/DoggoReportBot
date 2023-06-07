#!/usr/bin/env node
/**
 * DoggoReportBot - index.js - main file with all the commands.
 * Copyright (C) 2022   Croluy
 * 
 * This program comes with ABSOLUTELY NO WARRANTY;
 * This is free software, and you are welcome to redistribute it under certain conditions;
 * See https://www.gnu.org/licenses/ for details.
 */
require('dotenv').config();
const {Telegraf} = require('telegraf');
const editJsonFile = require("edit-json-file");
let blacklist = editJsonFile('./blacklist.json', {autosave: true});
let admins = editJsonFile('./admins.json', {autosave: true});
const User = require('./User');
const functions = require('./functions');
const fs = require("fs");
const path = require("path");

const bot_test=true;

//get the id of the bot from its token
global.botID = process.env.BOT_TOKEN.toString().split(':')[0];

//set environment variables
global.adminID = process.env.CREATOR_ID;     //ID of the creator
global.adminName = process.env.CREATOR_NAME; //Name && Username of the creator
global.LogChannel = process.env.LOG_CHANNEL;   //Log Channel
global.channelName = process.env.CHANNEL_NAME; //Name of Channel linked to bot
global.privacy=false;  //privacy variable for user forwarded messages

global.creator = new User(adminID,adminName,false,undefined,adminName,adminName,"EN",1,true,true,true,false,true);
global.current_user = new User();

const bot = new Telegraf(process.env.BOT_TOKEN);

const res = fs.readFileSync(path.resolve(__dirname, "BotReplies.json"));
const BotReplies = JSON.parse(res);
const {
    index: {
        strict_privacy_messsage,
        __start: {
            creator_start,
            creator_no_username_start,
            superior_start,
            superior_no_username_start,
            admin_start,
            admin_no_username_start,
            user_start,
            user_no_username_start
        },
        __help: {
            creator_help,
            superior_help,
            admin_help,
            user_help
        },
        __commands: {
            creator_commands,
            superior_commands,
            admin_commands,
            user_commands
        },
        __credits,
        __info: {
            reply_to_dummy_info,
            from_other_message_info,
            on_bot_info,
            no_message_info
        },
        __setusername: {
            username_changed_setusername
        },
        __admin: {
            banned_admin,
            banned_no_username_admin,
            already_admin,
            creator_is_admin,
            become_admin,
            promoted_admin,
            promoted_no_username_admin,
            self_admin,
            bot_admin,
            no_user_admin,
            argument_after_admin
        },
        __demote: {
            not_admin_demote,
            sup_and_sup_err_demote,
            success_to_admin_demote,
            success_to_admin_no_username_demote,
            message_to_admin_demote,
            success_to_user_demote,
            success_to_user_no_username_demote,
            message_to_user_demote,
            couldnt_set_demote,
            self_demote,
            bot_demote,
            no_user_demote,
            creator_demote
        },
        __ban: {
            message_ban,
            success_ban,
            success_no_username_ban,
            is_admin_ban,
            is_admin_no_username_ban,
            self_ban,
            bot_ban,
            no_user_ban,
            argument_after_ban
        },
        __unban: {
            no_banned_users_unban,
            not_banned_unban,
            success_unban,
            success_no_username_unban,
            message_unban,
            self_unban,
            bot_unban,
            no_user_unban,
            couldnt_set_unban
        },
        __adminlist: {
            ask_creator_adminlist,
            unable_adminlist
        },
        __blacklist: {
            no_banned_users_blacklist
        },
        __promote: {
            no_user_promote,
            already_superior_promote,
            not_admin_promote,
            error_promote,
            success_promote,
            success_no_username_promote,
            couldnt_set_promote,
            message_promote
        },
        __resetadmins: {
            only_one_resetadmins,
            cleared_resetadmins
        },
        __hears: {
            not_found_hears,
            self_hears,
            bot_hears,
            no_message_hears
        }
    }
} = BotReplies;


//if it's not a test, then send classic log messages
if(!bot_test) functions.startup(bot);

//Bot start
bot.start((ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    functions.update_admin(ctx,current_user);
    if(functions.checkCreator(current_user)) {
        //creator started the bot
        if(creator.get_username != undefined || creator.get_username != null){
            //has username set
            ctx.reply(functions.s(BotReplies.index.__start.creator_start, {username: creator.get_username, channel: channelName}), {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply(functions.s(BotReplies.index.__start.creator_no_username_start, {name: creator.get_fullname, channel: channelName}), {parse_mode: 'HTML'});
        }
    }else if(functions.checkSuperior(current_user)) {
        //superior admin started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply(functions.s(BotReplies.index.__start.superior_start, {username: ctx.message.chat.username, channel: channelName}), {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply(functions.s(BotReplies.index.__start.superior_no_username_start, {name: ctx.message.chat.firstName, channel: channelName}), {parse_mode: 'HTML'});
        }
    }else if(functions.checkAdmin(current_user)) {
        //admin started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply(functions.s(BotReplies.index.__start.admin_start, {username: ctx.message.chat.username, channel: channelName}), {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply(functions.s(BotReplies.index.__start.admin_no_username_start, {name: ctx.message.chat.firstName, channel: channelName}), {parse_mode: 'HTML'});
        }
    }else{
        //normal user started the bot
        if(current_user.get_username != undefined || current_user.get_username != null){
            //has username set
            ctx.reply(functions.s(BotReplies.index.__start.user_start, {username: ctx.message.chat.username, channel: channelName}), {parse_mode: 'HTML'});
        }else{
            //doesn't have username set
            ctx.reply(functions.s(BotReplies.index.__start.user_no_username_start, {name: ctx.message.chat.firstName, channel: channelName}), {parse_mode: 'HTML'});
        }
        functions.toAdmin(ctx);
    }
    functions.clearUser();
});

//help command
bot.help((ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    functions.update_admin(ctx,current_user);
    if(functions.checkCreator(current_user)){
        //creator help
        ctx.reply(BotReplies.index.__help.creator_help,{parse_mode: 'HTML'});
    }else if(functions.checkSuperior(current_user)) {
        //superior admin help
        ctx.reply(BotReplies.index.__help.superior_help,{parse_mode: 'HTML'});
        functions.update_admin(ctx,current_user);
    }else if(functions.checkAdmin(current_user)) {
        //admin help
        ctx.reply(BotReplies.index.__help.admin_help,{parse_mode: 'HTML'});
        functions.update_admin(ctx,current_user);
    }else{
        //user help
        ctx.reply(functions.s(BotReplies.index.__help.user_help, {channel: channelName}),{parse_mode: 'HTML'});
    }
    functions.clearUser();
});

//commands
bot.command('commands', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    functions.update_admin(ctx,current_user);
    if(functions.checkCreator(current_user)){
        //creator commands
        ctx.reply(BotReplies.index.__commands.creator_commands,{parse_mode: 'HTML'});
    }else if(functions.checkSuperior(current_user)) {
        //superior admin commands
        ctx.reply(BotReplies.index.__commands.superior_commands,{parse_mode: 'HTML'});
        functions.update_admin(ctx,current_user);
    }else if(functions.checkAdmin(current_user)) {
        //admin commands
        ctx.reply(BotReplies.index.__commands.admin_commands,{parse_mode: 'HTML'});
        functions.update_admin(ctx,current_user);
    }else{
        //user commands
        ctx.reply(functions.s(BotReplies.index.__commands.user_commands, {channel: channelName}),{parse_mode: 'HTML'});
    }
    functions.clearUser();
});

//credits
bot.command('credits', (ctx) => {
    functions.setUser(ctx);
    if(functions.checkBanned(current_user)) return;
    functions.update_admin(ctx,current_user);

    ctx.reply(BotReplies.index.__credits,{parse_mode: 'HTML'});

    functions.clearUser();
});

//Get info about user
bot.command('info', (ctx) => {
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
    if(functions.checkBanned(current_user)) return;
    //only superior admins can use this command
    if(functions.checkSuperiorId(ctx.message.chat.id)) {
        //check if I am actually replying to someone
        if(ctx.message.hasOwnProperty('reply_to_message')){
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendMessage(ctx.message.chat.id, functions.infoCommand(ctx),{parse_mode: 'HTML'});
            }else{
                if(ctx.message.reply_to_message.forward_sender_name !== undefined){
                    //user has blocked the bot from sending his ID alongside forwarded messages
                    //admin tries to reply to the user message but it will NOT work
                    //admin has to reply to dummy message instead
                    ctx.reply(BotReplies.index.__info.reply_to_dummy_info);
                }else if(ctx.message.reply_to_message.from.id == adminID){
                    //Admin uses info on himself
                    ctx.reply(functions.info(ctx));
                }else if(ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text)){
                    //admin tries to reply to bot - dummy message
                    //ctx.telegram.sendMessage(adminID,infoStrictCommand(ctx));
                    ctx.reply(BotReplies.index.__info.from_other_message_info);
                }else{
                    //User uses comand on bot
                    ctx.reply(BotReplies.index.__info.on_bot_info);
                }
            }
        }else{
            //admin hasn't selected any message to check the user info
            ctx.reply(BotReplies.index.__info.no_message_info);
        }
    }
    functions.clearUser();
});

//set username for the channel - it's used to print it during the "/start" comand
bot.command('setusername', (ctx) => {
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkSuperior(current_user)) {
        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');
        if(input[0]=="@") input.shift();    //User started username with @, so I remove that
        channelName=input;

        ctx.reply(functions.s(BotReplies.index.__setusername.username_changed_setusername, {channel: channelName}));
    }
    functions.clearUser();
});

//Make user into admin
bot.command(['admin'], (ctx) => {
    // Reload file from the disk
    admins = editJsonFile(`./admins.json`, {autosave: true});
    //only superior admins can add an admin
    if(functions.checkSuperiorId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        //FIXME:current_user is the user you reply to, so I can't update admin with current_user
        //console.log(JSON.stringify(current_user));
        //functions.update_admin(ctx,current_user);
        if(functions.checkBanned(current_user)){
            //User can NOT be promoted, he is currently banned.. have to unban first
            if(current_user.get_username != undefined && current_user.get_username != "")  //user has username
                ctx.reply(functions.s(BotReplies.index.__admin.banned_admin, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id, id: current_user.get_id}),{parse_mode: 'HTML'});
            else  //user doesn't have an username
                ctx.reply(functions.s(BotReplies.index.__admin.banned_no_username_admin, {name: current_user.get_fullName, id: current_user.get_id, id: current_user.get_id}),{parse_mode: 'HTML'});
            return;
        }
        //check if username with userId is an admin and has replied to someone and isn't a bot
        if(functions.checkAdmin(current_user) && !current_user.get_isBot && current_user.get_id!=creator.get_id) ctx.reply(BotReplies.index.__admin.already_admin);
        else if(current_user.get_id==creator.get_id) ctx.reply(BotReplies.index.__admin.creator_is_admin);
        else{
            //Make sure only bot creator can use this command
            //also make sure the user isn't already Admin
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const UserID=input;

            const m=BotReplies.index.__admin.become_admin;
                   //+'\n\n\nNow that you\'ve joined the admins, you should provide us with your timezone.\n'
                   //+'So that we can show you your correct local time when it\'s needed.\n'
                   //+'Just type /timezone in chat.\n'
                   //+'NOTICE: You are free to skip this step if you aren\'t interested. ✌🏻';

            if(UserID=="") {
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
                            //FIXME: bug, user in admins.json "isAdmin" field isn't set to true
                            if(current_user.get_username != undefined && current_user.get_username != "")  //user has username
                                ctx.reply(functions.s(BotReplies.index.__admin.promoted_admin, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                            else  //user doesn't have an username
                                ctx.reply(functions.s(BotReplies.index.__admin.promoted_no_username_admin, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                            ctx.telegram.sendMessage(current_user.get_id,m);    //tell user of the admin privileges
                        }else if(functions.add_AdminToFile(current_user,ctx.message.date) == -1){
                            //User can NOT be promoted, he is currently banned.. have to unban first
                            if(current_user.get_username != undefined && current_user.get_username != "")  //user has username
                                ctx.reply(functions.s(BotReplies.index.__admin.banned_admin, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id, id: current_user.get_id}),{parse_mode: 'HTML'});
                            else  //user doesn't have an username
                                ctx.reply(functions.s(BotReplies.index.__admin.banned_no_username_admin, {name: current_user.get_fullName, id: current_user.get_id, id: current_user.get_id}),{parse_mode: 'HTML'});
                        }
                    }else{
                        //errors
                        if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                            //user has blocked the bot from sending his ID alongside forwarded messages
                            //admin tries to reply to the user message but it will NOT work
                            ctx.reply(BotReplies.index.strict_privacy_messsage);
                        }else if(ctx.message.reply_to_message.from.id==adminID){
                            //admin tries to reply to its own message
                            ctx.reply(BotReplies.index.__admin.self_admin);
                        }else{
                            //admin tries to reply to bot - no important message
                            ctx.reply(BotReplies.index.__admin.bot_admin);
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply(BotReplies.index.__admin.no_user_admin);
                }
            }else{
                //admin has written something after the admin command
                ctx.reply(BotReplies.index.__admin.argument_after_admin);
            }
        }
        functions.clearUser();
    }
});

//Demote an user from admin
bot.command(['unadmin','demote'], (ctx) => {
    // Reload file from the disk
    admins = editJsonFile(`./admins.json`, {autosave: true});
    //only superior admins can demote an admin
    if(functions.checkSuperiorId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        functions.update_admin(ctx,current_user);
        if(functions.checkBanned(current_user)) return;
        //check if user is creator and isn't a bot
        if(functions.checkAdmin(current_user) && !current_user.get_isBot) {
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const UserID=input;

            //check if the user who exectues command is creator
            let is_creator=false;
            if(ctx.message.from.id==creator.get_id) is_creator=true;

            if(UserID=="") {
                //There is no text after the command
                //check if I am actually replying to someone
                if(ctx.message.hasOwnProperty('reply_to_message')){
                    //success condition - admin replied to user message or bot message if the user had privacy setting up
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_from')  ||  (ctx.message.reply_to_message.from.id==botID && /^👆/.test(ctx.message.reply_to_message.text))){

                        //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                        //OR
                        //user has limited privacy and I can only print up a little amount of info

                        switch(functions.demote_AdminToFile(current_user.get_id,is_creator)){
                            case -1000:
                                //ERROR: User is not admin, can't be demoted
                                ctx.reply(BotReplies.index.__demote.not_admin_demote);
                                break;
                            
                            case -1005:
                                //ERROR: Loop ended without finding a match to demote
                                ctx.reply(BotReplies.index.__demote.not_admin_demote);
                                break;

                            case -1010:
                                //ERROR: Superior Admin tries to demote another Superior Admin
                                ctx.reply(BotReplies.index.__demote.sup_and_sup_err_demote);
                                break;

                            case -1:
                                //SUCCESS: User has been successfully demoted back to admin role
                                if(current_user.get_username != undefined && current_user.get_username != "")
                                    ctx.reply(functions.s(BotReplies.index.__demote.success_to_admin_demote, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                                else
                                    ctx.reply(functions.s(BotReplies.index.__demote.success_to_admin_no_username_demote, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                                
                                const mm=BotReplies.index.__demote.message_to_admin_demote;
                                ctx.telegram.sendMessage(current_user.get_id,mm);
                                current_user.set_isSuperior=false;
                                break;

                            case 1:
                                //SUCCESS: User has been successfully demoted back to user role
                                if(current_user.get_username != undefined && current_user.get_username != "")
                                    ctx.reply(functions.s(BotReplies.index.__demote.success_to_user_demote, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                                else
                                    ctx.reply(functions.s(BotReplies.index.__demote.success_to_user_no_username_demote, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                                
                                const m=BotReplies.index.__demote.message_to_user_demote;
                                ctx.telegram.sendMessage(current_user.get_id,m);
                                current_user.set_isAdmin=false;
                                break;
                        }
                    }else{
                        //errors
                        if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                            //user has blocked the bot from sending his ID alongside forwarded messages
                            //admin tries to reply to the user message but it will NOT work
                            ctx.reply(BotReplies.index.strict_privacy_messsage);
                        }else if(ctx.message.reply_to_message.from.id==adminID){
                            //admin tries to reply to its own message
                            ctx.reply(BotReplies.index.__demote.self_demote);
                        }else{
                            //admin tries to reply to bot - no important message
                            ctx.reply(BotReplies.index.__demote.bot_demote);
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply(BotReplies.index.__demote.no_user_demote);
                }
            }else{
                //set the user before removing it from the admin list
                let user_set=false;
                if(functions.setAdminUser(UserID)) user_set=true;

                //admin has written something after the admin command
                switch(functions.demote_AdminToFile(UserID,is_creator)){
                    case -1000:
                        //ERROR: User is not admin, can't be demoted
                        ctx.reply(BotReplies.index.__demote.not_admin_demote);
                        break;
                    
                    case -1005:
                        //ERROR: Loop ended without finding a match to demote
                        ctx.reply(BotReplies.index.__demote.not_admin_demote);
                        break;

                    case -1010:
                        //ERROR: Superior Admin tries to demote another Superior Admin
                        ctx.reply(BotReplies.index.__demote.sup_and_sup_err_demote);
                        break;

                    case -1:
                        //SUCCESS: User has been successfully demoted back to admin role
                        if(functions.setAdminUser(UserID)){
                            //User has been set successfully
                            if(current_user.get_username != undefined && current_user.get_username != "")
                                ctx.reply(functions.s(BotReplies.index.__demote.success_to_admin_demote, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                            else
                                ctx.reply(functions.s(BotReplies.index.__demote.success_to_admin_no_username_demote, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                            current_user.set_isSuperior=false;
                        }else{
                            //User couldn't be set correctly
                            ctx.reply(functions.s(BotReplies.index.__demote.couldnt_set_demote, {id: UserID}),{parse_mode: 'HTML'});
                        }

                        const mm=BotReplies.index.__demote.message_to_admin_demote;
                        ctx.telegram.sendMessage(UserID,mm);
                        break;

                    case 1:
                        //SUCCESS: User has been successfully demoted back to user role
                        if(user_set){
                            //User has been set successfully
                            if(current_user.get_username != undefined && current_user.get_username != "")
                                ctx.reply(functions.s(BotReplies.index.__demote.success_to_user_demote, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                            else
                                ctx.reply(functions.s(BotReplies.index.__demote.success_to_user_no_username_demote, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                            current_user.set_isAdmin=false;
                        }else{
                            //User couldn't be set correctly
                            ctx.reply(functions.s(BotReplies.index.__demote.couldnt_set_demote, {id: UserID}),{parse_mode: 'HTML'});
                        }

                        const m=BotReplies.index.__demote.message_to_user_demote;
                        ctx.telegram.sendMessage(UserID,m);
                        break;
                }
            }
        }
        else if(current_user.get_id==creator.get_id) ctx.reply(BotReplies.index.__demote.self_demote);
        else{
            //User is not admin, he can't be demoted from admin role
            ctx.reply(BotReplies.index.__demote.not_admin_demote);
        }
        functions.clearUser();
    }
});

//ban user from the bot, impeding him to write to admins
bot.command(['ban','terminate'], (ctx) => {
    // Reload file from the disk
    banned = editJsonFile(`./blacklist.json`, {autosave: true});
    //check if the person who sent the command is admin
    if(functions.checkAdminId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        functions.update_admin(ctx,current_user);
        if(functions.checkBanned(current_user)) return;

        let input=ctx.message.text;
        let inputArray=input.split(' ');

        inputArray.shift();
        input=inputArray.join(' ');

        const m=BotReplies.index.__ban.message_ban;

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

                    if(functions.add_BannedToFile(current_user,ctx.message.date) == 1){
                        //User can be banned, he is not admin
                        current_user.set_isBan=true;

                        if(current_user.get_username != undefined && current_user.get_username != "")  //user has username
                            ctx.reply(functions.s(BotReplies.index.__ban.success_ban, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}), {parse_mode: 'HTML'});
                        else  //user doesn't have an username
                            ctx.reply(functions.s(BotReplies.index.__ban.success_no_username_ban, {name: current_user.get_fullName, id: current_user.get_id}), {parse_mode: 'HTML'});
                        ctx.telegram.sendMessage(current_user.get_id,m);
                    }else if(functions.add_BannedToFile(current_user,ctx.message.date) == -1){
                        //User can NOT be banned, he is currently admin.. have to unadmin first
                        if(current_user.get_username != undefined && current_user.get_username != "")  //user has username
                            ctx.reply(functions.s(BotReplies.index.__ban.is_admin_ban, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                        else  //user doesn't have an username
                            ctx.reply(functions.s(BotReplies.index.__ban.is_admin_no_username_ban, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                    }
                }else{
                    //errors
                    if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                        //user has blocked the bot from sending his ID alongside forwarded messages
                        //admin tries to reply to the user message but it will NOT work
                        ctx.reply(BotReplies.index.strict_privacy_messsage);
                    }else if(ctx.message.reply_to_message.from.id==adminID){
                        //admin tries to reply to its own message
                        ctx.reply(BotReplies.index.__ban.self_ban);
                    }else{
                        //admin tries to reply to bot - no important message
                        ctx.reply(BotReplies.index.__ban.bot_ban);
                    }
                }
            }else{
                //admin hasn't selected any message to reply to
                ctx.reply(BotReplies.index.__ban.no_user_ban);
            }
        }else{
            ctx.reply(BotReplies.index.__ban.argument_after_ban);
        }
        functions.clearUser();
    }
});

//Unban user
bot.command('unban', (ctx) => {
    // Reload file from the disk
    banned = editJsonFile(`./blacklist.json`, {autosave: true});
    //only admin can unban users
    if(functions.checkAdminId(ctx.message.chat.id)) {
        functions.setUser(ctx);
        functions.update_admin(ctx,current_user);
        //check if user is admin and isn't a bot
        //if(functions.checkBanned(current_user)) {
            let input=ctx.message.text;
            let inputArray=input.split(' ');

            inputArray.shift();
            input=inputArray.join(' ');
            if(input[0]=="@") input.shift();    //User started username with @, so I remove that
            const UserID=input;

            if(UserID=="") {
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
                                ctx.reply(BotReplies.index.__unban.no_banned_users_unban);
                                break;
                            
                            case -1005:
                                //ERROR: Loop ended without finding a match to unban
                                ctx.reply(BotReplies.index.__unban.not_banned_unban);
                                break;

                            case 1:
                                //SUCCESS: User has been successfully unbanned
                                if(current_user.get_username != undefined && current_user.get_username != "")
                                    ctx.reply(functions.s(BotReplies.index.__unban.success_unban, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                                else
                                    ctx.reply(functions.s(BotReplies.index.__unban.success_no_username_unban, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                                
                                const mm=BotReplies.index.__unban.message_unban;
                                ctx.telegram.sendMessage(current_user.get_id,mm);
                                break;
                        }
                        current_user.set_isBan=false;
                    }else{
                        //errors
                        if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                            //user has blocked the bot from sending his ID alongside forwarded messages
                            //admin tries to reply to the user message but it will NOT work
                            ctx.reply(BotReplies.index.strict_privacy_messsage);
                        }else if(ctx.message.reply_to_message.from.id==adminID){
                            //admin tries to reply to its own message
                            ctx.reply(BotReplies.index.__unban.self_unban);
                        }else{
                            //admin tries to unban the bot
                            ctx.reply(BotReplies.index.__unban.bot_unban);
                        }
                    }
                }else{
                    //admin hasn't selected any message to reply to
                    ctx.reply(BotReplies.index.__unban.no_user_unban);
                }
            }else{
                //admin has written something after the unban command
                //set the user before removing it from the banned list
                let user_set=false;
                if(functions.setBannedUser(UserID)) user_set=true;

                switch(functions.remove_BannedFromFile(UserID)){
                    case -1000:
                        //ERROR: User is not banned, can't be unbanned
                        ctx.reply(BotReplies.index.__unban.not_banned_unban);
                        break;
                    
                    case -1005:
                        //ERROR: Loop ended without finding a match to demote
                        ctx.reply(BotReplies.index.__unban.not_banned_unban);
                        break;

                    case 1:
                        //SUCCESS: User has been successfully demoted back to user role
                        if(user_set){
                            //User has been set successfully
                            if(current_user.get_username != undefined && current_user.get_username != "")
                                ctx.reply(functions.s(BotReplies.index.__unban.success_unban, {name: current_user.get_fullName, username: current_user.get_username, id: current_user.get_id}),{parse_mode: 'HTML'});
                            else
                                ctx.reply(functions.s(BotReplies.index.__unban.success_no_username_unban, {name: current_user.get_fullName, id: current_user.get_id}),{parse_mode: 'HTML'});
                            current_user.set_isBan=false;
                        }else{
                            //User couldn't be set correctly
                            ctx.reply(functions.s(BotReplies.index.__unban.couldnt_set_unban, {id: UserID}),{parse_mode: 'HTML'});
                        }

                        const m=BotReplies.index.__unban.message_unban;
                        ctx.telegram.sendMessage(UserID,m);
                        break;
                }
            }
        //}
        //else if(current_user.get_id==creator.get_id) ctx.reply('You can\'t unban yourself! ✌🏻\nBut you already knew that, since you developed me. 💡');
        //else{
        //    //User is not banned, he can't be unbanned
        //    ctx.reply('The user is not banned so he can\'t be unbanned. 👀');
        //}
        functions.clearUser();
    }
});

//list admin users
bot.command('adminlist', (ctx) => {
    // Reload file from the disk
    admins = editJsonFile(`./admins.json`, {autosave: true});
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
    if(functions.checkBanned(current_user)) return;
    if(functions.checkSuperior(current_user)) {
        //only superior admins can use this command
        functions.adminsToMessage(ctx);
        /**OLD MODE //const list=JSON.stringify(admins.toObject(),null,'\t\t');
        //ctx.reply(list);*/
    }else if(functions.checkAdmin(current_user)){
        //normal admins
        const m=functions.s(BotReplies.index.__adminlist.ask_creator_adminlist, {name: current_user.get_fullName, id: current_user.get_id});
        //only creator can grant Superior permissions to an admin
        bot.sendMessage(creator.get_id,m,{parse_mode: 'HTML'});

        //Warn the user that he isn't allowed to use this command yet, but a request has been done to the creator
        ctx.reply(BotReplies.index.__adminlist.unable_adminlist);
    }
    functions.clearUser();
});

//list banned users
bot.command('blacklist', (ctx) => {
    // Reload file from the disk
    banned = editJsonFile(`./blacklist.json`, {autosave: true});
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
    //if the user who wrote the command is banned from the bot, ignore message
    if(functions.checkBanned(current_user)){
        functions.clearUser();
        return;
    }
    if(functions.checkAdmin(current_user)) {
        if(functions.existsBannedUsers()){
            ctx.reply(BotReplies.index.__blacklist.no_banned_users_blacklist);
            functions.clearUser();
            return;
        }
        //only admins can use this command
        functions.bannedToMessage(ctx);
        /*OLD MODE//blacklist = editJsonFile('./blacklist.json');
        //const list=JSON.stringify(blacklist.toObject(),null,'\t\t');
        //ctx.reply(list);*/
    }
    functions.clearUser();
});

//grant an admin the superior admin permissions
bot.command(['promote','superior'], (ctx) => {
    // Reload file from the disk
    admins = editJsonFile(`./admins.json`, {autosave: true});
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
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
            ctx.reply(BotReplies.index.__promote.no_user_promote);
        }else if(functions.checkAdminId(id)){
            //User is admin already, so he can be promoted
            if(functions.checkSuperiorId(id)){
                //User is already superior admin
                ctx.reply(functions.s(BotReplies.index.__promote.already_superior_promote, {idd: id}),{parse_mode: 'HTML'});
            }else{
                //User is admin, but not superior
                switch(functions.setSuperiorId(id)){
                    case -1000:
                        //ERROR: There is no admin other than creator, user can't be promoted
                        ctx.reply(BotReplies.index.__promote.not_admin_promote);
                        break;
                    case -1005:
                        //ERROR: Loop has ended without a match
                        ctx.reply(functions.s(BotReplies.index.__promote.error_promote, {idd: id}),{parse_mode: 'HTML'});
                        break;
                    case 1:
                        //SUCCESS: User has been promoted to superior admin.. tell the user that he has been promoted
                        if(functions.setAdminUser(id)){
                            //User was set successfully
                            if(current_user.username==null || current_user.username==undefined) ctx.reply(functions.s(BotReplies.index.__promote.success_no_username_promote, {name: current_user.get_fullName, idd: id}));
                            else ctx.reply(functions.s(BotReplies.index.__promote.success_promote, {name: current_user.get_fullName, username: current_user.get_username, idd: id}));
                        }else{
                            //User couldn't be set
                            ctx.reply(functions.s(BotReplies.index.__promote.couldnt_set_promote, {idd: id}));
                        }
                        const m=BotReplies.index.__promote.message_promote;
                        ctx.telegram.sendMessage(id,m);
                        break;
                }
            }
        }else{
            //User is not admin, can't be superior
            ctx.reply(BotReplies.index.__promote.not_admin_promote);
        }
    }
    functions.clearUser();
});

//Clears the admins list and the only admin left is the creator
bot.command('resetadmins', async (ctx) => {
    // Reload file from the disk
    admins = editJsonFile(`./admins.json`, {autosave: true});

    let a=admins.toObject();
    functions.setUser(ctx);
    functions.update_admin(ctx,current_user);
    console.log("\nNumber of active admins: " + admins.get("Admins Number"));
    //the only admin is the creator, nothing has to be reset
    //if(admins.get("Admins Number") == 1){
    if(a["Admins Number"] == 1){
        console.log("There is only 1 admin, no reset possible.");
        ctx.reply(BotReplies.index.__resetadmins.only_one_resetadmins);
        functions.clearUser();
        return;
    }
    if(functions.checkCreator(current_user)) {
        //Creator of the bot
        //let a=admins.toObject();
        let n=admins.get("Admins Number")-1;
        console.log("Number of admins to delete: "+n);
        //send communication to all former admins that they have been demoted
        for(let i=n;i>=1;i--,n--){
            console.log("Admin #"+i+" is being removed from admin list.");
            //FIXME: can't find element 'i' in the array, so can't send message to user
            ctx.telegram.sendMessage(a.List[i].ID, BotReplies.index.__demote.message_to_user_demote);
            admins.pop("List");
            console.log("Last element removed from admin list.");
            admins.save();
        }
        a.List.splice(1,n);
        admins.save();
        await functions.resetadmins();
        /*
        console.log("Loop ended now removing admins and saving the file.");
        a.List.splice(1,n);
        console.log("Admins removed successfully, now setting the Admin Number "+admins.get("Admins Number")+" to 1.");
        admins.set("Admins Number",1);  //only creator is there
        admins.save();
        console.log("Admins list updated successfully and saved.");
        functions.initFiles();
        */
        ctx.reply(BotReplies.index.__resetadmins.cleared_resetadmins);
    }
    functions.clearUser();
    console.log("User cleared, ending the function.");
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
            if(ctx.message.text.startsWith('/')){
                //I am writing a command to an user and I don't want to forward it to him
                ctx.reply(BotReplies.index.__hears.not_found_hears, {parse_mode: 'HTML'});
                return;
            }
            if(ctx.message.reply_to_message.hasOwnProperty('forward_from')){
                //user has not limited privacy setting of forwarding, bot can know the original id of the forwarded message
                ctx.telegram.sendMessage(ctx.message.reply_to_message.forward_from.id, m);
                let id=ctx.from.id;
                const chat = await ctx.telegram.getChat(id);
                privacy=chat.has_private_forwards;
                functions.toAdmin(ctx);
            }else{
                if(ctx.message.reply_to_message.hasOwnProperty('forward_sender_name')){
                    //user has blocked the bot from sending his ID alongside forwarded messages
                    //admin tries to reply to the user message but it will NOT work
                    //admin has to reply to dummy message instead
                    ctx.reply(BotReplies.index.strict_privacy_messsage);
                }else if(ctx.message.reply_to_message.from.id==adminID){
                    //admin tries to reply to its own message
                    ctx.reply(BotReplies.index.__hears.self_hears);
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
                    ctx.reply(BotReplies.index.__hears.bot_hears);
                }
            }
        }else{
            //admin hasn't selected any message to reply to
            ctx.reply(BotReplies.index.__hears.no_message_hears);
        }
    }else{
        functions.setUser(ctx);
        //check if the user is banned
        if(functions.checkBanned(current_user)){
            //User is banned
            return;
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