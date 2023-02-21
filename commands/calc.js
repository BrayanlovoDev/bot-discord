const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calc')
		.setDescription('Suma, Resta, Divide o Multiplica dos numeros')
        .addStringOption(option => 
          option.setName('operacion')
          .setDescription('La operacion a realizar')
            .setRequired(true) ),
	async execute(interaction) {
        const operacion =interaction.options.getString('operacion');
        if (operacion.icludes('+')) {
            await interaction.reply('mas');
        }else if (operacion.includes('-')) {
            await interaction.reply('menos');
        }
		
	},
};