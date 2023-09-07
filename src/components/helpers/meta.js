import React, { Component } from "react";

import { Helmet } from "react-helmet";

class Meta extends Component {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.props.seotitle}</title>
                    <meta name="description" content={this.props.seodescription} />
                    <meta property="og:type" content={this.props.ogtype} />
                    <meta property="og:title" content={this.props.ogtitle} />
                    <meta property="og:description" content={this.props.ogdescription} />
                    <meta property="og:url" content={this.props.ogurl} />
                    <meta property="og:site_name" content={localStorage.getItem("storeName")} />
                    <meta property="og:image" content="/assets/img/social/ogimage.png" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={this.props.twittertitle} />
                    <meta name="twitter:description" content={this.props.twitterdescription} />
                    <meta name="twitter:site" content={`@${localStorage.getItem("twitterUsername")}`} />
                    <meta name="twitter:image" content="/assets/img/social/twitterimage.png" />
                </Helmet>
            </React.Fragment>
        );
    }
}

export default Meta;
