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

//!make async and link to index.js
//  // Direct send a new message to owner
//   if (msg.body.startsWith(".sendowner ")) {
//   chat.sendSeen();
//   chat.sendStateTyping();
//   msg.react("🔄️");
//   if (!chat.isGroup) {
//     let msg1 = msg.body.slice(11);
//     let number = `94775048662@c.us`;
//     setTimeout(() => {
//       msg.react("✅");
//       msg.reply("Done. Sent to Ravishka");
//       client.sendMessage(
//         number,
//         `${contact.pushname}\n${contact.id.user}\n\n${msg1}`
//       );
//       chat.clearState();
//     }, 800);
//   }
// }

// // Direct send a new message to specific id
// else if (msg.body.startsWith(".sendton ")) {
//   chat.sendSeen();
//   let number = msg.body.split(" ")[1];
//   let messageIndex = msg.body.indexOf(number) + number.length;
//   let msg2 = msg.body.slice(messageIndex, msg.body.length);
//   number = number.includes("@c.us") ? number : `${number}@c.us`;
//   setTimeout(() => {
//     msg.react("✅");
//     client.sendMessage(number, `🔰 *Message from Ravishka* 🔰\n\n${msg2}`);
//   }, 500);
// }

// //opened chats
// else if (msg.body === ".chats") {
//   chat.sendSeen();
//   chat.sendStateTyping();
//   const chats = await client.getChats();
//   setTimeout(() => {
//     msg.react("✅");
//     client.sendMessage(msg.from, `I have ${chats.length} chats open.`);
//     chat.clearState();
//   }, 400);
// }

// //chat or group id
// else if (msg.body === ".id") {
//   chat.sendSeen();
//   let id = chat.id.user;
//   let number = `94775048662@c.us`;
//   msg.react("✅");
//   client.sendMessage(number, id);
// }

// //clear chat
// else if (msg.body === ".clear") {
//   if (!chat.isGroup) {
//     chat.sendSeen();
//     chat.clearMessages(true);
//     msg.react("✅");
//     chat.sendMessage("Done.");
//   }
// }

module.exports.bibiInfo = bibiInfo;