import React from "react";
import styles from "../index.scss";
import headerStyles from "./header.scss";

export default class HeaderComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <div className={headerStyles.bar}>
                    This is Header
                </div>
                {this.props.children}
            </div>
        )
    }
}
