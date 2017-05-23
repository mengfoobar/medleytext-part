import {get} from 'nested-property'
import {NotificationManager} from 'react-notifications'
import {showModal, hideModal, ModalTypes} from '../../../helper/modalManager'
import Immutable from 'immutable'
import Promise from 'bluebird'

import {getEditorSetting} from '../../../helper/settingsManager'
import {getInstance} from '../../../helper/drive/driveHelper'


import EmptyNotebookLayout from '../layouts/emptyNotebook.jsx'

export default (sidebarListProps)=>{

    const {setActiveNotebook, loadNotesList, setView, insertNotebook, deleteNotebook, editNotebook} = sidebarListProps;
    const {notebooks, notes, activeNotebookIndex} = sidebarListProps;


    return {
        activeIndex:activeNotebookIndex,
        title:"Notebooks",
        list:notebooks,
        dateField:"lastAccessed",
        itemOnClick:(index, item)=>{
            setActiveNotebook(index);
            loadNotesList(get(notebooks, `${index}.path`));
            setView("notes");

            const metaPath = `${getEditorSetting("application.workspace")}/${item._id}/.meta`
            item.lastAccessed = new Date()
            getInstance().writeToFile(item, metaPath)
        },
        headerIcons:[
            {
                getName:()=>{return "plus-square-o"},
                exec:()=>{
                    showModal(ModalTypes.NEW_NOTEBOOK, (notebookName)=>{
                        insertNotebook(notebookName)
                            .then((result)=>{
                                NotificationManager.success("Notebook created")
                            })
                            .catch((err)=>{
                                NotificationManager.error("Unable to create notebook")

                            })
                        hideModal();
                        setView("notes")
                    })
                },
                toolTip:"new notebook"
            }

        ],
        icons:[
            {
                getName:()=>{return "trash-o"},
                exec: (i, item)=>{
                    showModal(ModalTypes.CONFIRM_DELETE_NOTEBOOK, ()=>{
                        deleteNotebook(i, item.path)
                            .then((result)=>{
                                NotificationManager.info("Notebook deleted")
                            })
                            .catch((err)=>{
                                NotificationManager.error("Unable to delete notebook")

                            })
                        hideModal();
                    }, {notebook:item})
                    return Promise.resolve(true)
                },
                style:{marginTop: -1}
            },
            {
                getName:()=>{ return "pencil-square-o"},
                exec: (i, item)=>{
                    showModal(ModalTypes.EDIT_NOTEBOOK, (newNotebookName)=>{
                        let map = Immutable.fromJS(item)
                        const updatedMeta =  map.merge({
                            title:newNotebookName
                        }).toJS()

                        editNotebook(updatedMeta, i)
                            .then((result)=>{
                                NotificationManager.success("Notebook edited")
                            })
                            .catch((err)=>{
                                NotificationManager.error("Unable to update notebook")

                            })
                        hideModal();
                    }, {item})
                    return Promise.resolve(true)
                }
            }
        ],
        EmptyLayout:EmptyNotebookLayout,
        addBtnTooltip:"new notebook"

    }
}