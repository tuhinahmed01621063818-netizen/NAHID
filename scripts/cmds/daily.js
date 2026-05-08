const fs = require("fs");
const request = require("request");
const path = require("path");

const cacheDir = path.join(__dirname, "../cache/");
const DATA_PATH = path.join(cacheDir, "dailyData.json");
const GIF_URL = "https://i.imgur.com/tKyLh5l.gif";
const GIF_PATH = path.join(cacheDir, "daily.gif");

module.exports = {
  config: {
    name: "daily",
    aliases: ["reward"],
    version: "2.1",
    author: "FARHAN-KHAN",
    role: 0,
    countDown: 5,
    category: "game",
    description: "Claim daily reward (1000 - 10000 coins)"
  },

  onLoad: function () {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, "{}");
    }

    if (!fs.existsSync(GIF_PATH)) {
      console.log("[Daily] Downloading GIF...");
      request(GIF_URL)
        .pipe(fs.createWriteStream(GIF_PATH))
        .on("close", () => console.log("[Daily] GIF ready"))
        .on("error", err => console.log("[Daily] GIF error:", err));
    }
  },

  onStart: async function ({ api, event, usersData }) {
    const { threadID, senderID } = event;

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(DATA_PATH));
    } catch {
      data = {};
    }

    const now = Date.now();
    const cooldown = 86400000; // 24h

    // ⏳ cooldown check
    if (data[senderID] && now - data[senderID] < cooldown) {
      const left = cooldown - (now - data[senderID]);
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);

      return api.sendMessage(
        `⏳ তুমি already daily claim করেছো!\nআবার নিতে পারবে ${h}h ${m}m পরে।`,
        threadID
      );
    }

    if (!fs.existsSync(GIF_PATH)) {
      return api.sendMessage("❌ GIF এখনো ready হয়নি, পরে চেষ্টা করো।", threadID);
    }

    // 🎁 opening message
    api.sendMessage(
      {
        body: "🎁 Opening your Daily Reward...",
        attachment: fs.createReadStream(GIF_PATH)
      },
      threadID,
      async (err, info) => {
        if (err) return;

        await new Promise(r => setTimeout(r, 3000));

        // ❌ unsend opening msg
        try {
          await api.unsendMessage(info.messageID);
        } catch {}

        // 💰 reward generate
        const reward = Math.floor(Math.random() * 9000) + 1000;

        // 👤 user data
        let user = await usersData.get(senderID);
        let oldBalance = user.money || 0;

        await usersData.set(senderID, {
          money: oldBalance + reward
        });

        let newBalance = oldBalance + reward;

        // 💾 save cooldown
        data[senderID] = now;
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

        // 📩 final message
        const msg =
`╔══════════════╗
   🎁 DAILY REWARD 🎁
╚══════════════╝

💰 Reward Received: ${reward}

━━━━━━━━━━━━━━━━━━
💵 Old Balance : ${oldBalance}
💎 New Balance : ${newBalance}
━━━━━━━━━━━━━━━━━━
🔥 Come back after 24 hours!`;

        api.sendMessage(msg, threadID);
      }
    );
  }
};
