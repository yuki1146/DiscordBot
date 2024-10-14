const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rockpaperscissors')
        .setDescription('じゃんけんをします')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('rock, paper, or scissorsを選択してください')
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply(); // 応答をデファー

        const playerChoice = interaction.options.getString('choice');
        const botChoice = getRandomChoice();
        const result = determineWinner(playerChoice, botChoice);

        try {
            // デファーした応答を編集して結果を送信
            await interaction.editReply(`あなたの選択: ${playerChoice}\nボットの選択: ${botChoice}\n結果: ${result}`);
        } catch (error) {
            console.error(error);
            // エラーが発生した場合でも必ず応答を返す
            await interaction.followUp('コマンドの実行中にエラーが発生しました。');
        }
    },
};

// ランダムな選択を生成する関数
function getRandomChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// 勝者を決定する関数
function determineWinner(player, bot) {
    if (player === bot) return '引き分けです！';
    if (
        (player === 'rock' && bot === 'scissors') ||
        (player === 'paper' && bot === 'rock') ||
        (player === 'scissors' && bot === 'paper')
    ) {
        return 'あなたの勝ちです！';
    }
    return 'ボットの勝ちです！';
}
