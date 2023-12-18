const { GoogleGenerativeAI } = require("@google/generative-ai");

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

module.exports.gemini = gemini;
