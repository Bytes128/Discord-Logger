const { prompt } = require('enquirer');

module.exports = {
    options: async () => {
        const questions = [
            {
                type: 'input',
                name: 'webhook',
                message: 'Enter your webhook url',
            },
            {
                type: 'confirm',
                name: 'showFriends',
                message: 'Do you want to show friends?'
            }
        ];
        return await prompt(questions);
    },
};