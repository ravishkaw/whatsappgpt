//reffer wwebjs documentation and do changes as you want.

//refer other documentations from all imported npm packages

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
   // executablePath: "/usr/bin/google-chrome-stable", // macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome || Windows: C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
  },
  ffmpeg: "/usr/bin/ffmpeg",
});

const {
  bibiInfo,
  sendOwner,
  sendToNo,
  chats,
} = require("./web-js-functions/botinfo");
const {
  join,
  leave,
  groupInfo,
  tagAll,
  adminReport,
} = require("./web-js-functions/group");
const {
  chatID,
  clearChat,
  addToFile,
  removeFromFile,
} = require("./web-js-functions/others");

const { quotedAI, chatAI, imageGen } = require("./other-functions/openai");
const { stickers, textToSticker } = require("./other-functions/sticker");
const { ytAudio, ytVideo } = require("./other-functions/youtube");
const { googleSearch, imageSearch } = require("./other-functions/google");
const { truecallerSearch } = require("./other-functions/truecaller");
const { tte, tts } = require("./other-functions/translate");
const { sharepoint } = require("./other-functions/sharepointDownloader");
const { instagramDownload } = require("./other-functions/insta");
const { facebookDownload } = require("./other-functions/facebook");

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
  //
  const quotedMsg = await msg.getQuotedMessage();
  const chat = await msg.getChat();
  const contact = await msg.getContact();
  const authorId = msg.author;

  //OpenAI - chat with quoted message
  if (msg.hasQuotedMsg) {
    if (msg.type === "chat") {
      if (quotedMsg.fromMe) {
        if (!msg.body.startsWith(".")) {
          if (msg.body === "Hi" || msg.body === "hi") {
            //console.log("Hi");
          } else {
            quotedAI(msg, chat, quotedMsg);
          }
        }
      }
    }
  }

  //bot commands
  //Reply to Hi
  else if (
    msg.body === ".bb" ||
    msg.body === "Hi" ||
    msg.body === ".bibi" ||
    msg.body === "hi"
  ) {
    chat.sendSeen();
    chat.sendStateTyping();
    setTimeout(() => {
      msg.react("🙃");
      msg.reply("Hi there. How can I help you?");
      chat.clearState();
    }, 100);
  }

  //bot info
  else if (msg.body === ".bibiinfo" || msg.body === ".bbinfo") {
    bibiInfo(msg, chat, client);
  }

  //Send Owner
  else if (msg.body.startsWith(".sendowner ")) {
    sendOwner(msg, chat, client, contact);
  }

  //Direct send message via bot
  else if (msg.body.startsWith(".sendton ")) {
    sendToNo(msg, chat, client);
  }

  //Opened Chats Count
  else if (msg.body === ".chats") {
    chats(msg, chat, client);
  }

  //Group commands
  //join group
  else if (msg.body.startsWith(".joinlink ")) {
    join(msg, chat, client);
  }

  //leave group
  else if (msg.body === ".leave") {
    leave(msg, chat, authorId);
  }

  //group info
  else if (msg.body === ".groupinfo") {
    groupInfo(msg, chat);
  }

  //mention all group members
  else if (msg.body === ".tagall") {
    tagAll(msg, chat, client, quotedMsg, authorId);
  }

  //admin report
  else if (msg.body === "@admin" || msg.body.startsWith("@admin")) {
    adminReport(msg, chat, client, contact);
  }

  //OpenAI - Q & A
  else if (msg.body.startsWith(".bb ") || msg.body.startsWith(".bibi ")) {
    chatAI(msg, chat);
  }
  //OpenAI image gen Dall -e
  else if (msg.body.startsWith(".gen ")) {
    imageGen(msg, chat, MessageMedia);
  }

  //make whatsapp stickers
  else if (msg.body === ".sticker") {
    stickers(msg, chat, fs, MessageMedia, client);
  }
  //text to sticker
  else if (msg.body === ".txt") {
    textToSticker(msg, chat, fs, quotedMsg, MessageMedia, client);
  }

  //yt download
  //video
  else if (msg.body.startsWith(".ytv ")) {
    ytVideo(msg, chat, MessageMedia, client);
  }
  //audio
  else if (msg.body.startsWith(".yta ")) {
    ytAudio(msg, chat, MessageMedia, client);
  }

  //insta
  else if (msg.body.startsWith("https://www.instagram.com")) {
    instagramDownload(msg, chat, MessageMedia, client);
  }

  //facebook
  else if (
    msg.body.startsWith("https://www.facebook.com/") ||
    msg.body.startsWith("https://m.facebook.com/") ||
    msg.body.startsWith("https://fb.watch")
  ) {
    facebookDownload(msg, chat, MessageMedia, client);
  }

  //google search
  else if (msg.body.startsWith(".search ")) {
    googleSearch(msg, chat);
  }
  //image search
  else if (msg.body.startsWith(".img ")) {
    imageSearch(msg, chat);
  }

  //Truecaller
  else if (msg.body.startsWith(".find ")) {
    truecallerSearch(msg, chat);
  }

  //Translate
  else if (msg.body.startsWith(".tte ")) {
    tte(msg, chat);
  } else if (msg.body.startsWith(".tts ")) {
    tts(msg, chat);
  }

  //sharepoint
  else if (msg.body.startsWith(".dl ")) {
    sharepoint(msg, chat, MessageMedia, client);
  }

  //Chat Id
  else if (msg.body === ".id") {
    chatID(msg, chat, client);
  }

  //clear chat
  else if (msg.body === ".clear") {
    clearChat(msg, chat);
  }

  //Files write
  else if (msg.body.startsWith(".add ")) {
    addToFile(msg, chat, fs);
  }
  //remove
  else if (msg.body.startsWith(".rem ")) {
    removeFromFile(msg, chat, fs);
  }
});
