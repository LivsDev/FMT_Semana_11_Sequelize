const { DataTypes } = require('sequelize')
const {connection} = require ('../database/connection')
 
const Professor = connection.define('professores',  { 
   
    nome_professor: {
        type:DataTypes.STRING
        },
    
    curso: {
        type:DataTypes.STRING
    }
       
})

module.exports = Curso