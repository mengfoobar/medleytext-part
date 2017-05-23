const Promise = require('bluebird');

module.exports={
    initialize:function(){
        return new Promise(function(resolve, reject){

        })
    },
    insertNote:function(){
        return new Promise(function(resolve, reject){
            resolve(true);
        })
    },
    updateNote:function(note){
        return new Promise(function(resolve, reject){
            resolve(true)
        })
    },
    deleteNote:function(id){
        return new Promise(function(resolve, reject){
            resolve(true);
        })
    },
    getNote:function(id){
        return new Promise(function(resolve, reject){
            resolve(true);
        })
    },
    getAllNotes:function(){
    }
}