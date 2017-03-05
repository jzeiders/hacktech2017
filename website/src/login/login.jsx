import React from "react";
import styles from "../index.scss";
import logStyles from "./login.scss";
import FacebookLogin from 'react-facebook-login';

export default class LoginComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    responseFacebook(response) {
        window.location.hash = "map"
        console.log(response);
    }
    render() {
        return (
            <div className={logStyles.main}>
                <h1>
                    Ture: Your Personal Tour
                </h1>
                <div className={logStyles.button}>
                    <FacebookLogin
                        appId="1883603641885965"
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={this.responseFacebook}/>
                </div>
            </div>
        )
    }
}
