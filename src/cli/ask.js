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
            },
            {
                type: 'confirm',
                name: 'showToken',
                message: 'Do you want to show the token(s)?'
            }
        ];
        return await prompt(questions);
    },
};
