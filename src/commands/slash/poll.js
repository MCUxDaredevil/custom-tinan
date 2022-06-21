const { MessageEmbed, MessageActionRow, MessageButton, Constants, Permissions } = require('discord.js');

module.exports = {
	name: 'poll',
	description: 'Create a poll',
	options: [
		{
			name: 'subject',
			description: 'Subject of the poll',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: 'time',
			description: 'Duration of the poll (in seconds)',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
		},
		{
			name: '1',
			description: 'Choice 1',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '2',
			description: 'Choice 2',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '3',
			description: 'Choice 3',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '4',
			description: 'Choice 4',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '5',
			description: 'Choice 5',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '6',
			description: 'Choice 6',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '7',
			description: 'Choice 7',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '8',
			description: 'Choice 8',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '9',
			description: 'Choice 9',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: '10',
			description: 'Choice 10',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: 'mention',
			description: 'Mention everyone (default: False)',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
		},
	],

	callback: (interaction) => {
		let embed = new MessageEmbed()
			.setTitle(`Poll: ${interaction.options.getString('subject')}`)
			.setDescription(`Poll ends <t:${parseInt(Date.now().toString().substring(0, 10)) + interaction.options.getInteger('time') + 1}:R>`)
			.setColor('BLUE');
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EVENTS)) {
			embed.setAuthor({
				name: interaction.member.displayName,
				iconURL: interaction.member.displayAvatarURL(),
			});
			const getButton = (buttonID) => interaction.options.getString(buttonID);
			const row1 = new MessageActionRow();
			const row2 = new MessageActionRow();
			const pollId = Math.floor(Math.random() * 89999) + 10000;

			for (let i = 1; i < 6; i++) {
				if (getButton(i.toString())) {
					row1.addComponents(
						new MessageButton()
							.setCustomId('poll_' + pollId.toString() + '_' + i.toString())
							.setLabel(getButton(i.toString()))
							.setStyle('SECONDARY')
					);
				}
			}

			for (let i = 6; i < 11; i++) {
				if (getButton(i.toString())) {
					row2.addComponents(
						new MessageButton()
							.setCustomId('poll_' + pollId.toString() + '_' + i.toString())
							.setLabel(getButton(i.toString()))
							.setStyle('SECONDARY')
					);
				}
			}
			const rows = [];
			if (row1.components.length) rows.push(row1);
			if (row2.components.length) rows.push(row2);
			pollsList[pollId] = {};
			global.getLabel = function (pollID, buttonID) {
				if (pollID == pollId) return interaction.options.getString(buttonID);
			};
			let mention = ' ';
			if (interaction.options.getBoolean('mention')) mention = '@everyone';
			interaction.channel.send({ content: mention, embeds: [embed], components: rows }).then((message) => {
				interaction.reply({ content: 'The poll has been created', ephemeral: true });
				const collector = interaction.channel.createMessageComponentCollector({ time: interaction.options.getInteger('time') * 1000 });

				collector.on('end', () => {
					if (pollsList[pollId]) {
						let winners = [];
						let maxLength = 1;
						for (let i = 1; i < 11; i++) {
							const currentLenght = Object.values(pollsList[pollId]).filter((x) => x == 'poll_' + pollId.toString() + '_' + i.toString()).length;
							if (currentLenght >= maxLength) {
								if (currentLenght > maxLength) {
									maxLength = currentLenght;
									winners.pop();
								}
								winners.push(interaction.options.getString(i.toString()));
							}
						}
						embed.setTitle(`Poll ended: ${interaction.options.getString('subject')}`);

						if (winners.length == 1) embed.setDescription(`The winner is **${winners[0]}** with **${maxLength}** votes`);
						else if (winners.length > 1) embed.setDescription(`The winners are **${winners}** with **${maxLength}** votes each`);
						else embed.setDescription(`There was no winner (no votes have been performed)`);
						message.edit({ embeds: [embed], components: [] });
						delete pollsList[pollId];
					}
				});
			});
		} else {
			embed.setTitle(`Error`);
			embed.setDescription(`You don't have sufficient permissions to execute that command`);
			embed.setColor('RED');
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
