import '!style!css!bootstrap/dist/css/bootstrap.css';
import '!style!css!font-awesome/css/font-awesome.css';
import '!style!css!react-notifications/lib/notifications.css'


import React from 'react';
import { render } from 'react-dom'

import { HashRouter} from 'react-router-dom'

import AppContainer from './components/appContainer.jsx'

import { Provider } from 'react-redux';
import configureStore from './store/configureStore.js';



const store = configureStore();


class App extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = 'App'
    }

    render () {
        return(
            <Provider store={store} >
                <HashRouter >
                    <AppContainer />
                </HashRouter>
            </Provider>

        )
    }
}

render(<App />, document.querySelector('#app'));


