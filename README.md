# 🐶 DoggoReportBot 🐾

A Telegram bot coded in NodeJS, which allows admins of a channel to communicate with several users by using the bot as an intermediary.
<br>

## ⚙️ How to run

**Requirements to run the bot:** *[NodeJS](https://nodejs.org)*. If you are unsure which version to choose, you should probably stick with the LTS version.<br>
1. Read [Dev Infos](https://github.com/Croluy/DoggoReportBot/edit/master/README.md#-dev-infos) below (**do not skip this step**)
2. If you don't have git, [install it](https://github.com/git-guides/install-git)
3. Clone the repo executing: `git clone https://github.com/Croluy/DoggoReportBot` (check [this](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) for troubleshooting)
4. Insert your infos in your local `.env` file
5. Set `bot_test` to `false` in your local `index.js` file
6. In your terminal, navigate to the root directory of the bot
7. Execute `npm start`

If you have set up the bot correctly you should get a message from it asking you if the channel name is correct. You should also see that the bot sent a message to the log channel informing you it is online.
<br>

## 💻 Dev Infos

⚠️ **IMPORTANT**<br>
I have excluded some files when uploading the project to GitHub. Those include data I won't disclose publicly for obvious reasons.<br>
You will have to manually insert that data inside the "*[.env](https://github.com/Croluy/DoggoReportBot/blob/master/.env)*" file.<br>
- Bot Token: It is the token of the bot provided to you by BotFather on Telegram. It is a secret code that gives full access to the bot. Has to be in quotes (or double quotes): `"`.
- Creator ID: Your Telegram ID. You can get your ID with *[this tutorial](https://www.alphr.com/find-chat-id-telegram/)* or just Google "get personal telegram id".
- Creator Name: It is your Telegram name/username. Has to be in quotes (or double quotes): `"`.
- Log Channel: ID of the channel where the bot will log its more important actions. You have to be creator of this channel and to get its ID you can use *[this tutorial](https://neliosoftware.com/content/help/how-do-i-get-the-channel-id-in-telegram/)* or just Google "get telegram channel id".
- Channel Name: It is the name of the channel linked to your bot. *NOT* the log channel but the channel this bot is linked. Has to be in quotes (or double quotes): `"`.

---
When running the bot be sure to set the variable `bot_test` to `false` in "*[index.js](https://github.com/Croluy/DoggoReportBot/blob/master/index.js#L20)*". That will deny the bot from skipping some initial steps that I've preferred ignoring during development process.<br>
This will also create 2 JSON files on your local machine:<br>
- blacklist.json --> it saves a list of all users banned from the bot;
- admins.json --> this file saves a list of all the admins of the bot.

Do **NOT** delete or manually modify these files unless you know what you're doing!<br>

If you have messed up any of those files and can't restore them, you will have to fully reset them:
1. Stop the bot execution if it's currently running;
2. Delete both `blacklist.json` and `admins.json` files;
3. Make sure `bot_test` variable in "*[index.js](https://github.com/Croluy/DoggoReportBot/blob/master/index.js#L20)*" is set to `false`;
4. Run the bot again.

After executing this steps the two files will be restored, but all the previous saved infos (such as admin or banned users) **will be lost**.<br>
You will have to promote again all the users you want as admins and ban again all users you have previously banned.

---
All the messages that the bot sends to users and admins are stored in "*[BotReplies.json](https://github.com/Croluy/DoggoReportBot/blob/master/BotReplies.json)*".<br>
The JSON is organized following a Tree Structure where the roots are `functions` and `index` and each of them represents a JS file ("*[index.js](https://github.com/Croluy/DoggoReportBot/blob/master/index.js)*" and "*[functions.js](https://github.com/Croluy/DoggoReportBot/blob/master/functions.js)*").<br>
Both roots have a list of children named the same as that file's functions where messages are sent from the bot to anyone. This allows the project to be more organized.<br>
If you wish to edit some of those messages, ideally you should only be editing `BotReplies.json` avoiding to create bugs inside the other files where functions are implemented.
<br>

## 🧬 Features

When an user sends any message to the bot, that message will be forwarded to all the current Administrators. That's right! This bot supports multiple admins. Not only that, but there are 3 diffent ranks of Administrators:<br>
+ 👑 **Bot's Owner** (also mentioned as Creator) is the highest rank and has access to ALL the commands, there can only be 1 Bot Owner;<br>
+ 💎 **Superior Administrator** it's the max rank any user *(who isn't Bot's Owner)* can aspire to, it has a high amount of available commands;<br>
+ 👮‍♀️ **Administrator** is a user who has Ban power over normal users.

Administrators can reply to users by simply using the reply function of Telegram. When that happens, said reply will be forwarded to all the other Administrators of the bot also.

If users restrict their forwarding privacy setting, the bot has to use some tricks to get around the problem as some functions might work slightly diffentely than normal. Having this said, at the moment, ALL of the features and commands of this bot are usable even with this category of users.

If any errors occour during the use of the bot, it will log those errors on a log channel you've chosen, which is different from the channel this bot is supposed to be linked with.<br>
The Telegram log channel has to be created manually by you and it should only be visible to people you have granted Administrator permission to.
<br>

## 💡 Commands

You can get a list of all the commmands available to you by running `/commands` in the bot chat.<br><br>
I have listed the most useful commands below and I've used emojis to also show what kind of rank is required for that command to work.<br>
Obviously all lower ranked commands can be executed by higher ranked Administrators too.<br>

+ 👮‍♀️ **Ban** OR **Terminate**: ban any user who texts the bot and their messages will be completely ignored until you choose to Unban said user.<br>
  You can Ban only by replying to user's message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Ban Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Ban_new.gif)
  </details>
***

+ 👮‍♀️ **Unban**: unban an user that has previously been banned from using the bot. It allows said user to be able to use the bot again.<br>
  You can Unban by either replying to user's message OR by using the user's ID.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Unban Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Unban_new.gif)
  </details>
***

+ 👮‍♀️ **Blacklist**: show a list of all users who are Banned from the bot.<br>
  You can run Blacklist command only by typing it in bot's chat as a normal message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Blacklist Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Blacklist_new.gif)
  </details>
***

+ 💎 **Adminlist**: show a list of all Administrators of the bot.<br>
  You can run Adminlist command only by typing it in bot's chat as a normal message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Adminlist Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Adminlist_new.gif)
  </details>
***

+ 💎 **Admin**: promote a normal user to Admininistrator.<br>
  You can run Admin only by replying to user's message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Admin Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Admin_new.gif)
  </details>
***

+ 💎 **Unadmin** OR **Demote**: demote users of their current Administrator rank to the lower rank. Obviously if you are a Superior Admin you can only demote Admins back to users, but you can't demote other Superior Admins.<br>
  You can Demote by either replying to user's message OR by using the user's ID.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Demote Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Demote_new.gif)
  </details>
***

+ 💎 **Info**: gather some infos about a specific user. Those include: ID, Full Name, Username (if any) and Language code.<br>
  You can run Info only by replying to user's message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Info Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Info_new.gif)
  </details>
***

+ 💎 **SetUsername**: set the username of the channel this bot is linked to.<br>
  You can run this command followed by the new username of the linked channel.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![SetUsername Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/SetUsername_new.gif)
  </details>
***

+ 👑 **Promote** OR **Superior**: grant an Administrator the Superior Administrator rank.<br>
  You can run this command followed by Admin's ID.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![Promote Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Promote_new.gif)
  </details>
***

+ 👑 **ResetAdmins**: resets the list of ALL the admins by removing every single one of them except the Bot's Owner.<br>
  You can run Blacklist command only by typing it in bot's chat as a normal message.<br>
  <details>
    <summary>Click Me for an Example 👇🏻</summary>
    
    ![ResetAdmins Example GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Resetadminlist_new.gif)
  </details><br>

## 📄 Credits:

*:rocket: Created and Maintained by [Croluy](https://www.github.com/croluy)*
