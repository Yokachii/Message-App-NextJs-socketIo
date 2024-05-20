import { Sequelize } from 'sequelize';
const db = {};

// const sequelize = new Sequelize('yokachi04_tempp', 'yokachi04', 'Elliot2862', {
//     dialect: 'mysql',
//     host: 'mysql-yokachi04.alwaysdata.net',
//     dialectModule: require('mysql2'),
// });
const sequelize = new Sequelize(process.env.MYNAME, process.env.NAMES, process.env.PASSWORD, {
    dialect: 'mysql',
    host: 'mysql-yokachi04.alwaysdata.net',
    dialectModule: require('mysql2'),
});

export default sequelize