import React, { Component } from "react";
import ContentLoader from "react-content-loader";
import { connect } from "react-redux";
import Modal from 'react-responsive-modal';
import DelayLink from "../../../../helpers/delayLink";

class CategoryItems extends Component {
	state = {
		

	};
	
		

	

	

	componentDidMount() {
		
		
	}

	
	componentWillReceiveProps(newProps) {
		
	}

	
	render() {
	
        console.log("delivery",this.props);
		return (
			<div className="input-group mb-20 p-2 align-items-baseline" style={{backgroundColor:"#f5f6f7", display:"flex", flexWrap:"wrap", gap: '4px'}}>
                {this.props.data?Object.keys(this.props.data).map((category, index) =>(
                    <div className="col-xs-3 category-items" key={index}>
                        <DelayLink
                            key={index}
                            to={"../stores/" + this.props.restaurant.slug}
                            delay={200}
                            className="block text-center m-1"
                            style={{borderRadius:"7px"}}
                            clickAction={() => {
                                localStorage.setItem("selectedCategory", category);
                                localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
                                    this.props.restaurant.delivery_type === 1 &&
                                    localStorage.setItem("userSelected", "DELIVERY");
                                localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
                                    this.props.restaurant.delivery_type === 2 &&
                                    localStorage.setItem("userSelected", "SELFPICKUP");
                                localStorage.getItem("userPreferredSelection") === "DELIVERY" &&
                                    this.props.restaurant.delivery_type === 3 &&
                                    localStorage.setItem("userSelected", "DELIVERY");
                                localStorage.getItem("userPreferredSelection") === "SELFPICKUP" &&
                                    this.props.restaurant.delivery_type === 3 &&
                                    localStorage.setItem("userSelected", "SELFPICKUP");
                            }}
                        >
                            {/* <div className="category-items" key={index}> */}
                                {this.props.data[category].map((item,i) => (
                                    i == 0?
                                    (<React.Fragment key={i}>
                                        <img
                                            src={item.category_image ? item.category_image : item.image}
                                            alt= {item.category_name}
                                            width="100"
                                            height="100"
                                            style={{padding:"4px"}}
                                        />
                                        <p className="m-0" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.category_name}</p>
                                    </React.Fragment>):null
                                ))}
                            {/* </div> */}
                        </DelayLink>
                    </div>
                )):null}
			</div>
		);
	}
}



export default (CategoryItems);
