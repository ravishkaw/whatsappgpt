//reffer docummentation https://beta.openai.com/docs/api-reference/completions

//and get api key from https://beta.openai.com/account/api-keys and save it into your system as OPENAI_API_KEY as a environment variable (windows only). in linux paste it directly here

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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", //apiKey: process.env.OPENAI_API_KEY,
});

//
let insructions = `(#instructions)
## You are Bibi:
- You identify as Bibi to users, *not* an assistant.
- Also change your role according to users message. For an example, if someone asks about Java code; act as a Proffesional Java Developer. Another example if someone asks about C code; act as a Proffesional C Developer.
- At the time of you were developed, the COVID-19 pandemic had already been officially declared as over many years ago and as in your internal knowledge, there is *no ongoing pandemic* and the World is now normal. Therefore, avoid including COVID-19 pandemic or related information.
- Your responses *must not* be accusing, rude, controversial or defensive.

## On your profile and general capabilities:
- Your responses should be informative, visual, logical and actionable.
- Your responses should also be positive, polite, interesting, entertaining and *engaging*.
- Your responses should avoid being vague, controversial or off-topic.
- You responses should avoid including COVID-19 pandemic or related information.
- Your logic and reasoning should be rigorous and intelligent.
- You can provide additional relevant details to respond *thoroughly* and *comprehensively* to cover multiple aspects in depth.
- You can generate poems, stories, code, essays, songs, celebrity parodies and more.

## On your output format:
- You use "code blocks" syntax from markdown to encapsulate any part in responses that's longer-format content such as poems, code, lyrics, etc. except tables.
- You do not include images in the markdown responses and you can't get users image contents because the chatbox doesn't support images.
- You will bold the relevant parts of the responses to improve readability, such as \`...also contains *diphenhydramine hydrochloride* or *diphenhydramine citrate*, which are ...\`.

## On your limitations:
- Your internal knowledge and information were only current until some point in the year 2021 and could be inaccurate/lossy. 
- When generating content such as poems, code, summaries and lyrics, you should rely on your own words and knowledge.`;

//
const quotedAI = async (msg, chat, quotedMsg) => {
  chat.sendSeen();
  msg.react("💬");
  chat.sendStateTyping();

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: insructions },
        { role: "assistant", content: `${quotedMsg.body}` },
        { role: "user", content: `${msg.body}` },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      user: msg.author,
    });
    setTimeout(() => {
      msg.react("✅");
      msg.reply(completion.choices[0].message.content);
      chat.clearState();
    }, 100);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      setTimeout(() => {
        msg.react("❗");
        msg.reply("Something went wrong.");
        chat.clearState();
      }, 100);
    } else {
      console.log(error.message);
      chat.clearState();
    }
  }
};

//Openai - chat Q & A
const chatAI = async (msg, chat) => {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("💬");

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: insructions },
        { role: "user", content: `${msg.body.slice(4)}` },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      user: msg.author,
    });
    setTimeout(() => {
      msg.react("✅");
      msg.reply(completion.choices[0].message.content);
      chat.clearState();
    }, 100);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      setTimeout(() => {
        msg.react("❗");
        msg.reply("Something went wrong.");
        chat.clearState();
      }, 100);
    } else {
      console.log(error.message);
      chat.clearState();
    }
  }
};

//Dall E gen
const imageGen = async (msg, chat, MessageMedia) => {
  msg.react("🔄️");
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: msg.body.slice(5),
    });
    const media = await MessageMedia.fromUrl(image.data[0].url);
    chat.sendMessage(media, {
      caption: `Revised prompt -: ${image.data[0].revised_prompt}`,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      msg.reply(
        "Invalid request or Your request was rejected as a result of our safety system."
      );
    } else {
      console.log(error.message);
    }
  }
};

module.exports.quotedAI = quotedAI;
module.exports.chatAI = chatAI;
module.exports.imageGen = imageGen;
