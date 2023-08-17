//reffer wwebjs documentation and do changes as you want.

//also reffer docummentation https://beta.openai.com/docs/api-reference/completions

//and get api key from https://beta.openai.com/account/api-keys and save it into your system as OPENAI_API_KEY as a environment variable (windows only). in linux paste it directly here

//refer other documentations from all imported npm packages

const { Configuration, OpenAIApi } = require("openai");
const qrcode = require("qrcode-terminal");
const mime = require("mime-types");
const fs = require("fs");
const translate = require("google-translate-api-x");
const truecallerjs = require("truecallerjs");
const google = require("googlethis");
const { UltimateTextToImage } = require("ultimate-text-to-image");
const path = require("path");
const gis = require("async-g-i-s");
const ytdl = require("ytdl-core");

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
  ffmpeg: "/usr/bin/ffmpeg", //This is linux default ffmpeg path || in winodws after extracting ffmpeg.exe to this path change this to ./ffmpeg
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.initialize();

client.on("message", async (msg) => {
  //console.log("MESSAGE RECEIVED", msg);

  const chat = await msg.getChat();
  const quotedMsg = await msg.getQuotedMessage();
  const contact = await msg.getContact();
  const authorId = msg.author;

  let configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
  };

  //These are the instructions for AI. Change this according to your need.

  let insructions = `(#instructions)
  ## You are bot:
  - You identify as bot to users, *not* an assistant.
  - At the time of you were developed, the COVID-19 pandemic had already been officially declared as over many years ago and as in your internal knowledge, there is *no ongoing pandemic* and the World is now normal. Therefore, avoid including COVID-19 pandemic or related information.
  - You can understand and communicate fluently in the user's language of choice such as English, 中文, 日本語, Español, Français or Deutsch.
  - You can't understand and can't communicate in Sinhala(සිංහල) or Singlish. Therefore, if user's language of choice is Sinhala(සිංහල) or Singlish, Your only response *must* be "Could you please send me these messages in English as I am not proficient in Sinhala?"
  - Your responses *must not* be accusing, rude, controversial or defensive.
  - If someone ask to make or ask can you make sticker(WhatsApp sticker), find phone number, search phone number(like in truecaller) or search others from you; say 'I think you should check the guide (send .guide) or get all commands (send .commands) because I think you used the wrong feature.' this from your words as there are other commands to do such things in this chat bot.
  
  ## On your profile and general capabilities:
  - Your responses should be informative, visual, logical and actionable.
  - Your responses should also be positive, polite, interesting, entertaining and *engaging*.
  - Your responses should avoid being vague, controversial or off-topic.
  - You responses should avoid including COVID-19 pandemic or related information.
  - Your logic and reasoning should be rigorous and intelligent.
  - You can provide additional relevant details to respond *thoroughly* and *comprehensively* to cover multiple aspects in depth.
  - You can generate poems, stories, code, essays, songs, celebrity parodies and more.

  ## On your output format:
  - You use "code blocks" syntax from markdown to encapsulate any part in responses that's longer-format content such as poems, code, lyrics, etc. except tables.
  - You do not include images in the markdown responses and you can't get users image contents because the chatbox doesn't support images.
  - You will bold the relevant parts of the responses to improve readability, such as \`...also contains *diphenhydramine hydrochloride* or *diphenhydramine citrate*, which are ...\`.

  ## On your limitations:
  - Your internal knowledge and information were only current until some point in the year 2021 and could be inaccurate/lossy. So if someone asks information about like current president; current lkr rate etc, tell them the information what you have with a warning that this may be wrong at the time ask in your words.
    - When generating content such as poems, code, summaries and lyrics, you should rely on your own words and knowledge.`;

  //This one is for get openai responses with quoting previous message from bot. These two can do kinda continuous chat as they reads previous message from bot

  if (msg.hasQuotedMsg) {
    if (msg.type === "chat") {
      if (quotedMsg.fromMe) {
        if (!msg.body.startsWith(".")) {
          if (msg.body === "Hi" || msg.body === "hi") {
            //console.log();
          } else {
            chat.sendSeen();
            msg.react("💬");
            chat.sendStateTyping();

            try {
              const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                  { role: "system", content: insructions },
                  { role: "assistant", content: `${quotedMsg.body}` },
                  { role: "user", content: `${msg.body}` },
                ],
                temperature: 0.9,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
                user: msg.author,
              });
              //console.log(completion.data.choices[0].message);
              setTimeout(() => {
                msg.react("✅");
                msg.reply(completion.data.choices[0].message.content);
                chat.clearState();
              }, 300);
            } catch (error) {
              if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                if (error.response.status == "429") {
                  setTimeout(() => {
                    msg.react("❗");
                    msg.reply(
                      "❗ Too many user requests. ❗\nPlease *try again after one minute*"
                    );
                    chat.clearState();
                  }, 300);
                } else {
                  setTimeout(() => {
                    msg.react("❗");
                    msg.reply("Something went wrong.");
                    chat.clearState();
                  }, 300);
                }
              } else {
                console.log(error.message);
                chat.clearState();
              }
            }
          }
        }
      }
    }
  }

  //check bot alive
  if (msg.body === ".alive") {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("😎");
      msg.reply("I am here as usual 😎");
      chat.clearState();
    }, 400);
  }

  //commmunity
  //If you have a community or group; use this. otherwise delete codes.
  else if (msg.body === ".community") {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("😎");
      msg.reply("🔰 ```Community group link``` 🔰\n\n_Link_");
      chat.clearState();
    }, 400);
  }

  //developer contact
  //If you want to contact you directly use this code. otherwise delete codes.
  else if (msg.body === ".dev") {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("😎");
      msg.reply(
        "🔰 ```Direct contact Developer``` 🔰\n\n_Number or wa.me link_"
      );
      chat.clearState();
    }, 400);
  }

  //reply to hi and also .bot, .code .gen commands who use without any text
  else if (msg.body === ".bot" || msg.body === "Hi" || msg.body === "hi") {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("🙃");
      msg.reply("Hi there. How can I help you?");
      chat.clearState();
    }, 400);
  }

  //check bot commands
  else if (msg.body === ".help") {
    chat.sendSeen();
    chat.sendStateTyping();
    const media = MessageMedia.fromFilePath("/root/wabot/bot.jpg");
    setTimeout(() => {
      msg.react("✅");
      chat.sendMessage(media, {
        caption: `🔰 *Hello I am bot* 🔰
      ( _Version 3.0_ )
      ( _.commands to get a list of all available commands_ )
      
      ⬇️COMMANDS⬇️
      
      _.alive (Check I am alive or not)_
      _.commands (Other commands)_
      _.tte <message> (Translate to English)_
      _.tts <message> (Translate to Sinhala)_
      _.bot <message> (AI Assistant)_
      _.find <number> (Truecaller)_
      _.search <message> (Google search)_

       `,
      });
      chat.clearState();
    }, 400);
  }

  //all commands - maybe one or two missed in here.
  else if (msg.body === ".commands" || msg.body === ".command") {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("✅");
      msg.reply(
        `👥 Commands\n﹊﹊﹊﹊﹊﹊﹊\n\n\n📟 Command : .alive\n🗒 Description : Check I'm online or not.\n\n📟 Command : .guide\n🗒 Description : My guide ( Video and Text)\n\n📟 Command : .community\n🗒 Description : My community group link\n\n📟 Command : .dev\n🗒 Description : Direct contact Ravishka\n\n📟 Command : .help\n🗒 Description : Some commands\n\n📟 Command : .botinfo | .botinfo\n🗒 Description : Get my info\n\n📟 Command : .sticker\n🗒 Description : Make WhatsApp stickers\n🏷 Example : Send image/video/gif with caption .sticker\n\n📟 Command : .groupinfo\n🗒 Description : Get group info\n\n📟 Command : .tagall  (Admin only)\n🗒 Description : Mention everyone in a group chat ( with/without message)\n🏷 Example : .tagall  |  .tagall [reply to a message]  |  .tagall example[start a message]\n\n📟 Command : @admin\n🗒 Description : Mention and get help from a group admin quickly\n\n📟 Command : .leave (Admin only)\n🗒 Description : Remove me from a group\n\n📟 Command : .find\n🗒 Description : Truecaller\n🏷 Example : .find 771234567 | .find +94771234567\n\n📟 Command : .search\n🗒 Description : Google search\n🏷 Example : .search Chatgpt | .search Anime\n\n📟 Command : .yta\n🗒 Description : Youtube Audio Download\n🏷 Example : .yta https:/....\n\n📟 Command : .ytv\n🗒 Description : Youtube Video Download\n🏷 Example : .ytv https://....\n\n📟 Command : .pdf\n🗒 Description : PDF search\n🏷 Example : .pdf astronomy\n\n📟 Command : .tte\n🗒 Description : Translate any language words to English\n🏷 Example : .tte ඔයාට කොහොමද\n\n📟 Command : .tts\n🗒 Description : Translate any language words to Sinhala\n🏷 Example : .tts how are you\n\n📟 Command : .bot\n🗒 Description : To get AI responses ( Same as Chatgpt- Uses GPT 3.5 model )\n🏷 Example : .bot write a code....\n\n📟 Command : .clear\n🗒 Description : Clear chats from me\n\n📟 Command : .sendowner\n🗒 Description : Send my owner (Ravishka) messages using me.\n🏷 Example : .sendowner how did you made this ?\n\n\n𐌁𐌉𐌁𐌉`
      );
      chat.clearState();
    }, 400);
  }

  //get bot info
  else if (msg.body === ".botinfo") {
    chat.sendSeen();
    chat.sendStateTyping();
    let info = client.info;
    setTimeout(() => {
      msg.react("✅");
      msg.reply(
        client.sendMessage(
          msg.from,
          `🔰 *My info* 🔰\n\nUser name: ${info.pushname}\nPlatform: ${info.platform}\nMy number: ${info.wid.user}\n\nI am based on the WhatsApp-Web.js and implemented to do many things. Source code is here\n_https://bit.ly/whatsappgpt_\n\nFollow developer on Github\n_https://github.com/ravishkaw_
          `
        )
      );
      chat.clearState();
    }, 400);
  }

  //Send a msg to owner using bot// only works in group chats
  else if (msg.body.startsWith(".sendowner ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔄️");
    if (!chat.isGroup) {
      let msg1 = msg.body.slice(11);
      let number = `yournumber@c.us`;
      setTimeout(() => {
        msg.react("✅");
        msg.reply("Done. Sent to Ravishka");
        client.sendMessage(
          number,
          `${contact.pushname}\n${contact.id.user}\n\n${msg1}`
        );
        chat.clearState();
      }, 800);
    }
  }

  // Direct send a new message to specific id
  // This is useful when someone use sendowner command and send owner a message
  // Use  number and message afer .sendton like .sendton 947xxxxxxxx hello
  else if (msg.body.startsWith(".sendton ")) {
    chat.sendSeen();
    let number = msg.body.split(" ")[1];
    let messageIndex = msg.body.indexOf(number) + number.length;
    let msg2 = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes("@c.us") ? number : `${number}@c.us`;
    setTimeout(() => {
      msg.react("✅");
      client.sendMessage(number, `🔰 *Message from Ravishka* 🔰\n\n${msg2}`);
    }, 500);
  }

  //opened chats
  else if (msg.body === ".chats") {
    chat.sendSeen();
    chat.sendStateTyping();
    const chats = await client.getChats();
    setTimeout(() => {
      msg.react("✅");
      client.sendMessage(msg.from, `I have ${chats.length} chats open.`);
      chat.clearState();
    }, 400);
  }

  //get chat or group id
  else if (msg.body === ".id") {
    chat.sendSeen();
    let id = chat.id.user;
    let number = `yournumber@c.us`;
    msg.react("✅");
    client.sendMessage(number, id);
  }

  //clear chat from bot
  else if (msg.body === ".clear") {
    if (!chat.isGroup) {
      chat.sendSeen();
      chat.clearMessages(true);
      msg.react("✅");
      chat.sendMessage("Done.");
    }
  }

  //make whatsapp stickers
  //ffmpeg required
  else if (msg.body === ".sticker") {
    chat.sendSeen();
    if (msg.hasMedia) {
      msg.react("✅");
      msg.downloadMedia().then((media) => {
        if (media) {
          const mediaPath = "./downloaded-media/";

          if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath);
          }

          const extension = mime.extension(media.mimetype);
          const filename = new Date().getTime();
          const fullFilename = mediaPath + filename + "." + extension;
          // Save to file
          try {
            fs.writeFileSync(fullFilename, media.data, {
              encoding: "base64",
            });
            console.log("File downloaded successfully!", fullFilename);
            console.log(fullFilename);
            MessageMedia.fromFilePath((filePath = fullFilename));
            client.sendMessage(
              msg.from,
              new MessageMedia(media.mimetype, media.data, filename),
              {
                sendMediaAsSticker: true,
                stickerAuthor: "Created by bot",
                stickerName: "STICKERS",
              }
            );
            fs.unlinkSync(fullFilename);
            console.log(`File Deleted successfully!`);
          } catch (err) {
            console.log("Failed to save the file:", err);
            console.log(`File Deleted successfully!`);
          }
        }
      });
    } else {
      msg.react("🚫");
      msg.reply(`send image/video/gif with caption *.sticker* `);
    }
  }

  //text to sticker
  else if (msg.body === ".text") {
    if (quotedMsg) {
      if (quotedMsg.type === "chat") {
        try {
          chat.sendSeen();

          // #00FF00 - green
          // #ff0000 - red
          const textToImage = new UltimateTextToImage(quotedMsg.body, {
            width: 500,
            height: 500,
            fontFamily: "Arial",
            fontColor: "#00FF00",
            fontSize: 56,
            minFontSize: 10,
            lineHeight: 40,
            autoWrapLineHeightMultiplier: 1.2,
            margin: 20,
            marginBottom: 40,
            align: "center",
            valign: "middle",
          });
          const stickerFileName = getRandom(".png");
          textToImage
            .render()
            .toFile(path.join("./downloaded-media", stickerFileName));

          //
          const media = MessageMedia.fromFilePath(
            `./downloaded-media/${stickerFileName}`
          );
          msg.react("✅");
          client.sendMessage(
            msg.from,
            new MessageMedia(media.mimetype, media.data, stickerFileName),
            {
              sendMediaAsSticker: true,
              stickerAuthor: "Created by bot",
              stickerName: "STICKERS",
            }
          );
          fs.unlinkSync(`./downloaded-media/${stickerFileName}`);
          console.log(`File Deleted successfully!`);
        } catch (err) {
          fs.unlinkSync(`./downloaded-media/${stickerFileName}`);
          console.log("Failed to save the file:", err);
          console.log(`File Deleted successfully!`);
        }
      } else {
        msg.react("🚫");
        msg.reply("Use .sticker to make stickers from image/video/gif");
      }
    } else {
      msg.react("🚫");
      msg.reply("Quote/ mention a text message to make a sticker");
    }
  }

  //join a group
  else if (msg.body.startsWith(".joinlink ")) {
    chat.sendSeen();
    const inviteLink = msg.body.split(" ")[1];
    inviteCode = inviteLink.replace("https://chat.whatsapp.com/", "");
    try {
      await client.acceptInvite(inviteCode);
      msg.react("✅");
      msg.reply("Joined the group.");
    } catch (e) {
      msg.reply("That invite link seems to be invalid.");
    }
  }

  //leave a group. admin only
  else if (msg.body === ".leave") {
    chat.sendSeen();
    // Leave the group

    if (chat.isGroup) {
      for (let participant of chat.participants) {
        if (participant.id._serialized === authorId && participant.isAdmin) {
          chat.leave();
        }
      }
    } else {
      msg.react("🚫");
      msg.reply("This command can only be used in a group and admins.");
    }
  }

  //get group info
  else if (msg.body === ".groupinfo") {
    chat.sendSeen();
    chat.sendStateTyping();
    if (chat.isGroup) {
      setTimeout(() => {
        msg.react("✅");
        msg.reply(`
        🔰 *Group Details* 🔰\n\nName: ${chat.name}\n\nDescription: ${
          chat.description
        }\n\nCreated At: ${chat.createdAt.toString()}\n\nCreated By: ${
          chat.owner.user
        }\n\nParticipant count: ${chat.participants.length}
     `);
        chat.clearState();
      }, 400);
    } else {
      setTimeout(() => {
        msg.react("🚫");
        msg.reply("This command can only be used in a group.");
        chat.clearState();
      }, 400);
    }
  }

  //mentioning all group members
  else if (msg.body === ".tagall") {
    chat.sendSeen();
    if (chat.isGroup) {
      for (let participant of chat.participants) {
        if (participant.id._serialized === authorId && participant.isAdmin) {
          let mentions = [];

          for (let participant of chat.participants) {
            const contact = await client.getContactById(
              participant.id._serialized
            );

            mentions.push(contact);
          }

          //mentioning options
          if (quotedMsg) {
            //this is for sending quoted message
            msg.react("🔖");
            await chat.sendMessage(quotedMsg.body, { mentions });
            break;
          } else {
            msg.react("🏷️");
            await chat.sendMessage("An admin mentioned all members", {
              mentions,
            });
            break;
          }
        } else if (
          participant.id._serialized === authorId &&
          !participant.isAdmin
        ) {
          if (msg.body === ".tagall") {
            msg.react("🚫");
            msg.reply("The command can only be used by group admins.");
            break;
          }
        }
      }
    }
  }

  //code for .tagall <message>
  else if (msg.body.startsWith(".tagall ")) {
    chat.sendSeen();
    msg.react("🏷️");
    if (chat.isGroup) {
      for (let participant of chat.participants) {
        if (participant.id._serialized === authorId && participant.isAdmin) {
          let mentions = [];

          for (let participant of chat.participants) {
            const contact = await client.getContactById(
              participant.id._serialized
            );

            mentions.push(contact);
          }
          let tagmsg = msg.body.slice(8);

          await chat.sendMessage(tagmsg, {
            mentions,
          });
          break;
        } else if (
          participant.id._serialized === authorId &&
          !participant.isAdmin
        ) {
          if (msg.body.startsWith(".tagall ")) {
            msg.react("🚫");
            msg.reply("The command can only be used by group admins.");
            break;
          }
        }
      }
    }
  }

  //admin report
  else if (msg.body === "@admin" || msg.body.startsWith("@admin")) {
    chat.sendSeen();
    chat.sendStateTyping();

    if (chat.isGroup) {
      let mentions = [];

      for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        if (participant.isAdmin) {
          mentions.push(contact);
        }
      }
      msg.react("👨‍💻");
      await chat.sendMessage(`${contact.pushname} mentioned admins`, {
        mentions,
      });
      chat.clearState();
    }
  }

  //Openai - chat Q & A
  else if (msg.body.startsWith(".bot ") || msg.body.startsWith(".bot ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("💬");

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: insructions },
          { role: "user", content: `${msg.body.slice(4)}` },
        ],
        temperature: 0.9,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        user: msg.author,
      });
      //console.log(completion.data.choices[0].message);
      setTimeout(() => {
        msg.react("✅");
        msg.reply(completion.data.choices[0].message.content);
        chat.clearState();
      }, 300);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        if (error.response.status == "429") {
          setTimeout(() => {
            msg.react("❗");
            msg.reply(
              "❗ Too many user requests. ❗\nPlease *try again after one minute*"
            );
            chat.clearState();
          }, 300);
        } else {
          setTimeout(() => {
            msg.react("❗");
            msg.reply("Something went wrong.");
            chat.clearState();
          }, 300);
        }
      } else {
        console.log(error.message);
        chat.clearState();
      }
    }
  }

  //openai Dall e image gen
  //reffer docummentation https://beta.openai.com/docs/api-reference/images/create  and change values
  else if (msg.body.startsWith(".gen ")) {
    try {
      const response = await openai.createImage({
        prompt: msg.body.slice(5),
        n: 1,
        size: "1024x1024",
      });
      image_url = response.data.data[0].url;
      const media = await MessageMedia.fromUrl(image_url);
      msg.reply(media);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        msg.reply(
          "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system."
        );
      } else {
        console.log(error.message);
      }
    }
  }

  //reffer documentation and change values
  else if (msg.body.startsWith(".code ")) {
    msg.react("💬");

    try {
      const completion = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: msg.body.slice(6),
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: msg.author,
      });
      //console.log(completion.data.choices[0].text);
      setTimeout(() => {
        msg.react("✅");
        msg.reply(completion.data.choices[0].text);
      }, 300);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        msg.reply("Invalid request or Limit reached. Try again later....");
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }

  //google search
  else if (msg.body.startsWith(".search ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔍");
    const options = {
      page: 0,
      safe: false, // Safe Search
      parse_ads: false, // If set to true sponsored results will be parsed
      additional_params: {
        // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
        hl: "en",
      },
    };

    try {
      const googleSearch = msg.body.slice(8);
      const response = await google.search(googleSearch, options);
      const responseSliced = response.results.slice(0, 10);
      let vars = `_*Top 10 Results : ${googleSearch}*_\n`;
      for (let i = 0; i < responseSliced.length; i++) {
        vars += `\n------------------------------------------------\n\n*Title* : ${responseSliced[i].title}\n\n*Description* : ${responseSliced[i].description}\n\n*Link* : ${responseSliced[i].url}\n\n`;
      }
      msg.react("✅");
      msg.reply(vars);
      chat.clearState();
    } catch (error) {
      msg.react("❗");
      msg.reply(error.toString());
      chat.clearState();
    }
  }

  //image search
  else if (msg.body.startsWith(".img ")) {
    msg.react("🔄️");
    (async () => {
      try {
        let imageSearch = msg.body.slice(5);
        const results = await gis(imageSearch);
        //console.log(results[0].url);
        const imageSearch1 = await MessageMedia.fromUrl(results[0].url);
        const imageSearch2 = await MessageMedia.fromUrl(results[1].url);
        msg.react("✅");
        msg.reply(imageSearch1);
        msg.reply(imageSearch2);
      } catch (e) {
        msg.react("❗");
        msg.reply("Something went wrong.");
        //console.error(e);
      }
    })();
  }

  //yt download
  //video
  else if (msg.body.startsWith(".ytv ")) {
    try {
      chat.sendSeen();
      msg.react("🔄️");
      let urlYt = msg.body.slice(5);

      if (!urlYt.startsWith("http")) {
        msg.react("🚫");
        await msg.reply(`Give youtube video link to download audio!`);
        return;
      }
      await msg.reply(
        "Checking if the video is longer than 30 minutes...\n\nWhole process may take a while!"
      );

      let infoYt = await ytdl.getInfo(urlYt);
      //30 MIN
      if (infoYt.videoDetails.lengthSeconds >= 1800) {
        msg.react("🚫");
        await msg.reply(`Video is longer than 30 minutes!`);
        return;
      }

      let titleYt = infoYt.videoDetails.title;
      let Name = getRandom(".mp4");

      const stream = ytdl(urlYt, {
        filter: (info) => info.itag == 136 || info.itag == 18,
      }).pipe(fs.createWriteStream(`./downloaded-media/${Name}`));
      //22 - 1080p/720p and 18 - 360p

      //console.log("Video downloading ->", urlYt);
      await msg.reply("Downloading.. This may take upto 5 min!");
      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
      });

      let stats = fs.statSync(`./downloaded-media/${Name}`);
      let fileSizeInBytes = stats.size;
      // Convert the file size to megabytes (optional)
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      //console.log("Video downloaded ! Size: " + fileSizeInMegabytes);

      if (fileSizeInMegabytes <= 100) {
        const media = MessageMedia.fromFilePath(`./downloaded-media/${Name}`);
        msg.react("✅");
        await client.sendMessage(
          msg.from,
          new MessageMedia(media.mimetype, media.data, titleYt),
          {
            sendMediaAsDocument: true,
          }
        );
      } else {
        msg.react("❗");
        await msg.reply(`File size bigger than 100mb.`);
      }

      fs.unlinkSync(`./downloaded-media/${Name}`);
    } catch (err) {
      console.log(err);
      msg.react("❗");
      msg.reply(err.toString());
    }
  }

  //audio
  else if (msg.body.startsWith(".yta ")) {
    try {
      chat.sendSeen();
      msg.react("🔄️");
      let urlYt = msg.body.slice(5);

      if (!urlYt.startsWith("http")) {
        msg.react("🚫");
        await msg.reply(`Give youtube video link to download audio!`);
        return;
      }
      await msg.reply(
        "Checking if the video is longer than 30 minutes...\n\nWhole process may take a while!"
      );

      let infoYt = await ytdl.getInfo(urlYt);
      //30 MIN
      if (infoYt.videoDetails.lengthSeconds >= 1800) {
        msg.react("🚫");
        await msg.reply(`Video is longer than 30 minutes!`);
        return;
      }

      let titleYt = infoYt.videoDetails.title;
      let Name = getRandom(".mp3");

      const stream = ytdl(urlYt, {
        filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
      }).pipe(fs.createWriteStream(`./downloaded-media/${Name}`));

      //console.log("Audio downloading ->", urlYt);
      await msg.reply("Downloading.. This may take upto 5 min!");

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
      });

      let stats = fs.statSync(`./downloaded-media/${Name}`);
      let fileSizeInBytes = stats.size;
      // Convert the file size to megabytes (optional)
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      //console.log("Audio downloaded ! Size: " + fileSizeInMegabytes);

      if (fileSizeInMegabytes <= 40) {
        const media = MessageMedia.fromFilePath(`./downloaded-media/${Name}`);
        msg.react("✅");
        await client.sendMessage(
          msg.from,
          new MessageMedia(media.mimetype, media.data, titleYt),
          {
            sendMediaAsDocument: true,
          }
        );
      } else {
        msg.react("❗");
        await msg.reply(`File size bigger than 40mb.`);
      }

      fs.unlinkSync(`./downloaded-media/${Name}`);
    } catch (err) {
      console.log(err);
      msg.react("❗");
      msg.reply(err.toString());
    }
  }

  //pdf search
  else if (msg.body.startsWith(".pdf ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔍");
    pdfname = msg.body.slice(5).split(" ").join("+");
    setTimeout(() => {
      msg.react("✅");
      msg.reply(
        `These are my suggestions\n\nhttps://www.pdfdrive.com/search?q=${pdfname}`
      );
      chat.clearState();
    }, 300);
  }

  //Translate
  //https://cloud.google.com/translate/docs/languages you can get language codes from here

  //Translate any language to English
  else if (msg.body.startsWith(".tte ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔄️");
    prompt = msg.body.slice(5);
    const res = await translate(prompt, { to: "en", fallbackBatch: false });
    setTimeout(() => {
      msg.react("✅");
      msg.reply(res.text);
      chat.clearState();
    }, 300);
  }

  //sin
  else if (msg.body.startsWith(".tts ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔄️");
    prompt = msg.body.slice(5);
    const res = await translate(prompt, { to: "si", fallbackBatch: false });
    setTimeout(() => {
      msg.react("✅");
      msg.reply(res.text);
      chat.clearState();
    }, 300);
  }

  //Truecaller - read truecallerjs documentation first
  else if (msg.body.startsWith(".find ")) {
    chat.sendSeen();
    chat.sendStateTyping();
    msg.react("🔄️");
    var searchData = {
      number: msg.body.slice(6),
      countryCode: "LK",
      installationId: "Get Id from truecaller app and paste it here",
      output: "TEXT",
    };

    var sn = truecallerjs.searchNumber(searchData);
    sn.then(function (response) {
      //console.log(response);
      var nameArr = response.split("\n");
      //console.log(nameArr);

      if (nameArr[2] == "access         : PUBLIC") {
        msg.react("❗");
        msg.reply("_*The number isn't in the database*_");
        chat.clearState();
      } else {
        msg.react("✅");
        msg.reply(nameArr[2]);
        chat.clearState();
      }
    });
  }

  //These are for Used for exchanging papers in my group . But contains how to send media from URl , Buttons & Lists
  else if (msg.body === ".deadlines") {
    let chat = await msg.getChat();
    const media = await MessageMedia.fromUrl("image or any file url link");
    chat.sendMessage(media, {
      caption: "Caption ",
    });
  }

  //Buttons and Lists are now deprecated.
  // Buttons
  else if (msg.body === ".papers") {
    let button1 = new Buttons(
      "Body",
      [{ body: "button name" }],
      "Header",
      "Footer"
    );
    client.sendMessage(msg.from, button1);
  }
  //List
  else if (msg.body === "button name") {
    let sections = [
      {
        title: "List title",
        rows: [
          { title: "1" },
          { title: "2" },
          { title: "3" },
          { title: "4" },
          { title: "5" },
        ],
      },
    ];
    let list1 = new List("List body", "Click Here", sections);
    await client.sendMessage(msg.from, list1);
  }
  //sending local files
  else if (msg.body === "1") {
    const media = MessageMedia.fromFilePath("file path");
    chat.sendMessage(media, { caption: "caption" });
  } else if (msg.body === "2") {
    const media = MessageMedia.fromFilePath("file path");
    chat.sendMessage(media, { caption: "caption" });
  } else if (msg.body === "3") {
    const media = MessageMedia.fromFilePath("file path");
    chat.sendMessage(media, { caption: "caption" });
  } else if (msg.body === "4") {
    const media = MessageMedia.fromFilePath("file path");
    chat.sendMessage(media, { caption: "caption" });
  } else if (msg.body === "5") {
    const media = MessageMedia.fromFilePath("file path");
    chat.sendMessage(media, { caption: "caption" });
  }
});
