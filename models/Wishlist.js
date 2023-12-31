const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Wishlist extends Model{};

Wishlist.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user_table',
            key: 'id',
        },
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'book',
            key: 'id',
        },
    },
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'wishlist'
});

module.exports = Wishlist;