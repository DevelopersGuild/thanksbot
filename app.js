const Discord = require('discord.js')
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const database = {
    dialect: 'postgres',
    host: `/cloudsql/${process.env.POSTGRES_CONNECTION}`,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME
}

var sequelize = new Sequelize(database.database, database.username, database.password, {
    host:  database.host,
    dialect: 'postgres',
  });


const ThanksDataStore = sequelize.define('thankyounote', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: Sequelize.TEXT,
    mentions: Sequelize.STRING,
    mentionsPictures: Sequelize.STRING,
    authorPicture: Sequelize.TEXT,
    author: Sequelize.TEXT
});

// Run after model declaration code
sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
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
        const userMentions = message.mentions.users.array().map( x => x.id).toString();
        const userMentionsPictures = message.mentions.users.array().map(x => x.avatarURL()).toString();
        console.log(authorAvatar);
        ThanksDataStore.create({
          message: message.cleanContent,
          mentions: userMentions, 
          mentionsPictures: userMentionsPictures , 
          authorPicture: authorAvatar,
          author: message.author.username,
        })
        message.reply(generateReplyString(message.mentions.users.array()))
        ThanksDataStore.findAll().then(function(projects) {
           console.log(projects)
        });
    }
});
  
client.login(process.env.DISCORD_TOKEN);