// TODO: Add more info about the bot and link to index.js

// Bibi Info
async function bibiInfo() {

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

module.exports.bibiInfo = bibiInfo;