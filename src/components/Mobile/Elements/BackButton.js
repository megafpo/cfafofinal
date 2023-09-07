import React, { Component } from "react";

import Ink from "react-ink";

class BackButton extends Component {
    static contextTypes = {
        router: () => null
    };
    render() {
        return (
            <React.Fragment>
                <button
                    type="button"
                    className="btn search-navs-btns back-button"
                    style={{ position: "relative" }}
                    onClick={this.context.router.history.goBack}
                >
                    <i className="si si-arrow-left" />
                    <Ink duration="500" />
                </button>
            </React.Fragment>
        );
    }
}

export default BackButton;
