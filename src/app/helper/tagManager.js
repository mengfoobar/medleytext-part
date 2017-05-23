import {getEditorSetting} from './settingsManager'
import {getInstance} from './drive/driveHelper'
import Promise from 'bluebird'
import Immutable from 'immutable'

export class TagManager {

    constructor(){
        //TODO: move this into a constant

        this.filePath = `${getEditorSetting("application.workspace")}/.tags.json`
        this.defaultTag = "";
        this.tagsJson = null;

        this.initialize = this.initialize.bind(this)
        this.removeTagEntry = this.removeTagEntry.bind(this);
        this.addTagEntry = this.addTagEntry.bind(this);
        this.getTagEntries = this.getTagEntries.bind(this);
        this.isItemTagged = this.isItemTagged.bind(this);
    }

    initialize(){
        console.log("initializing favorites manager")
        let self = this;
        return getInstance().getFile(this.filePath)
            .then((result)=>{
                if(result){
                    self.tagsJson = result;
                    return Promise.resolve(result)

                }else{
                    self.tagsJson = {};
                    return getInstance().writeToFile({},this.filePath)
                }
            })
            .catch((err)=>{
                return Promise.reject(err)
            })
    }

    getNotes(tag=this.defaultTag){

        let {tagsJson} = this;
        let updatedMetas = [];
        let promiseArr=[]

        for (let meta of tagsJson[tag]) {
            let filePath = `${meta.folderPath}/${meta._id}.json`
            promiseArr.push(getInstance().getFile(filePath)
                .then((note)=>{
                    if(note){
                        note.folderPath = meta.folderPath;
                        updatedMetas.push(meta)
                        return Promise.resolve(note)
                    }else{
                        return Promise.resolve(null)
                    }

                }).catch((err)=>{
                    return Promise.resolve(null)
                }))
        }

        return Promise.all(promiseArr)
            .then((results)=>{
                if(results){
                    const tagsJsonMap = Immutable.Map(tagsJson);
                    const updatedTagMetas = tagsJsonMap.set(tag, updatedMetas).toJS();
                    tagsJson = updatedTagMetas;

                    return Promise.resolve(results)
                }else{
                    throw new Error("Unable to retrieve notes from file")
                }
           })
            .catch((err)=>{
                return Promise.reject(err);
            })
    }

    removeTagEntry(id, tag=this.defaultTag){
        //remove entry in cache and save into file
        //TODO: for tags, handle scenario when tag has no entries left after removal->remove tag as well
        const self=this;
        const tagEntriesList = Immutable.List(this.tagsJson[tag]);

        const metaIndex = tagEntriesList.findIndex((m)=>{
            return m._id ===id;
        })

        const updatedTagEntriesList = tagEntriesList.splice(metaIndex, 1);

        const updatedTagsJson = Immutable.Map(this.tagsJson[tag]).set(tag, updatedTagEntriesList).toJS();

        return getInstance().writeToFile(updatedTagsJson, this.filePath)
            .then((result)=>{
                if(result){
                    self.tagsJson = updatedTagsJson
                    return Promise.resolve(true)
                }else{
                    throw new Error("unable tp update tags file")
                }
            })
            .catch((err)=>{
                return Promise.reject(err);
            })
    }

    addTagEntry(id, folderPath,tag=this.defaultTag){
        //add tag to cache and save into file
        const self=this;
        const metaEntry = {_id:id, folderPath:folderPath};
        const tagEntry = {};
        tagEntry[tag]=[];

        const tagMap = Immutable.Map(tagEntry).merge(this.tagsJson)
        const tagEntriesList = Immutable.List(tagMap.get(tag));
        const updatedTagEntriesList = tagEntriesList.push(metaEntry);

        const updatedTagsJson = tagMap.set(tag, updatedTagEntriesList).toJS();

        return getInstance().writeToFile(updatedTagsJson, this.filePath)
            .then((result)=>{
                if(result){
                    self.tagsJson = updatedTagsJson
                    return Promise.resolve(true)
                }else{
                    throw new Error("unable tp update tags file")
                }
            })
            .catch((err)=>{
                return Promise.reject(err);
            })

    }


    getTagEntries(tag=this.defaultTag){
        return this.tagsJson[tag]
    }

    isItemTagged(id, tag=this.defaultTag){
        if(!this.tagsJson[tag]){
            return null;
        }
        return this.tagsJson[tag].find((meta)=>{
            return meta._id === id
        })
    }
}

const TagManagerInstance = new TagManager();

export default TagManagerInstance;