import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, args }) => {
  if (!text) return m.reply(`🤍 Ingresa un texto. Ejemplo: .pinterest bmw`);

  try {
    if (text.includes("https://")) {
      // Para descargas directas de URLs de Pinterest (manteniendo la funcionalidad original)
      m.react("🕒");
      try {
        const response = await axios.get(`https://api-adonix.ultraplus.click/download/pinterest?apikey=WilkerKeydukz9l6871&url=${encodeURIComponent(text)}`);
        
        if (response.data.status && response.data.result) {
          const result = response.data.result;
          const isVideo = result.type === 'video' || result.url.includes('.mp4');
          
          await conn.sendMessage(
            m.chat,
            { 
              [isVideo ? "video" : "image"]: { url: result.url }, 
              caption: result.title || 'Imagen de Pinterest',
              ...rcanal 
            },
            { quoted: fkontak }
          );
          m.react("☑️");
        } else {
          throw new Error('No se pudo descargar el contenido');
        }
      } catch (error) {
        conn.sendMessage(m.chat, { text: 'Error al descargar el contenido de Pinterest', ...rcanal }, { quoted: m });
      }
    } else {
      // Para búsquedas usando la API
      m.react('🕒');
      
      const apiKey = 'WilkerKeydukz9l6871';
      const apiUrl = `https://api-adonix.ultraplus.click/search/pinterest?apikey=${apiKey}&query=${encodeURIComponent(text)}`;
      
      try {
        const response = await axios.get(apiUrl);
        
        if (!response.data.status || !response.data.result || response.data.result.length === 0) {
          return conn.sendMessage(m.chat, { 
            text: `No se encontraron resultados para "${text}".`, 
            ...rcanal 
          }, { quoted: m });
        }
        
        const results = response.data.result;
        const medias = results.slice(0, 10).map(item => ({
          type: item.type === 'video' ? 'video' : 'image',
          data: { url: item.url }
        }));

        await conn.sendSylphy(
          m.chat,
          medias,
          {
            caption: `◜ Pinterest Search ◞\n\n≡ 🔎 \`Búsqueda :\` "${text}"\n≡ 📄 \`Resultados :\` ${medias.length}\n≡ 🚀 \`API :\` Adonix Ultra`,
            quoted: m,
            ...rcanal
          }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }, ...rcanal });
      } catch (error) {
        console.error('Error de API:', error);
        conn.sendMessage(m.chat, { 
          text: `Error al buscar en Pinterest:\n\n${error.message}`, 
          ...rcanal 
        }, { quoted: m });
      }
    }
  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, { 
      text: 'Error inesperado:\n\n' + e.message, 
      ...rcanal 
    }, { quoted: m });
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ["download"];

export default handler;

// Nota: Este código fue creado por adonix dueño anterior del bot y fue actualizado por WILKER OFC dueño actual del bot