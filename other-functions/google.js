const gis = require("async-g-i-s");
const google = require("googlethis");

const googleSearch = async (msg, chat) => {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("🔍");
  const options = {
    page: 0,
    safe: false, // Safe Search
    parse_ads: false, // If set to true sponsored results will be parsed
    additional_params: {
      // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
      hl: "en",
    },
  };

  try {
    const googleSearch = msg.body.slice(8);
    const response = await google.search(googleSearch, options);
    const responseSliced = response.results.slice(0, 10);
    let vars = `_*Top 10 Results : ${googleSearch}*_\n`;
    for (let i = 0; i < responseSliced.length; i++) {
      vars += `\n------------------------------------------------\n\n*Title* : ${responseSliced[i].title}\n\n*Description* : ${responseSliced[i].description}\n\n*Link* : ${responseSliced[i].url}\n\n`;
    }
    msg.react("✅");
    msg.reply(vars);
    chat.clearState();
  } catch (error) {
    msg.react("❗");
    msg.reply(error.toString());
    chat.clearState();
  }
};

const imageSearch = async (msg, MessageMedia) => {
  msg.react("🔄️");
  (async () => {
    try {
      let imageSearch = msg.body.slice(5);
      const results = await gis(imageSearch);
      const imageSearch1 = await MessageMedia.fromUrl(results[0].url);
      const imageSearch2 = await MessageMedia.fromUrl(results[1].url);
      const imageSearch3 = await MessageMedia.fromUrl(results[2].url);
      const imageSearch4 = await MessageMedia.fromUrl(results[3].url);
      msg.react("✅");
      msg.reply(imageSearch1);
      msg.reply(imageSearch2);
      msg.reply(imageSearch3);
      msg.reply(imageSearch4);
    } catch (e) {
      msg.react("❗");
      msg.reply("Something went wrong.");
    }
  })();
};

module.exports.googleSearch = googleSearch;
module.exports.imageSearch = imageSearch;