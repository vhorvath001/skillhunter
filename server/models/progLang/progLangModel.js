const { DataTypes } = require('sequelize');
const sequelize = require('../../config/initSequelize');

const ProgLangModel = sequelize.define('ProgLang', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sourceFiles: {
        type: DataTypes.STRING,
        allowNull:false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    patterns: {
        type: DataTypes.STRING,
        allowNull: false
    },
    scopePattern: {
        type: DataTypes.STRING,
        allowNull: false
    },
    packageSeparator: {
        type: DataTypes.STRING,
        allowNull: true
    },
    removingTLDPackages: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = ProgLangModel;