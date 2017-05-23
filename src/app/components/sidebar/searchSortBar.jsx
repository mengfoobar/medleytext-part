import React from 'react'
import FontAwesome from 'react-fontawesome'
import ReactDOM from 'react-dom'

import {Overlay, MenuItem, Clearfix} from 'react-bootstrap'

import style from './styles/searchSortBar.css'

import ListItem from './listItem.jsx'
import Fuse from 'fuse.js'

import {get} from 'nested-property'

import {getEditorSetting, setEditorSetting} from '../../helper/settingsManager'
import {getTheme} from '../../helper/themeHelper'


const FuseNotesOptions = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "body.blocks.text"
    ]
};

var FuseBlocksOptions = {
    id: "text",
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "text"
    ]
}




class SearchPopover extends React.Component{
    render() {
        const {notes, filter, setActiveNote, clearSearch} = this.props;

        const notesFuse = new Fuse(notes, FuseNotesOptions);
        const matchedNotes = notesFuse.search(filter);

        if(!filter){
            return (<div/>)
        }else if(matchedNotes.length===0){
            return (<div className={`${style.searchContainer} ${style.noResultsContainer} ${getTheme().noResultsContainer}`}>
                No Results
            </div>)
        }else{
            return (
                <div className={`${style.searchContainer} ${getTheme().searchContainer}`}>
                    <ul ref="list" >
                        {matchedNotes.map((item, i)=>{
                            return (<li  ref={`item_${i}`} onClick={() => {
                                const newActiveIndex = notes.findIndex((note) =>{
                                    return note._id ===item._id
                                })
                                setActiveNote(newActiveIndex);
                                clearSearch();

                            }}>
                                <ListItem key={`notes_${i}`} item={item} index={i} activeIndex={null}
                                          view={"notes"}
                                          preview={`${getPreviewFromBlocks(item.body.blocks, filter)}`}
                                          previewFull

                                />

                            </li>)
                        })}
                    </ul>
                </div>
            )
        }
    }
};

class SortPopover extends React.Component{

    constructor(props){
        super(props);
        this.setSort = this.setSort.bind(this)
    }

    setSort(sort, order){
        console.log("setting notes")
        const {notes, sortNotes, hide} = this.props;
        setEditorSetting("sidebar.notes", {sort, order})
        sortNotes(notes, sort, order)
        hide()
    }

    render() {
        const sortOptions=[
            {metric:"dateCreated", order:"desc", label:"Date Created Desc."},
            {metric:"dateCreated", order:"asc", label:"Date Created Asc."},
            {metric:"lastUpdated", order:"desc", label:"Last Updated Desc."},
            {metric:"lastUpdated", order:"asc", label:"Last Updated Asc."},
            {metric:"title", order:"desc", label:"Title Desc."},
            {metric:"title", order:"asc", label:"Title Asc."}
        ]
        const {sort_menuItem, sort_header, sortContainer} = getTheme()
        return (
            <div className={`${style.sortContainer} ${sortContainer}`}>
                <div className={`${style.sortHeader} ${sort_header}`}>Sort by</div>
                <ul>
                    {
                        sortOptions.map((o)=>{
                            return (
                                <li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort(o.metric, o.order)}>
                                    {o.label}
                                    {
                                        getEditorSetting("sidebar.notes.sort")===o.metric && getEditorSetting("sidebar.notes.order")===o.order ?
                                            <FontAwesome name="check" className={style.menuItemCheck} />:null
                                        }
                                </li>
                            )
                        })
                    }



                </ul>
            </div>)}
}


const getPreviewFromBlocks=(blocks, filter)=>{
    const blocksFuse = new Fuse(blocks, FuseBlocksOptions);
    return get(blocksFuse.search(filter), "0") || ""
}


export default class SearchSortBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.hideSortPopover = this.hideSortPopover.bind(this);


        this.state={
            search:"",
            showSort:false
        }

    }

    handleChange(event) {
        this.setState({search: event.target.value});
    }

    hideSortPopover(){
        this.setState({ showSort: false})
    }

    render() {
        const {search, showSort} = this.state;
        const {notes, setActiveNote, sortNotes} = this.props;
        const {searchSortBar_icon} = getTheme()

        return (
            <div className={style.container}>

                <FontAwesome name="sort-amount-desc" className={`${style.icon} ${searchSortBar_icon}`} ref="sortIcon"
                             onClick={(e)=>
                                 this.setState({
                                     showSort:true
                                 })}
                />

                <FontAwesome name="search"  className={`${style.icon} ${searchSortBar_icon}`} ref="searchIcon"  onClick={()=>{
                    ReactDOM.findDOMNode(this.refs.searchInput).focus()
                }} />
                <input type="text" ref="searchInput" name="search" placeholder="Search"  className={`${style.input} ${getTheme().searchSortContainer_input}`}
                       value={search} onChange={this.handleChange} />
                <Overlay
                    show={search.length>0}
                    placement="bottom"
                    rootClose
                    container={this}
                    onHide={() => this.setState({search:""})}
                    target={() => ReactDOM.findDOMNode(this.refs.searchIcon)}
                >
                    <SearchPopover notes={notes} filter={search} setActiveNote={setActiveNote}
                                   clearSearch={()=>{this.setState({
                                       search:""
                                   })

                    }} />

                </Overlay>
                <Overlay
                    show={showSort}
                    placement="bottom"
                    rootClose
                    container={this}
                    onHide={this.hideSortPopover}
                    target={() => ReactDOM.findDOMNode(this.refs.sortIcon)}>
                    <SortPopover sortNotes={sortNotes} notes={notes} hide={this.hideSortPopover}/>

                </Overlay>


            </div>
        )
    }
}

{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("dateCreated", "desc")}>Date Created Desc.</li>*/}
{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("dateCreated", "asc")}>Date Created Asc.</li>*/}
{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("lastUpdated", "desc")}>Last Updated Desc.</li>*/}
{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("lastUpdated", "asc")}>Last Updated Asc.</li>*/}
{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("title", "desc")}>Title Desc.</li>*/}
{/*<li className={`${style.menuItem} ${sort_menuItem}`} onClick={()=>this.setSort("title", "asc")}>Title Asc.</li>*/}