// ping de Gohan beast 
export default {
  name: 'gohan',
  alias: ['gohan2', 'test', 'latencia'],
  description: 'Ver estado del bot Gohan Beast',
  category: 'General',

  async run(m, { conn }) {
    const start = Date.now()
    await m.reply('⚡ *Calculando poder Saiyan...*')
    const latency = Date.now() - start

    await m.reply(`🐉 *GOHAN BEAST - STATUS* ⚡

🏓 *PING:* ${latency}ms
🌀 *Poder:* MAXIMUM
⚡ *Transformación:* Beast Mode
💪 *Estado:* ¡Listo para la batalla!

🔱 *By Wilker | Dragon Ball Z*`)
  }
}