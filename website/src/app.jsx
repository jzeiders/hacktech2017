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
        this.state = {
            data: null,
            user: null
        };
    }
    updateData(data){
        this.setState({data: data});
    }
    updateUser(user){
        this.setState({user: user});
    }
    render() {
        return (
            <Router style={{height:"100%"}} history={hashHistory}>
                <Route style={{height:"100%"}} path="/" component={HeaderComponent}>
                    <IndexRoute style={{height:"100%"}} component={()=>(<LoginComponent updateUser={this.updateUser.bind(this)}/>)}/>
                    <Route style={{height:"100%"}} path="map" component={()=>(<MapComponent updateData={this.updateData.bind(this)}/>)}/>
                    <Route style={{height:"100%"}} path="stats" component={()=>(<StatsComponent user={this.state.user} data={this.state.data}/>)}/>
                </Route>
            </Router>
        )
    }
}