import React, { Component } from "react";

import Ink from "react-ink";

class RestaurantSearch extends Component {
    state = {
        restaurant: ""
    };
    componentDidMount() {
        this.searchInput.focus();
    }
    static contextTypes = {
        router: () => null
    };

    handleInputChange = e => {
        this.setState({ restaurant: e.target.value });
        this.props.searchFunction(e.target.value);
    };

    render() {
        return (
            <React.Fragment>
                <div className="col-12 p-0">
                    <div className="block m-0">
                        <div className="block-content p-0">
                            <div className="input-group search-box">
                                <div className="input-group-prepend">
                                    <button
                                        type="button"
                                        className="btn search-navs-btns"
                                        style={{ position: "relative" }}
                                        onClick={this.context.router.history.goBack}
                                    >
                                        <i className="si si-arrow-left" />
                                        <Ink duration="500" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder={localStorage.getItem("restaurantSearchPlaceholder")}
                                    value={this.state.restaurant}
                                    onChange={this.handleInputChange}
                                    ref={input => {
                                        this.searchInput = input;
                                    }}
                                />
                                <div className="input-group-append">
                                    <button type="submit" className="btn search-navs-btns" style={{ position: "relative" }}>
                                        <i className="si si-magnifier" />
                                        <Ink duration="500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default RestaurantSearch;
