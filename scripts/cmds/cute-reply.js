const fs = require("fs-extra");
const path = require("path");
const https = require("https");

exports.config = {
  name: "cutereply",
  version: "PRO-ULTIMATE",
  author: "Farhan-Khan",
  countDown: 0,
  role: 0,
  shortDescription: "Smart trigger system",
  longDescription: "Anywhere trigger + styled reply",
  category: "system"
};

const cooldown = 1000;
const last = {};

// 🔥 trackers
const textIndex = {};
const imageIndex = {};

const TRIGGERS = [

  // 🟢 FARHAN SYSTEM
  {
    words: ["farhan","Farhan","FARHAN","ফারহান"],

    texts: [
      "👉 ফারহান বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
      "🔥 বস ফারহান কে ডাকিস না পারলে একটা জি এফ দে...!😃",
      "😎 চুমু খাওয়ার বয়স টা আমার বস ফারহান চকলেট🍫খেয়ে উড়িয়ে দিল 🤗",
      "👉 আমার বস  𝗙𝗔𝗛𝗜𝗠 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো https://m.me/fahim.ahmed.raj.207 🔰 ♪√বস ফ্রি হলে আসবে🧡😁😜"
    ],

    images: [
      "https://i.imgur.com/TqS7xxC.jpeg",
      "https://i.imgur.com/aNYl58f.jpeg"
    ]
  },

  // 🤖 MENTION SYSTEM
  {
    words: [
      "@ঝ্ঁগ্ঁরা্ঁটে্ঁ বে্ঁবি্ঁ",
      "@আঁইঁ লাঁভঁ ইঁউঁ জাঁনঁ",
      "@সিৃঁ'জুৃঁ'কাৃঁ সিৃঁ'জুৃঁ"
    ],

    replies: [
      {
        text: "🤖 আমাকে মেনশন দিয়ে লাভ নাই 😆 আমি একটা রোবট শুধু ফান করার জন্য!",
        image: "https://i.imgur.com/9MYsWOs.jpeg"
      },
      {
        text: "😽 আমি একটা বট, বস ফাহিম বানাইছে 😎",
        image: "https://i.imgur.com/zrpFJUc.jpeg"
      }
    ]
  }

];

exports.onStart = async function () {};

exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").toLowerCase().trim();
    if (!body) return;

    if (senderID === api.getCurrentUserID()) return;

    const now = Date.now();
    if (last[threadID] && now - last[threadID] < cooldown) return;
    last[threadID] = now;

    // 🔥 ANYWHERE MATCH (includes)
    const matched = TRIGGERS.find(t =>
      t.words.some(w =>
        body.includes(w.toLowerCase())
      )
    );

    if (!matched) return;

    let text, imgUrl;

    // 🟢 FARHAN
    if (matched.texts) {

      if (!textIndex[threadID]) textIndex[threadID] = 0;
      if (!imageIndex[threadID]) imageIndex[threadID] = 0;

      text = matched.texts[textIndex[threadID]];
      imgUrl = matched.images[imageIndex[threadID]];

      textIndex[threadID] =
        (textIndex[threadID] + 1) % matched.texts.length;

      imageIndex[threadID] =
        (imageIndex[threadID] + 1) % matched.images.length;
    }

    // 🤖 MENTION
    else if (matched.replies) {

      const reply =
        matched.replies[Math.floor(Math.random() * matched.replies.length)];

      text = reply.text;
      imgUrl = reply.image;
    }

    const imgPath = path.join(__dirname, `${Date.now()}.jpg`);

    try {
      await download(imgUrl, imgPath);

      api.sendMessage(
        {
          body: `‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
${text}
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
          attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
      );

    } catch {
      api.sendMessage(
        {
          body: `‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
${text}
‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`
        },
        threadID,
        messageID
      );
    }

    // 😆🔥 REACT
    const reacts = ["😆", "🔥", "😂", "😎"];
    api.setMessageReaction(
      reacts[Math.floor(Math.random() * reacts.length)],
      messageID,
      () => {},
      true
    );

  } catch (err) {
    console.log(err);
  }
};

// download
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) return reject();
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
  }
