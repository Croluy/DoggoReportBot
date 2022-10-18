# ⚙️ DoggoReportBot

A Telegram bot coded in NodeJS, which allows admins of a channel to communicate with several users by using the bot as an intermediary.
<br>

## 💻 Dev Infos

When running the bot be sure to set the variable `bot_test` to `false` in "*[index.js](https://github.com/Croluy/DoggoReportBot/blob/master/index.js#L18)*". That will deny the bot from skipping some initial steps that I've preferred ignoring during development process.<br>
I have excluded some files when uploading the project to GitHub. Those include data I won't disclose publicly for obvious reasons.<br>
You might need to recreate at least the *.env* file in your local machine after you clone the repository.<br>
It includes crucial data:
- bot's token;
- ID and full name of the bot's owner;
- bot's ID;
- ID of the log channel;
- name of the channel this bot is linked to.<br>

When you run the bot for the 1st time, it will create 2 files on your local machine:<br>
- blacklist.json --> it saves a list of all users banned from the bot;<br>
- admins.json --> this file saves a list of all the admins of the bot.<br>

Do **NOT** delete or manually modify this files unless you know what you're doing!
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

I've used emojis to give you a list of commands while also showing what kind of rank is required for that command to work.<br>
Obviously all lower ranked commands can be executed by higher ranked Administrators too.

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
    
    ![ResetAdminsExample GIF](https://github.com/Croluy/DoggoReportBot/blob/master/gifs/Resetadminlist_new.gif)
  </details><br>

## 📄 Credits:
*:rocket: Created and Maintained by [Croluy](https://www.github.com/croluy)*
