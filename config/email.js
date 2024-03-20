// importar las variables .env
require('dotenv').config({ path: 'variables.env' });

module.exports = {
	user: process.env.EMAIL_USER , 
	pass: process.env.EMAIL_PASS ,
	host: process.env.EMAIL_HOST ,
	port: process.env.EMAIL_PORT
} 