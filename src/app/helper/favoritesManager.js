import {TagManager} from './tagManager'
import {getEditorSetting} from './settingsManager'
import {getInstance} from './drive/driveHelper'
import Promise from 'bluebird'



class FavoriteManager extends TagManager{
    constructor(){
        super();
        this.filePath = `${getEditorSetting("application.workspace")}/.favorites.json`
        this.defaultTag = 'favorites'
    }

    initialize(){
        let self = this;
        return getInstance().getFile(this.filePath)
            .then((result)=>{
                console.log(`result of getting file ${result}`)
                if(result){
                    self.tagsJson = result;
                    return Promise.resolve(true)
                }else{
                    self.tagsJson = {"favorites":[]};
                    return getInstance().writeToFile(self.tagsJson, self.filePath)
                }
            })
            .then((result)=>{
                if(result){
                    console.log(`results of writing to favorites ${result}`)
                    return Promise.resolve(self.tagsJson)
                }else{
                    throw new Error("Unable initialize favorites")
                }
            })
            .catch((err)=>{
                return Promise.reject(err)
            })
    }
}

const FavoriteManagerInstance =  new FavoriteManager();

export default FavoriteManagerInstance;