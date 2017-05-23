import React from 'react'
import {getTheme} from '../../helper/themeHelper'
import ListItem from './listItem.jsx'

import Loading from './layouts/loading.jsx'

import {Grid, Row, Col, OverlayTrigger, Tooltip} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import style from './styles/sidebarWrapper.css'

import NP from 'nested-property'

import getNotebooksConfig from './configs/notebooks'
import getNotesConfig from './configs/notes'
import getFavoritesConfig from './configs/favorites'

import FavoritesManager from '../../helper/favoritesManager'
import {getInitialStartupArray} from '../../helper/notesHelper'
import Promise from 'bluebird'



export default class SidebarList extends React.Component {

    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state={
            hoverIndex:-1
        }

    }

    componentDidMount(){


        const {loadNotebooksList, loadNotesList, insertNotebook, insertNote, notebooks} = this.props;
        FavoritesManager.initialize()
            .then((result)=>{
                if(result){
                    return loadNotebooksList()
                }else{
                    throw new Error("unable to initialize favorites")
                }
            })
            .then((result)=>{
                if(!result || result.length===0){
                    return insertNotebook("Getting Started")
                        .then((result)=>{
                            const notes = getInitialStartupArray();
                            if(result){

                                const promiseArr = notes.map((note)=>{
                                    return insertNote(result.path, note)
                                })

                                return Promise.all(promiseArr)
                            }
                        }).then((results)=>{
                            if(results){
                                return loadNotebooksList()
                            }
                        })
                }else{
                    return loadNotebooksList()
                }

            })
            .then((result)=>{
                let path = NP.get(result, '0.path')
                if(result && path){
                    return loadNotesList(path)
                }else{
                    throw new Error("unable to retrieve notebooks")
                }
            })
            .then((result)=>{
                if(!result){
                    throw new Error("Was unable to find any notes in path.")
                }
            })
            .catch(function(err){
                console.log(err)
            })
    }

    componentWillReceiveProps(nextProps){

        const { loadNotesList, notebooks, activeNotebookIndex, activeFolderPath, setActiveNote, loadFavoriteNotes, setActiveFolderPath} = nextProps;


        switch(nextProps.view){
            case "notebooks":
                const curNotebook = NP.get(this.props.notebooks, `${activeNotebookIndex}`)
                const newNotebook = NP.get(notebooks, `${activeNotebookIndex}`);

                if(!curNotebook || !newNotebook){
                    return;
                }

                //handling scenario for notebook being deleted
                if(notebooks.length !== this.props.notebooks.length && newNotebook._id !== curNotebook._id){
                    let path = NP.get(newNotebook, `path`)
                    if(path){
                        loadNotesList(NP.get(newNotebook, `path`))
                            .then((result)=>{
                                result && setActiveNote(0)
                            })
                    }

                }
                break;
            case "notes":
                const activeNotebookPath = NP.get(notebooks, `${activeNotebookIndex}.path`)
                if(activeFolderPath !== activeNotebookPath || this.props.view==='favorites'){ //handling scenario switching from favorites/tags to notebook
                    if(activeNotebookPath){
                        setActiveFolderPath(activeNotebookPath);
                        loadNotesList(activeNotebookPath)
                            .then((result)=>{
                                result && setActiveNote(0)
                            })
                    }

                }
                break;
            case "favorites":
                if(this.props.view !=="favorites"){
                    loadFavoriteNotes()
                        .then(()=>{
                            console.log("successfully loaded favorites")
                        })
                        .catch((err)=>{
                            console.log(err)
                        })

                }
                break;
        }


    }

    handleKeyDown(e){}

    render() {

        const {view, loading} = this.props;
        const theme = getTheme();

        let config={}

        switch(view){
            case "notes":
                config = getNotesConfig(this.props)
                break;
            case "notebooks":
                config = getNotebooksConfig(this.props)
                break;
            case "favorites":
                config = getFavoritesConfig(this.props);
                break;
        }

        const {title, activeIndex, icons, list, itemOnClick, EmptyLayout, handleKeyDown, headerIcons, HeaderWidget, dateField} = config;

        //updating event listener for handleKeyDown function
        window.removeEventListener("keydown", this.handleKeyDown);
        this.handleKeyDown = handleKeyDown;
        window.addEventListener("keydown", this.handleKeyDown);


        let content;
        if(loading){
            content= (<Loading />)
        }
        else if(!list || list.length<=0){
            content= (<EmptyLayout/>)
        }else{

            content = (
                <ul ref="list" >
                {list.map((item, i)=>{
                    return (<li  ref={`${view}_${i}`} onClick={() => itemOnClick(i, item)} onMouseEnter={()=>{this.setState({hoverIndex:i})}} onMouseLeave={()=>{this.setState({hoverIndex:-1})}}>
                        <ListItem key={`${view}_${i}`} item={item} index={i} activeIndex={activeIndex||0}
                                  view={view}
                                  icons={icons}
                                  date={item[dateField]}
                                  preview={ getPreviewFromBody(NP.get(item, `body`))}/>
                        <div className={`${style.noteItem_divider} ${theme.sidebarList_item_divider}
                                    ${i === list.length-1 || i===activeIndex || i === this.state.hoverIndex  || i === this.state.hoverIndex -1 ? style.noteItem_divider_hidden:""}`} />

                    </li>)
                })}
            </ul>)
        }

        return (
                <Grid className={`${style.sidebarList} ${theme.sidebarList}`} >
                    <Row className={style.row}>
                        <Col xs={8}>
                            <span className={`${style.title} ${theme.sidebarList_title}`}>
                                {title}
                            </span>
                        </Col>

                        {
                            headerIcons?(
                                <Col xs={4}>
                                    {
                                        headerIcons.map((icon)=>{

                                            return (<OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">{icon.toolTip}</Tooltip>} delayShow={700} >
                                                <FontAwesome className={`${style.icon} ${theme.sidebarList_icon}`} name={icon.getName()}
                                                             onClick={()=>{icon.exec()}}/>
                                            </OverlayTrigger>)

                                        })
                                    }
                                </Col>):null
                        }


                    </Row>
                    {HeaderWidget ? (<Row className={style.row}><HeaderWidget/></Row>):null}
                    <Row className={style.row}>
                        <div className={`${style.divider}  ${theme.sidebarList_divider}`}/>
                    </Row>

                    <Row className={`${style.listContainer} ${theme.sidebarList_container} ${style.row}`}>
                        {content}
                    </Row>
                </Grid>
        )
    }
}



const getPreviewFromBody = (draftJsRawBody) => {


    if(draftJsRawBody===null || draftJsRawBody===undefined) return null;

    const {blocks} = draftJsRawBody;
    let str = "";

    for(let i = 1; i< blocks.length; i++){
        str+=draftJsRawBody.blocks[i].text +" ";
        if(str.length >= 50){
            return str;
        }
    }

    return str+" ";
}
