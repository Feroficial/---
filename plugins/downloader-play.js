import axios from "axios";
import yts from "yt-search";
import fs from "fs";

const ADONIX_API = "https://api-adonix.ultraplus.click/download/ytaudio";
const ADONIX_KEY = "dvyer";
const BOT_NAME = "Michi-wabot";

export const ytaudioCommand = {
  command: ["play"],
  categoria: "descarga",
  description: "Descarga el audio de un video de YouTube y lo envía reproducible",

  run: async (client, m, args) => {
    try {
      if (!args.length)
        return client.reply(
          m.chat,
          "❌ Ingresa un enlace o nombre del video de YouTube.",
          m,
          global.channelInfo
        );

      let videoUrl = args.join(" ");
      let title = "audio";

      if (!videoUrl.startsWith("http")) {
        const search = await yts(videoUrl);
        if (!search.videos?.length)
          return client.reply(
            m.chat,
            "❌ No se encontraron resultados.",
            m,
            global.channelInfo
          );

        videoUrl = search.videos[0].url;
        title = search.videos[0].title || title;
      }

      await client.reply(
        m.chat,
        `⏳ Procesando tu audio...\nPuede tardar si el archivo es pesado.\n🤖 ${BOT_NAME}`,
        m,
        global.channelInfo
      );

      const res = await axios.get(
        `${ADONIX_API}?url=${encodeURIComponent(videoUrl)}&apikey=${ADONIX_KEY}`,
        { timeout: 60000 }
      );

      const data = res.data?.data;
      if (!data?.url)
        throw new Error("Respuesta inválida de la API");

      const safeTitle = (data.title || title)
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .slice(0, 60);

      const audioRes = await axios.get(data.url, { responseType: "arraybuffer", timeout: 120000 });
      const fileName = `./temp.${data.ext || "mp3"}`;
      fs.writeFileSync(fileName, audioRes.data);

      const audioBuffer = fs.readFileSync(fileName);
      await client.sendMessage(
        m.chat,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          fileName: `${safeTitle}.${data.ext || "mp3"}`,
          caption: `🎧 ${safeTitle}\n🤖 ${BOT_NAME}`
        },
        { quoted: m, ...global.channelInfo }
      );

      fs.unlinkSync(fileName);

    } catch (err) {
      console.error("YTAUDIO ERROR:", err.response?.data || err.message);
      await client.reply(
        m.chat,
        "❌ Error al descargar o enviar el audio.",
        m,
        global.channelInfo
      );
    }
  }
};