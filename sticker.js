const mime = require("mime-types");
const fs = require("fs");
const path = require("path");
const { UltimateTextToImage } = require("ultimate-text-to-image");

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

async function stickers(msg, chat, MessageMedia, client) {
  chat.sendSeen();
  if (msg.hasMedia) {
    msg.react("✅");
    msg.downloadMedia().then((media) => {
      if (media) {
        const mediaPath = "./mediafiles/";

        if (!fs.existsSync(mediaPath)) {
          fs.mkdirSync(mediaPath);
        }

        const extension = mime.extension(media.mimetype);
        const filename = new Date().getTime();
        const fullFilename = mediaPath + filename + "." + extension;
        // Save to file
        try {
          fs.writeFileSync(fullFilename, media.data, {
            encoding: "base64",
          });
          console.log("File downloaded successfully!", fullFilename);
          console.log(fullFilename);
          MessageMedia.fromFilePath((filePath = fullFilename));
          client.sendMessage(
            msg.from,
            new MessageMedia(media.mimetype, media.data, filename),
            {
              sendMediaAsSticker: true,
              stickerAuthor: "Created by Bibi",
              stickerName: "STICKERS",
            }
          );
          fs.unlinkSync(fullFilename);
          console.log(`File Deleted successfully!`);
        } catch (err) {
          console.log("Failed to save the file:", err);
          console.log(`File Deleted successfully!`);
        }
      }
    });
  } else {
    msg.react("🚫");
    msg.reply(`send image/video/gif with caption *.sticker* `);
  }
}

//text to sticker
async function textToSticker(msg, chat, quotedMsg, MessageMedia, client) {
  if (quotedMsg) {
    if (quotedMsg.type == "chat") {
      try {
        msg.react("🔄️");
        chat.sendSeen();

        const textToImage = new UltimateTextToImage(quotedMsg.body, {
          width: 500,
          height: 500,
          fontFamily: "Arial",
          fontColor: "#00FF00",
          fontSize: 56,
          minFontSize: 10,
          lineHeight: 40,
          autoWrapLineHeightMultiplier: 1.2,
          margin: 20,
          marginBottom: 40,
          align: "center",
          valign: "middle",
        });

        const stickerFileName = getRandom(".png");
        textToImage.render().toFile(path.join("./mediafiles", stickerFileName));

        //
        const media = MessageMedia.fromFilePath(
          `./mediafiles/${stickerFileName}`
        );
        msg.react("✅");
        client.sendMessage(
          msg.from,
          new MessageMedia(media.mimetype, media.data, stickerFileName),
          {
            sendMediaAsSticker: true,
            stickerAuthor: "Created by Bibi",
            stickerName: "STICKERS",
          }
        );
        fs.unlinkSync(`./mediafiles/${stickerFileName}`);
        console.log(`File Deleted successfully!`);
      } catch (err) {
        fs.unlinkSync(`./mediafiles/${stickerFileName}`);
        console.log("Failed to save the file:", err);
        console.log(`File Deleted successfully!`);
      }
    } else {
      msg.react("🚫");
      msg.reply("Use .sticker to make stickers from image/video/gif");
    }
  } else {
    msg.react("🚫");
    msg.reply("Quote/ mention a text message to make a sticker");
  }
}

module.exports.stickers = stickers;
module.exports.textToSticker = textToSticker;
