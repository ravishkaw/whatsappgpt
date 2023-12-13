const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs").promises;

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const sharepoint = async (msg, chat, MessageMedia, client) => {
  chat.sendSeen();
  msg.react("🔄️");

  try {
    let Name = getRandom(".mp4");

    const videoLink = msg.body.slice(4);

    const outputFileName = `./mediafiles/${Name}`;

    await exec(`ffmpeg -i "${videoLink}" -codec copy ${outputFileName}`);

    const media = MessageMedia.fromFilePath(`./mediafiles/${Name}`);
    msg.react("✅");

    await client.sendMessage(
      msg.from,
      new MessageMedia(media.mimetype, media.data, Name)
    );

    // Remove the file after sending
    await fs.unlink(`./mediafiles/${Name}`);
  } catch (err) {
    console.log(err);
    msg.react("❗");
    msg.reply(err.toString());
  }
};

module.exports.sharepoint = sharepoint;
