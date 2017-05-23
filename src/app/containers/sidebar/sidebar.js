import SidebarWrapper from '../../components/sidebar/sidebar.jsx'

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {...state.Sidebar}
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

const Sidebar = connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarWrapper)

export default Sidebar