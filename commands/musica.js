const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('musica')
		.setDescription('Busca una Cancion!')
    .addStringOption(option => 
      option.setName('cancion')
      .setDescription('Cancion a busacar')
        .setRequired(true) ),
	async execute(interaction) {
		await interaction.reply('Tu cancion es!');
	},
};