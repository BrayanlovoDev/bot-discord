const { default: axios } = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const db = require('../database');

// at the top of your file
const { EmbedBuilder } = require('discord.js');

const createEmbed = async (team, grupo) => {
  //color de banderAS
     
  
  // inside a command, event listener, etc. creacion
  const exampleEmbed = new EmbedBuilder()
    .setColor('Aqua')
    .setTitle(team.data[0].name_en)
    .setURL(`https://www.google.com/search?q=${team.data[0].name_en}+mundial&rlz=1C1VDKB_esVE1007VE1007&oq=${team.data[0].name_en}+mundial&aqs=chrome..69i57j0i20i263i512l2j0i512l3j69i60l2.4376j0j7&sourceid=chrome&ie=UTF-8`)
    .setDescription(`Codigo Fifa: ${team.data[0].fifa_code}`)
    .setThumbnail(`${team.data[0].flag}`)
    .addFields(
      { name: 'Grupo', value: `${team.data[0].groups}` , },
      { name: '1 Lugar', value: `${grupo.data[0].teams[3].name_en}` , },
      { name: 'Puntos', value:  `${grupo.data[0].teams[3].pts}` , inline: true },
      { name: 'Ganados', value:  `${grupo.data[0].teams[3].w}` , inline: true },
      { name: 'Perdidos', value:  `${grupo.data[0].teams[3].l}` , inline: true },
      { name: 'Empate', value:  `${grupo.data[0].teams[3].d}` , inline: true },
    
      { name: '2 Lugar', value: `${grupo.data[0].teams[2].name_en}` , },
      { name: 'Puntos', value:  `${grupo.data[0].teams[2].pts}` , inline: true },
      { name: 'Ganados', value:  `${grupo.data[0].teams[2].w}` , inline: true },
      { name: 'Perdidos', value:  `${grupo.data[0].teams[2].l}` , inline: true },
      { name: 'Empate', value:  `${grupo.data[0].teams[2].d}` , inline: true },
      
      { name: '3 Lugar', value: `${grupo.data[0].teams[1].name_en}` , },
      { name: 'Puntos', value:  `${grupo.data[0].teams[1].pts}` , inline: true },
      { name: 'Ganados', value:  `${grupo.data[0].teams[1].w}` , inline: true },
      { name: 'Perdidos', value:  `${grupo.data[0].teams[1].l}` , inline: true },
      { name: 'Empate', value:  `${grupo.data[0].teams[1].d}` , inline: true },

      { name: '4 Lugar', value: `${grupo.data[0].teams[0].name_en}` , },
      { name: 'Puntos', value:  `${grupo.data[0].teams[0].pts}` , inline: true },
      { name: 'Ganados', value:  `${grupo.data[0].teams[0].w}` , inline: true },
      { name: 'Perdidos', value:  `${grupo.data[0].teams[0].l}` , inline: true },
      { name: 'Empate', value:  `${grupo.data[0].teams[0].d}` , inline: true },
    )
    .setImage()
    .setTimestamp()
          return(exampleEmbed);
  };




module.exports = {
	data: new SlashCommandBuilder()
		.setName('buscar-equipo')
		.setDescription('Muestra informacion del equipo en el mundial')
    .addStringOption(option => 
      option.setName('equipo')
      .setDescription('Nombre del equipo')
        .setRequired(true)),
	async execute(interaction) {
  try {
    
    const team = interaction.options.getString('equipo');
    
    
    
    const { token } = db.prepare(`
    SELECT token FROM users
    WHERE discord_id = ?
    `).get(interaction.user.id);
    
    console.log(token);
    

   const { data: response } = await axios.get(`http://api.cup2022.ir/api/v1/team/${team}`, {
    headers: { 'Authorization' : `Bearer ${token}` }
   });

   const grupo = response.data[0].groups;
   //const equipoDos = response.data.find(equipo => equipo.name_en === team);
    const { data: posicion } = await axios.get(`http://api.cup2022.ir/api/v1/standings/${grupo}`,  {
    headers: { 'Authorization': `Bearer ${token}` }
   });

    const prtDia = response.data[0].id;
    const { data: primerosPart } = await axios.get(`http://api.cup2022.ir/api/v1/match/${prtDia}`,  {
    headers: { 'Authorization': `Bearer ${token}` }
   });
   
   console.log(posicion.data[0]);
   console.log(response.data[0]);
   //console.log(primerosPart.data[0]);

    
   const embed = await createEmbed(response, posicion);
					await interaction.reply({ embeds: [embed]});
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