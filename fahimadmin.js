const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const LOCKED_AUTHOR = "MR_FARHAN";

module.exports = {
config: {
name: "admin",
aliases: ["admininfo"],
version: "1.0.0",
author: "MR_FARHAN",
role: 0,
countDown: 5,
shortDescription: {
en: "Admin Information"
},
category: "admin"
},

onStart: async function ({ api, event, usersData, threadsData, message }) {

try {

if (module.exports.config.author !== LOCKED_AUTHOR) {
return message.reply("⛔ Author modified! This command is disabled.");
}

// ===== ADMIN INFO =====
const adminName = "𝙼𝚁.𝙵𝙰𝙷𝙸𝙼";
const adminReligion = "𝙸𝚂𝙻𝙰𝙼";
const adminRelation = "𝚂𝙸𝙽𝙶𝙻𝙴";
const adminAddress = "𝙳𝙷𝙰𝙺𝙰";
const adminAge = "18+";

// ===== CONTACT =====
const facebook = "fb.com/fahim.ahmed.raj.207";
const whatsapp = "wa.me/+8801771240377";
const telegram = "t.me/DEVIL_FAHIM";
const youtube = "yb.com/@FAHIM_VAI YT";

// ===== BOT INFO =====
const botName = global.GoatBot?.config?.nickNameBot || "GOAT BOT";
const prefix = global.GoatBot?.config?.prefix || "-";
const totalCommands = global.GoatBot?.commands?.size || 0;

// ===== USERS & GROUPS =====
const allUsers = await usersData.getAll();
const allThreads = await threadsData.getAll();

const totalUsers = allUsers.length;
const totalGroups = allThreads.length;

// ===== UPTIME =====
const uptime = process.uptime();

const days = Math.floor(uptime / 86400);
const hours = Math.floor((uptime % 86400) / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);

const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

// ===== TIME =====
const now = moment().tz("Asia/Dhaka");
const time = now.format("hh:mm:ss A");
const date = now.format("DD/MM/YYYY");

// ===== CACHE =====
const cacheDir = path.join(__dirname, "cache");

if (!fs.existsSync(cacheDir)) {
fs.mkdirSync(cacheDir, { recursive: true });
}

const videoPath = path.join(cacheDir, "admin.mp4");

// ===== VIDEO URL =====
const videoUrl = "https://files.catbox.moe/9045ak.mp4";

// ===== DOWNLOAD VIDEO =====
const response = await axios({
url: videoUrl,
method: "GET",
responseType: "stream"
});

const writer = fs.createWriteStream(videoPath);

response.data.pipe(writer);

await new Promise((resolve, reject) => {
writer.on("finish", resolve);
writer.on("error", reject);
});

// ===== MESSAGE =====
const msg = `
╔═══✦══════════✦═══╗
║ 🤖「 𝐀𝐃𝐌𝐈𝐍 𝐏𝐀𝐍𝐄𝐋 」🤖 ║
╚═══✦══════════✦═══╝

┏━━━━━━━━━━━━━━━━━━┓
┃ 👑 NAME: ${adminName}
┃ 🕋 RELIGION: ${adminReligion}
┃ 💞 RELATION: ${adminRelation}
┃ 🏠 ADDRESS: ${adminAddress}
┃ 🔥 AGE: ${adminAge}
┃ 🟢 ACTIVE: 24/7
┗━━━━━━━━━━━━━━━━━━┛

╭─── 📱 CONTACT ME ───╮
│ 🌐 FACEBOOK
│ └─ ${facebook}
│ 💬 WHATSAPP
│ └─ ${whatsapp}
│ ✈️ TELEGRAM
│ └─ ${telegram}
│ ▶️ YOUTUBE
│ └─ ${youtube}
╰───────────────────╯

╭─── 🤖 BOT DETAILS ───╮
│ ⚡ NAME: ${botName}
│ 👥 USERS: ${totalUsers}
│ 💬 GROUPS: ${totalGroups}
│ 📦 CMDS: ${totalCommands}
│ 🔰 PREFIX: ${prefix}
╰─────────────────────╯

╭────── 📅 TIME ──────╮
│ 🗓️ DATE: ${date}
│ ⏰ TIME: ${time}
│ ⏳ UPTIME: ${uptimeText}
╰────────────────────╯

╔═══✦══════════✦═══╗
║ 「 THANKS FOR USING 」 ║
╚═══✦══════════✦═══╝
`;

await message.reply({
body: msg,
attachment: fs.createReadStream(videoPath)
});

// DELETE VIDEO
setTimeout(() => {
if (fs.existsSync(videoPath)) {
fs.unlinkSync(videoPath);
}
}, 10000);

} catch (err) {
console.log(err);
return message.reply("❌ | Admin command error.");
}

}
};