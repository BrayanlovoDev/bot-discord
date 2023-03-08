const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const db = require('../database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iniciar-sesion')
		.setDescription('Iniciar sesion en la API'),
	async execute(interaction) {
  try {
// get credentials
    const credentials = db.prepare(`
    SELECT email, password FROM users
    WHERE discord_id = ?
    `).get(interaction.user.id);
    //Login in API
    const { data: response } = await axios.post('http://api.cup2022.ir/api/v1/user/login', credentials);

    // guardar token en sqlite
    const token = response.data.token;
    db.prepare(`
    UPDATE users
    set token = ?
    WHERE discord_id = ?
    `).run(token, interaction.user.id);

    //reponse
    await interaction.reply('Iniciaste sesion exitosamente!');
  } catch (error) {
    //ver errores de la api
    console.log(error);
    await interaction.reply('Hubo un error');
  }
}
};