import getNotesConfig from './notes'
import FavoritesManager from '../../../helper/favoritesManager'
import {NotificationManager} from 'react-notifications'
import EmptyFavoritesLayout from '../layouts/emptyFavorites.jsx'


export default (props)=>{

    const {setActiveNote, setActiveFolderPath, deleteNote} = props;

    //TODO: load notes from file
    let notesConfig = getNotesConfig(props);
    notesConfig.title="Favorites"
    notesConfig.icons=[
        {
            getName:()=>{
                return 'minus-square-o'
            },
            exec: (index, item)=>{
                return FavoritesManager.removeTagEntry(item._id)
                    .then((result)=>{
                        deleteNote(index);
                        result && NotificationManager.success("Note removed from favorites")
                        return Promise.resolve(true)
                    })
                    .catch((err)=>{
                        return Promise.resolve(false)
                    })

            },
            style:{marginTop: -1}
        },
    ];
    notesConfig.itemOnClick=(i, item)=>{
        setActiveNote(i);
        setActiveFolderPath(item.folderPath) //field only exists for favorites
    }

    notesConfig.headerIcons=null
    notesConfig.EmptyLayout = EmptyFavoritesLayout;


    return notesConfig;

}