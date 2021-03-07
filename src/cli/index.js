const { prompt } = require('enquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const clear = require('clear');
const ask = require('./ask')
const fs = require('fs')

clear();

console.log(
    chalk.yellow(
        figlet.textSync('Discord-Logger', { horizontalLayout: 'full' })
    )
);

async function askQuestions() {
    const response = await ask.options();
    const responseJSON = JSON.stringify(response, null, 4);
    fs.writeFileSync('./src/config.json', responseJSON);
    
}

askQuestions();