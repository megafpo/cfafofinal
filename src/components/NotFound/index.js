import React, { Component } from "react";

import { Redirect } from "react-router";

class NotFound extends Component {
    render() {
        return <Redirect to="/" />;
    }
}

export default NotFound;
