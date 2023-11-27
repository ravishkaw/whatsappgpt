const truecallerjs = require("truecallerjs");

async function truecallerSearch(msg, chat) {
  chat.sendSeen();
  chat.sendStateTyping();
  msg.react("🔄️");

  let numberToSearch = msg.body.slice(6);

  const searchData = {
    number: numberToSearch,
    countryCode: "LK",
    installationId:
      "id here",
  };

  try {
    const response = await truecallerjs.search(searchData);

    let name = response.getName();
    let email = response.getEmailId();

    //no name and email
    if (name == "unknown name" && email == "unknown email") {
      msg.react("❗");
      msg.reply("_*The number isn't in the database*_");
      chat.clearState();

    //name only
    } else if (email == "unknown email") {
      msg.react("✅");
      msg.reply(`Name : ${name}`);
      chat.clearState();

    //name and email
    } else {
      msg.react("✅");
      msg.reply(`Name : ${name}\nEmail : ${email}`);
      chat.clearState();
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports.truecallerSearch = truecallerSearch;
