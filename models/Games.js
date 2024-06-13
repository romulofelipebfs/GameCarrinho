const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const Games = db.define("Games", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    genre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})


module.exports = Games