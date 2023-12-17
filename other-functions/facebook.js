const getFBInfo = require("@xaviabot/fb-downloader");

const facebookDownload = async (msg, chat, MessageMedia, client) => {
  chat.sendSeen();
  msg.react("🔄️");
  try {
    let URL = msg.body;
    const result = await getFBInfo(URL);
    console.log(result);
    const media = await MessageMedia.fromUrl(result.hd, {
      unsafeMime: true,
    });

    msg.react("✅");
    await msg.reply(new MessageMedia(media.mimetype, media.data, result.title));

  } catch (err) {
    console.log(err);
    msg.react("❗");
    msg.reply(err.toString());
  }
};

module.exports.facebookDownload = facebookDownload;
