const instagramDl = require("@sasmeee/igdl");

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const instagramDownload = async (msg, chat, MessageMedia, client) => {
  chat.sendSeen();
  msg.react("🔄️");
  try {
    let URL = msg.body;
    let Name = "IG Video " + getRandom(".mp4");

    const dataList = await instagramDl(URL);
    // console.log(dataList[0].download_link);
    const media = await MessageMedia.fromUrl(dataList[0].download_link, {
      unsafeMime: true,
    });

    msg.react("✅");
    await msg.reply(new MessageMedia(media.mimetype, media.data, Name));
    
  } catch (err) {
    console.log(err);
    msg.react("❗");
    msg.reply(err.toString());
  }
};

module.exports.instagramDownload = instagramDownload;
