import {get} from 'nested-property'
import {NotificationManager} from 'react-notifications'
import {showModal, hideModal, ModalTypes} from '../../../helper/modalManager'
import EmptyNotesLayout from '../layouts/emptyNotes.jsx'
import SearchSortBar from '../../../containers/sidebar/searchSortBar.js'
import FavoritesManager from '../../../helper/favoritesManager'
import Promise from 'bluebird'

export default (sidebarListProps)=>{

    const { setActiveNote, insertNote, deleteNote, moveNote, notebooks, activeNotebookIndex} = sidebarListProps;
    const { notes, activeNoteIndex} = sidebarListProps;
    const activeNote = get(notes, `${activeNoteIndex}`)

    const notebookPath = get(notebooks, `${activeNotebookIndex}.path`);

    let deleteNoteExec=(index, item)=>{

        let noteId = get(notes, `${activeNoteIndex}._id`);
        let fullNotePath =  `${notebookPath}/${noteId}.json`

        return deleteNote(index, fullNotePath)
            .then((result)=>{
                if(result){
                    NotificationManager.warning('You have deleted "'+ item.title +'"', "Click to undo",8000, ()=>{
                        insertNote(notebookPath, item)
                            .then((result)=>{
                                if(result) {
                                    NotificationManager.success("Note restored");
                                    return Promise.resolve(true)
                                }else{
                                    throw new Error()
                                }
                            })
                            .catch((err)=>{
                                NotificationManager.error("Error restoring note")
                                return Promise.resolve(false)
                            })
                    });
                }
            })
            .catch((err)=>{
                NotificationManager.error("Unable to delete note");
            })
    }

    let addNoteExec = ()=>{
        insertNote( notebookPath)
            .then((result)=>{
                result && NotificationManager.success("Note added")
            })
            .catch((err)=>{
                NotificationManager.error("Unable to insert note");
            })
    }

    let handleKeyDown = (e)=> {

        console.log(`notebook path ${notebookPath}`)
        switch (e.key) {
            case "N":
                if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                    addNoteExec();
                }
                break;
            case "D":
                if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                    deleteNoteExec(activeNoteIndex, activeNote )
                }
                break;
            case "ArrowUp":
                if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                    if(activeNoteIndex !== 0){
                        setActiveNote(activeNoteIndex-1)
                    }
                }
                break;
            case "ArrowDown":
                if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
                    if(activeNoteIndex < notes.length-1){
                        setActiveNote(activeNoteIndex+1)
                    }
                }
                break;
            default:
                break;
        }
    }

    return {
        activeIndex:activeNoteIndex,
        title:"Notes",
        list: notes,
        dateField:"lastUpdated",
        itemOnClick:(index)=>{
            setActiveNote(index);
        },
        headerIcons:[
            {
                getName:()=>{return "plus-square-o"},
                exec:addNoteExec,
                toolTip:"add note"
            }

        ],
        icons:[
            {
                getName:()=>{return "trash-o"},
                exec: deleteNoteExec,
                style:{marginTop: -1}
            },
            {
                getName:(item)=>{
                    return `${item && FavoritesManager.isItemTagged(item._id) ? "star":"star-o" }`
                },
                exec: (index, item)=>{
                    if(!FavoritesManager.isItemTagged(item._id)){
                        return FavoritesManager.addTagEntry(item._id, notebookPath)
                            .then((result)=>{
                                result && NotificationManager.success("Note added to favorites")
                                return Promise.resolve(true)
                            }).catch((err)=>{
                                return Promise.resolve(false)
                            })
                    }else{
                        return FavoritesManager.removeTagEntry(item._id)
                            .then((result)=>{
                                result && NotificationManager.success("Note removed from favorites")
                                return Promise.resolve(true)
                            }).catch((err)=>{
                                return Promise.resolve(false)
                            })

                    }
                },
                style:{marginTop: -1}
            },
            {
                getName:()=>{
                    return "pencil-square-o"
                },
                exec: (index, item)=>{
                    showModal(ModalTypes.EDIT_NOTE, (notebookId )=>{
                        moveNote(item, index, get(notebooks, `${activeNotebookIndex}._id`), notebookId)
                            .then((result)=>{
                                result && NotificationManager.success("Note successfully moved")
                            })
                            .catch((err)=>{
                                NotificationManager.error("Unable to move note.")
                            })
                        hideModal();
                    }, {notebooks})
                    return Promise.resolve(true)
                }
            }
        ],
        EmptyLayout:EmptyNotesLayout,
        handleKeyDown:handleKeyDown,
        addBtnTooltip:"new note",
        HeaderWidget:SearchSortBar
    }
}