const translate = require("google-translate-api-x");

async function tte(msg, chat) {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("🔄️");
  prompt = msg.body.slice(5);
  const res = await translate(prompt, { to: "en", fallbackBatch: false });
  setTimeout(() => {
    msg.react("✅");
    msg.reply(res.text);
    chat.clearState();
  }, 100);
}

//sin
async function tts(msg, chat) {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("🔄️");
  prompt = msg.body.slice(5);
  const res = await translate(prompt, { to: "si", fallbackBatch: false });
  setTimeout(() => {
    msg.react("✅");
    msg.reply(res.text);
    chat.clearState();
  }, 100);
}

module.exports.tte = tte; 
module.exports.tts = tts;