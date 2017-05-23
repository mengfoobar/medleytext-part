var fs = require('fs-extra')
const Promise = require('bluebird');
const path = require('path');
const Immutable = require('immutable');
var walk =require('walk');



let workspaceDirectory;

module.exports={
    getNotebooks:function(workSpacePath){
        var self=this;
        return new Promise(function(resolve, reject){
            var notebooks =[]

            var walker = walk.walk(workSpacePath);
            walker.on("file", function (root, fileStats, next) {

                if(root!==workSpacePath && fileStats.name===".meta"){
                    self.getFile(path.join(root, fileStats.name))
                        .then(function(metaData){
                            let notebook = metaData;
                            notebook.path = root;
                            notebooks.push(notebook)
                            next();
                        })
                        .catch(function(err){
                            next();
                        })
                }else{
                    next();
                }

            });

            walker.on("errors", function (root, nodeStatsArray, next) {
                next();
            });

            walker.on("end", function () {
                resolve(notebooks)
            });
        })
    },
    getNotesInPath:function(folderPath){
        return fs.readdir(folderPath)
            .then(function(result){
                if(!result){
                    return Promise.resolve([])
                }

                const immutableList = Immutable.fromJS(result);
                const filteredArray = immutableList.filter(s=>s.includes(".json"))

                var fileNames=filteredArray.toJS();

                return Promise.map(fileNames, function (fileName) {
                    const fullFilePath=folderPath +'/'+ fileName;
                    if(path.extname(fullFilePath)==='.json'){
                        return fs.readJson(fullFilePath);
                    }
                })
            })
            .then(function(notes){
                return Promise.resolve(notes || []);
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    writeJson:function(json, filePath){
        var fullFilePath = filePath || path.join(workspaceDirectory, json._id+".json")
        return fs.ensureFile(fullFilePath)
            .then(function(){
                return fs.writeJson(fullFilePath, json)
            })
            .then(function(err){
                if(!err){
                    return fs.readJson(fullFilePath);
                }else{
                    throw new Error("Unable to write to file.")
                }

            })
            .then(function(result){
                if(result){
                    return Promise.resolve(result);
                }else{
                    throw new Error("Unable to read file of created ntoe")
                }
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    removeFile:function(filePath){
        return fs.remove(filePath)
            .then(function(err){
                if(err) {
                    throw new Error(err)
                }
                return Promise.resolve(true)
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    getFile:function(filePath){
        return fs.readJson(filePath)
            .then(function(result){
                if(!result){
                    throw new Error("No data read from file")
                }else{
                    return Promise.resolve(result)
                }
            })
            .catch(function(err){
                return Promise.resolve(false)
            })
    },
    moveFile:function(pathFrom, pathTo){
        return fs.move(pathFrom, pathTo)
            .then(function(result){
                return Promise.resolve(true)
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    createDirectory:function(path){
        return fs.ensureDir(path)
            .then(function(err){
                return Promise.resolve(true)
            })
            .catch(function(err){
                return Promise.reject()
            })

    },
    removeDirectory: function(path){
        return fs.remove(path)
            .then(function(result){
                return Promise.resolve(true)
            })
            .catch(function(err){
                return Promise.reject()
            })

    }
}
