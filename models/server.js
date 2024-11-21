express = require('express');
const logger = require('morgan');
const sequelize= require('./database/database.js');


const cors = require('cors');
const User = require('./database/Users.js');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.Server = require('http').createServer(this.app);

        this.paths = {

        };
        this.middlewares();
        this.dBConnection();
    }
    async dBConnection(){
        try {
            await sequelize.authenticate();
            console.log('Database online');

            const models = [User];

            for (const model of models) {
                await model.sync({ force: false });
                console.log(model.name, 'table created');
            }
            
            console.log('Database sync');
        } catch (error) {
            console.log('Error de conexión en BDD: ', error);
            throw new Error(error);
        }
    }

    middlewares(){
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){

    }

    listen(){
        this.Server.listen(this.port, ()=> {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }

}

module.exports = Server;