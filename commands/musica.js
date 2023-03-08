const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios').default;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('canciones')
		.setDescription('Busca una Cancion!')
    .addStringOption(option => 
      option.setName('cancion')
      .setDescription('Cancion a busacar')
        .setRequired(true) ),
	async execute(interaction) {

		const music = interaction.options.getString('cancion');

		try {
			

			const apiShaz = await axios.get(`https://shazam.p.rapidapi.com/search',
			params: {term: ${music}, locale: 'en-US', offset: '0', limit: '5'`)
		console.log(apiShaz),{
			headers: {
				'X-RapidAPI-Key': '12215e2d64msh70dfd6ca49702ebp1af111jsn8f8e2e9ea43d',
				'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
			}};

			
		} catch (error) {
			await interaction.reply('Hubo un error');
			console.log(error);
		}

		await interaction.reply('Tu cancion es!');
	},
};