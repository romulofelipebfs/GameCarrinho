const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('games', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
})

try {
    sequelize.authenticate()
    console.log('Conexão bem feita')
} catch (error) {
    console.log('erro no banco')
}

module.exports = sequelize