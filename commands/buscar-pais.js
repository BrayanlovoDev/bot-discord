const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios').default;
const db = require('../database');

const createEmbed = async (country, weather) => {
//color de banderAS
   

// inside a command, event listener, etc. creacion
const exampleEmbed = new EmbedBuilder()
	.setColor('Aqua')
	.setTitle(country.name.common)
	.setURL(`https://en.wikipedia.org/wiki/${country.name.common}`)
	.setDescription(`https://www.google.com/maps/place/${country.name.common}`)
	.setThumbnail(`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`)
	.addFields(
		{ name: 'Capital', value: country.capital[0], inline: true },
		{ name: 'Region', value: country.region, inline: true },
		{ name: 'Poblacion', value:  `${country.population} Habitantes` , inline: true },
		{ name: 'Temperatura', value:  `${weather.main.temp} C` , inline: true },
		{ name: 'Clima', value:  `${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1) }` , inline: true },
	)
	.setImage(country.flags.png)
	.setTimestamp()
        return(exampleEmbed);
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('buscar-pais')
		.setDescription('Muestra informacion del pais suministrado')
        .addStringOption(option => 
            option.setName('pais')
            .setDescription('Nombre del Pais')),
	async execute(interaction) {
        const country = interaction.options.getString('pais');
        const discordId = interaction.user.id;
        try {
					if (country) {
						//api de pais
            const { data: [countryApi] } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
            console.log(countryApi);
			//latitud y longitud de paises
			const [lat, lon] = countryApi.latlng;
			//api de clima
			const { data: weatherApi} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a0165498b52a9e7617a229a5927dc7c1&units=metric&lang=es`);
			console.log(weatherApi);
			


            const embed = await createEmbed(countryApi, weatherApi);
            await interaction.reply({ embeds: [embed]});
            
					}
					
  
					const {country: countryDB} = db.prepare(`
					DELETE FROM users
					WHERE discord_id = ?`).run(discordId);

					//api de pais
					const { data: [countryApi] } = await axios.get(`https://restcountries.com/v3.1/name/${countryDB}`);
					console.log(countryApi);
		//latitud y longitud de paises
		const [lat, lon] = countryApi.latlng;
		//api de clima
		const { data: weatherApi} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a0165498b52a9e7617a229a5927dc7c1&units=metric&lang=es`);
		console.log(weatherApi);
		


					const embed = await createEmbed(countryApi, weatherApi);
					await interaction.reply({ embeds: [embed]});

        } catch (error) {
        console.log(error);    
        await interaction.reply('El pais no existe intenta con otro');       
				//api de pais
				const { data: [countryApi] } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
				console.log(countryApi);
	//latitud y longitud de paises
	const [lat, lon] = countryApi.latlng;
	//api de clima
	const { data: weatherApi} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a0165498b52a9e7617a229a5927dc7c1&units=metric&lang=es`);
	console.log(weatherApi);
	


				const embed = await createEmbed(countryApi, weatherApi);
				await interaction.reply({ embeds: [embed]}); 
        }
        
	},
};