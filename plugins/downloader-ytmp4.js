
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`Uso correcto: ${usedPrefix + command} <enlace o nombre>`)
  }

  try {
    await m.react('🕓')

    let url = args[0]
    let videoInfo = null

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      let search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) {
        await conn.sendMessage(m.chat, { text: 'No se encontraron resultados.' }, { quoted: m })
        return
      }
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      let id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      let search = await yts({ videoId: id })
      if (search && search.title) videoInfo = search
    }

    if (videoInfo.seconds > 3780) {
      await conn.sendMessage(m.chat, { text: 'El video supera el límite de duración permitido (63 minutos).' }, { quoted: m })
      return
    }

    // Usando la nueva API con parámetro url
    let apiUrl = `https://api-adonix.ultraplus.click/download/ytaudio?apikey=Mikeywilker1&url=${encodeURIComponent(url)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    let json = await res.json()
    
    // Verificar estructura de respuesta
    if (json.status !== 'success') {
      throw new Error('No se pudo obtener información del video.')
    }

    // Extraer datos según la estructura esperada de la nueva API
    let title = json.data?.title || videoInfo?.title || 'Audio sin título'
    let download = json.data?.audio
    let quality = json.data?.quality || 'Desconocida'
    let duration = videoInfo?.timestamp || 'Desconocida'
    let thumbnail = json.data?.thumbnail || videoInfo?.thumbnail || null

    if (!download) {
      throw new Error('No se pudo obtener el enlace de descarga del audio.')
    }

    await conn.sendMessage(m.chat, {
      text: `🎵 *${title}*\n📀 Duración: *${duration}*\n🎚 Calidad: *${quality}*`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "Descargando audio...",
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: download },
      mimetype: 'audio/mpeg',
      fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
      ptt: false
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error('Error en playaudio:', e)
    await m.react('❌')
    await conn.sendMessage(m.chat, { 
      text: `Ocurrió un error al procesar la solicitud:\n${e.message || 'Error desconocido'}` 
    }, { quoted: m })
  }
}

handler.help = ['playaudio']
handler.tags = ['downloader']
handler.command = ['playaudio']

export default handler