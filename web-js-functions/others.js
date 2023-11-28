//file write
const addToFile = async (msg, chat, fs) => {
  if (!chat.isGroup) {
    chat.sendSeen();
    const stringToWrite = `${msg.body.slice(5)}\n`;

    fs.readFile("users.txt", function (err, data) {
      if (err) throw err;
      if (data.includes(stringToWrite)) {
        msg.reply("Already in the AI list");
      } else {
        fs.appendFile("users.txt", stringToWrite, function (err) {
          if (err) throw err;
          msg.reply("Added to the AI list");
        });
      }
    });
  }
};

//
const removeFromFile = async (msg, chat, fs) => {
  if (!chat.isGroup) {
    chat.sendSeen();
    const stringToRemove = `${msg.body.slice(5)}\n`;

    fs.readFile("users.txt", function (err, data) {
      if (err) throw err;
      if (data.includes(stringToRemove)) {
        var data = fs.readFileSync("users.txt", "utf-8");
        var newValue = data.replace(stringToRemove, "");
        fs.writeFileSync("users.txt", newValue, "utf-8");
        msg.reply("Removed from the AI list");
      } else {
        msg.reply("Already removed from the AI list");
      }
    });
  }
};

module.exports.addToFile = addToFile;
module.exports.removeFromFile = removeFromFile;