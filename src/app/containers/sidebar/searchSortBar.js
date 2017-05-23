import SearchSortBarComponent from '../../components/sidebar/searchSortBar.jsx'
import {setActiveNote, setNotes, setLoading} from '../../actions/sidebar/sidebarList'
import {sortListItems} from '../../helper/notesHelper'


import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        notes:state.SidebarList.notes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveNote(index){
            dispatch(setActiveNote(index))
        },
        sortNotes(notes, prop, order){
            dispatch(setLoading())
            sortListItems(notes, prop, order);
            dispatch(setNotes(notes))
            dispatch(setActiveNote(0))
        }
    }
}

const SearchSortBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchSortBarComponent)

export default SearchSortBar