import React from 'react';
import styles from "./index.scss";
import {hashHistory, Router, Route, Link} from 'react-router'
import MapComponent from "./map/map.jsx";
import LoginComponent from "./login/login.jsx";
import StatsComponent from "./stats/stats.jsx";
import HeaderComponent from "./header/header.jsx";
import {IndexRoute} from 'react-router'

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Router style={"height:100%"} history={hashHistory}>
                <Route path="/" component={HeaderComponent}>
                    <IndexRoute component={LoginComponent}/>
                    <Route path="map" component={MapComponent}/>
                    <Route path="stats" component={StatsComponent}/>
                </Route>
            </Router>
        )
    }
}