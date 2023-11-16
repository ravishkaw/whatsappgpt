const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
  ffmpeg: "/usr/bin/ffmpeg",
});

const { quotedAI, chatAI } = require("./openai");
const { stickers, textToSticker } = require("./sticker");
const { ytAudio, ytVideo } = require("./youtube");
const { googleSearch, imageSearch } = require("./google");
const { truecallerSearch } = require("./truecaller");
const { tte, tts } = require("./translate");

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

  //
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

  //OpenAI - Q & A
  else if (msg.body.startsWith(".bb ") || msg.body.startsWith(".bibi ")) {
    chatAI(msg, chat);
  }

  //make whatsapp stickers
  else if (msg.body === ".sticker") {
    stickers(msg, chat, MessageMedia, client);
  }
  //text to sticker
  else if (msg.body === ".txt") {
    textToSticker(msg, chat, quotedMsg, MessageMedia, client);
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
  }
  else if (msg.body.startsWith(".tts ")) {
    tts(msg, chat);
  }
});
