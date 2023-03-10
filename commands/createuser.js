const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const db = require('../database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crearusuario')
		.setDescription('crear un usuario en la base de datos')
    .addStringOption(option => 
      option.setName('nombre')
      .setDescription('Tu primer nombre y primer apellido')
        .setRequired(true) )
        .addStringOption(option => 
      option.setName('contrasena')
        .setDescription('Tu contrasena')
        .setRequired(true) )
        .addStringOption(option => 
       option.setName('email')
        .setDescription('Tu correo electronico')
        .setRequired(true) ).addStringOption(option => 
       option.setName('pais')
         .setDescription('Tu pais de residencia')
         .setRequired(true) ),
	async execute(interaction) {
  try {
    const name = interaction.options.getString('nombre');
    const password = interaction.options.getString('contrasena');
    const email = interaction.options.getString('email');
    const country = interaction.options.getString('pais');
    console.log(name, password, email, country);
 
    const newUser = {
      name,
      email,
      password,
      passwordConfirm: password,
    };

    await axios.post('http://api.cup2022.ir/api/v1/user', newUser);

    db.prepare(`
    INSERT INTO users (discord_id, name, password, email, country)
    VALUES (?, ?, ?, ?, ?)
    `).run(interaction.user.id, name, password, email, country);
    await interaction.reply('Registrado exitosamente!');
  } catch (error) {
    //ver errores de la api
    console.log(error.response?.data?.message);
    //ver otros errores
    console.log(error.message);
    if (error.message === 'UNIQUE constraint failed: users.discord_id') {
      return await interaction.reply('Tu usuario ya se encuentra registrado.');
    }if (error.response?.data?.message) {
      return await interaction.reply('Tu contrasena es menor a 8 digitos');
    }else if (error.message === 'UNIQUE constraint failed:users.email') {
     return await interaction.reply('Tu correo ya esta registrado');
    }

    await interaction.reply('Hubo un error');
  }
	},
};