const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Books extends Model{};

Books.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    book_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    book_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publish_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authors: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    page_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mature: {
        type: DataTypes.BOOLEAN,
    },
    icon: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    total_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    average_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
        },
    },
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'book',
});

module.exports = Books;