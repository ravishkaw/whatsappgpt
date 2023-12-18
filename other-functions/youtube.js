const ytdl = require("ytdl-core");
const fs = require("fs");

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

//video
const ytVideo = async (msg, chat, MessageMedia, client) => {
  try {
    chat.sendSeen();
    msg.react("🔄️");
    let urlYt = msg.body.slice(5);

    if (!urlYt.startsWith("http")) {
      msg.react("🚫");
      await msg.reply(`Give youtube video link to download audio!`);
      return;
    }

    let infoYt = await ytdl.getInfo(urlYt);
    //2 hrs
    if (infoYt.videoDetails.lengthSeconds >= 7200) {
      msg.react("🚫");
      await msg.reply(`Video is longer than 120 minutes!`);
      return;
    }

    let titleYt = infoYt.videoDetails.title;
    let Name = getRandom(".mp4");

    const stream = ytdl(urlYt, {
      filter: (info) => info.itag == 22 || info.itag == 18,
    }).pipe(fs.createWriteStream(`./mediafiles/${Name}`));
    //22 - 1080p/720p and 18 - 360p

    //await msg.reply("Downloading.. This may take upto 5 min!");
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./mediafiles/${Name}`);
    let fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes <= 500) {
      const media = MessageMedia.fromFilePath(`./mediafiles/${Name}`);
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
      await msg.reply(`File size bigger than 500mb.`);
    }

    fs.unlinkSync(`./mediafiles/${Name}`);
  } catch (err) {
    console.log(err);
    msg.react("❗");
    msg.reply(err.toString());
  }
};

//audio
const ytAudio = async (msg, chat, MessageMedia, client) => {
  try {
    chat.sendSeen();
    msg.react("🔄️");
    let urlYt = msg.body.slice(5);

    if (!urlYt.startsWith("http")) {
      msg.react("🚫");
      await msg.reply(`Give youtube video link to download audio!`);
      return;
    }

    let infoYt = await ytdl.getInfo(urlYt);
    //2hrs
    if (infoYt.videoDetails.lengthSeconds >= 7200) {
      msg.react("🚫");
      await msg.reply(`Video is longer than 120 minutes!`);
      return;
    }

    let titleYt = infoYt.videoDetails.title;
    let Name = getRandom(".mp3");

    const stream = ytdl(urlYt, {
      filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
    }).pipe(fs.createWriteStream(`./mediafiles/${Name}`));

    //await msg.reply("Downloading.. This may take upto 5 min!");

    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./mediafiles/${Name}`);
    let fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes <= 200) {
      const media = MessageMedia.fromFilePath(`./mediafiles/${Name}`);
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
      await msg.reply(`File size bigger than 200mb.`);
    }

    fs.unlinkSync(`./mediafiles/${Name}`);
  } catch (err) {
    console.log(err);
    msg.react("❗");
    msg.reply(err.toString());
  }
};

module.exports.ytVideo = ytVideo;
module.exports.ytAudio = ytAudio;
