const Discord = require('discord.js')
const dotenv = require('dotenv');
const Firestore = require('@google-cloud/firestore');
const { v4: uuidv4 } = require('uuid');
dotenv.config();


const db = new Firestore({
    projectId: process.env.CLOUD_PROJECT_ID,
    keyFilename: './winter-runway-279100-3998bbcc8fa0.json',
});

const client = new Discord.Client()

const THANKS_URL = "https://www.da-developers.dev/thanks"

const collectionOfSecondaryMessages = [
    `In the future they should be able to see your thanks at ${THANKS_URL} Awesome!`,
    `They'll soon be able to see your gratitude at ${THANKS_URL}`,
    `Dope! some day they'll be able to see your message at ${THANKS_URL}`,
    `Lit they should soon be able to see it at ${THANKS_URL}`
]

const getRandomString = () => collectionOfSecondaryMessages[Math.floor(Math.random() * collectionOfSecondaryMessages.length)];


const hasSymbols = (txt) => txt.includes("#thanks") && txt.includes("@");
const generateReplyString = (users) => `
 we got your thanks for ${users}. ${getRandomString()}
`

client.on('message', message => {
    if(hasSymbols(message.content)) {
        const authorAvatar = message.author.avatarURL();
        const userMentions = message.mentions.users.array().map( x => x.id);
        const userMentionsPictures = message.mentions.users.array().map(x => x.avatarURL());
        let docRef = db.collection('thankyounotes').doc(`${uuidv4()}`);
        docRef.set({
            message: message.cleanContent,
            mentions: userMentions, 
            mentionsPictures: userMentionsPictures , 
            authorPicture: authorAvatar,
            author: message.author.username,
        });
        message.reply(generateReplyString(message.mentions.users.array()))
    }
});
  
client.login(process.env.DISCORD_TOKEN);