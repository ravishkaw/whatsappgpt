// Bibi Info
const bibiInfo = async (msg, chat, client) => {
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
};

// Direct send a new message to owner
const sendOwner = async (msg, chat, client, contact) => {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("🔄️");
  if (!chat.isGroup) {
    let msg1 = msg.body.slice(11);
    let number = `94775048662@c.us`;
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
};

// Direct send a new message to specific id
const sendToNo = async (msg, chat, client) => {
  chat.sendSeen();
  let number = msg.body.split(" ")[1];
  let messageIndex = msg.body.indexOf(number) + number.length;
  let msg2 = msg.body.slice(messageIndex, msg.body.length);
  number = number.includes("@c.us") ? number : `${number}@c.us`;
  setTimeout(() => {
    msg.react("✅");
    client.sendMessage(number, `🔰 *Message from Ravishka* 🔰\n\n${msg2}`);
  }, 500);
};

//opened chats
const chats = async (msg, chat, client) => {
  chat.sendSeen();
  chat.sendStateTyping();
  const chats = await client.getChats();
  setTimeout(() => {
    msg.react("✅");
    client.sendMessage(msg.from, `I have ${chats.length} chats open.`);
    chat.clearState();
  }, 400);
};

module.exports.bibiInfo = bibiInfo;
module.exports.sendOwner = sendOwner;
module.exports.sendToNo = sendToNo;
module.exports.chats = chats;
