// Join group via invite link
const join = async (msg, chat, client) => {
  chat.sendSeen();
  const inviteLink = msg.body.split(" ")[1];
  inviteCode = inviteLink.replace("https://chat.whatsapp.com/", "");

  try {
    await client.acceptInvite(inviteCode);
    msg.react("✅");
    msg.reply("Joined the group.");
  } catch (e) {
    msg.react("🚫");
    msg.reply("That invite link seems to be invalid.");
  }
};

//Leave the group - admins only
const leave = async (msg, chat, authorId) => {
  chat.sendSeen();
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
};

//get group info
const groupInfo = async (msg, chat) => {
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
};

//mentioning all group members
const tagAll = async (msg, chat, client, quotedMsg, authorId) => {
  chat.sendSeen();
  console.log(quotedMsg.body);
  if (chat.isGroup) {
    for (let participant of chat.participants) {
      if (participant.id._serialized === authorId && participant.isAdmin) {
        let mentionsList = [];
        // let text = "";

        for (let participant of chat.participants) {
          const members = await client.getContactById(
            participant.id._serialized
          );
          mentionsList.push(members);
        }
        // client.sendMessage(msg.from, text, {
        //   mentions: mentionsList,
        // });

        //mentioning options
        if (quotedMsg) {
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
};

//admin report
const adminReport = async (msg, chat, client, contact) => {
  chat.sendSeen();
  chat.sendStateTyping();

  if (chat.isGroup) {
    let mentions = [];

    for (let participant of chat.participants) {
      const admins = await client.getContactById(participant.id._serialized);
      if (participant.isAdmin) {
        mentions.push(admins);
      }
    }
    msg.react("👨‍💻");
    await chat.sendMessage(`${contact.pushname} mentioned admins`, {
      mentions,
    });
    chat.clearState();
  }
};

module.exports.join = join;
module.exports.leave = leave;
module.exports.groupInfo = groupInfo;
module.exports.tagAll = tagAll;
module.exports.adminReport = adminReport;
