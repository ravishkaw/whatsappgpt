const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const mime = require("mime-types");

const genAI = new GoogleGenerativeAI("API key here");

const gemini = async (msg, chat) => {
  chat.sendSeen();
  msg.react("💬");
  chat.sendStateTyping();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = msg.body.slice(8);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    setTimeout(() => {
      msg.react("✅");
      msg.reply(text);
      chat.clearState();
    }, 100);
  } catch (error) {
    setTimeout(() => {
      msg.react("❗");
      msg.reply("Something went wrong.");
      chat.clearState();
    }, 100);
  }
};

const geminiImage = async (msg, chat) => {
  chat.sendSeen();
  msg.react("💬");
  chat.sendStateTyping();
  try {
    const media = await msg.downloadMedia();

    if (media) {
      const mediaPath = "./mediafiles/";

      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath);
      }

      const extension = mime.extension(media.mimetype);
      const filename = new Date().getTime();
      const fullFilename = mediaPath + filename + "." + extension;

      // Save to file
      fs.writeFileSync(fullFilename, media.data, { encoding: "base64" });
      console.log("File downloaded successfully!", fullFilename);

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = msg.body.slice(8);
        const imageParts = [
          {
            inlineData: {
              data: Buffer.from(fs.readFileSync(fullFilename)).toString(
                "base64"
              ),
              mimeType: media.mimetype,
            },
          },
        ];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        setTimeout(() => {
          msg.react("✅");
          msg.reply(text);
          chat.clearState();
        }, 100);
      } catch (error) {
        throw error;
      } finally {
        fs.unlinkSync(fullFilename);
        console.log(`File Deleted successfully!`);
      }
    }
  } catch (error) {
    console.log(error);
    msg.react("❗");
    msg.reply("Something went wrong.");
    chat.clearState();
  }
};

module.exports.gemini = gemini;
module.exports.geminiImage = geminiImage;
