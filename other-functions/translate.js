const translate = require("google-translate-api-x");

const tte = async  (msg, chat)=> {
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
const  tts = async(msg, chat) => {
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