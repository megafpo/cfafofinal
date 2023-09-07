import React, { Component } from "react";

import Fade from "react-reveal/Fade";
import Flip from "react-reveal/Flip";
import Tilt from "react-tilt";

class StoreAchievements extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="container-fluid" style={{ backgroundColor: "#FBFBFD" }}>
                    <div className="container">
                        <div className="row">
                            <Fade left>
                                <div className="col-xl-3 d-table mt-50 mb-50">
                                    <Tilt className="Tilt" options={{ max: 40, perspective: 650 }}>
                                        <div className="col-xl-12 text-center d-table-cell align-middle store-achievement">
                                            {localStorage.getItem("desktopAchievementOneTitle") !== "null" && (
                                                <h3>{localStorage.getItem("desktopAchievementOneTitle")}</h3>
                                            )}
                                            {localStorage.getItem("desktopAchievementOneSub") !== "null" && (
                                                <h4 className="m-0">{localStorage.getItem("desktopAchievementOneSub")}</h4>
                                            )}
                                        </div>
                                    </Tilt>
                                </div>
                            </Fade>
                            <Flip top>
                                <div className="col-xl-3 d-table mt-50 mb-50">
                                    <Tilt className="Tilt" options={{ max: 40, perspective: 650 }}>
                                        <div className="col-xl-12 text-center d-table-cell align-middle store-achievement">
                                            {localStorage.getItem("desktopAchievementTwoTitle") !== "null" && (
                                                <h3>{localStorage.getItem("desktopAchievementTwoTitle")}</h3>
                                            )}
                                            {localStorage.getItem("desktopAchievementTwoSub") !== "null" && (
                                                <h4 className="m-0">{localStorage.getItem("desktopAchievementTwoSub")}</h4>
                                            )}
                                        </div>
                                    </Tilt>
                                </div>
                            </Flip>
                            <Flip bottom>
                                <div className="col-xl-3 d-table mt-50 mb-50">
                                    <Tilt className="Tilt" options={{ max: 40, perspective: 650 }}>
                                        <div className="col-xl-12 text-center d-table-cell align-middle store-achievement">
                                            {localStorage.getItem("desktopAchievementThreeTitle") !== "null" && (
                                                <h3>{localStorage.getItem("desktopAchievementThreeTitle")}</h3>
                                            )}
                                            {localStorage.getItem("desktopAchievementThreeSub") !== "null" && (
                                                <h4 className="m-0">{localStorage.getItem("desktopAchievementThreeSub")}</h4>
                                            )}
                                        </div>
                                    </Tilt>
                                </div>
                            </Flip>
                            <Fade right>
                                <div className="col-xl-3 d-table mt-50 mb-50">
                                    <Tilt className="Tilt" options={{ max: 40, perspective: 650 }}>
                                        <div className="col-xl-12 text-center d-table-cell align-middle store-achievement">
                                            {localStorage.getItem("desktopAchievementFourTitle") !== "null" && (
                                                <h3>{localStorage.getItem("desktopAchievementFourTitle")}</h3>
                                            )}
                                            {localStorage.getItem("desktopAchievementFourSub") !== "null" && (
                                                <h4 className="m-0">{localStorage.getItem("desktopAchievementFourSub")}</h4>
                                            )}
                                        </div>
                                    </Tilt>
                                </div>
                            </Fade>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default StoreAchievements;
