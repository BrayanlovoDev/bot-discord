const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Listo! Guardados los cambios lemonade ${client.user.tag}`);
	},
};