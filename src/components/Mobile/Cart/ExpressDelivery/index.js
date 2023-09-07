import React, { Component } from "react";
import ContentLoader from "react-content-loader";
import { connect } from "react-redux";
import Modal from 'react-responsive-modal';
import { setDeliveryDateTime, getDeliveryTimeSlot,setExpressDeliveryCharges } from '../../../../services/Delivery/deliverytimeslot/actions';
import { getRestaurantInfoById } from '../../../../services/items/actions';
import Ink from "react-ink";

class ExpressDelivery extends Component {
	state = {
		show: false,
		open: false,
		deliverySlots: [],
		deliveryDates: this.props.deliveryDates,
		selectedDate: null,
		selectedTime: null,
		restaurant:{},
		ordersLimit:[],
		deliveryCharges:0

	};
	
		

	onOpenModal = () => {
		this.setState({ open: true });
	};
	
	onCloseModal = () => {
		this.setState({ open: false });
	};

	getTimesSlots =(deliveryDates,timeSlotAvailability) =>{
		// const {deliveryDates}=this.state;
		console.log("deliveryDates",deliveryDates)
		console.log("timeSlotAvailability",timeSlotAvailability)
		for(var i=0; i < deliveryDates.length; i++){
			for(var j=0; j < timeSlotAvailability.length; j++){
				if(deliveryDates[i].date == timeSlotAvailability[j].delivery_date){
					for(var k=0;k < deliveryDates[i].time.length;k++){
						if(deliveryDates[i].time[k].time == timeSlotAvailability[j].delivery_timeslot){
							if(timeSlotAvailability[j].unavailable == 1){
								deliveryDates[i].time[k].unavailable=1
								break;
							}else{
								deliveryDates[i].time[k].unavailable=0
								break;
							}
							
						}
					}				
				}
			}
			
		}
		this.setState({
			deliveryDates:deliveryDates
		})
	}

	componentDidMount() {
		// this.getNextWeek();
		const { user, delivery_datetime, deliveryCharges } =this.props
		if (localStorage.getItem("activeRestaurant") !== null) {
			this.props.getRestaurantInfoById(localStorage.getItem("activeRestaurant"));
			this.props.getDeliveryTimeSlot(new Date().toDateString().substr(4),localStorage.getItem("activeRestaurant"))
		}
		if(Object.keys(delivery_datetime).length !== 0){
			this.setState({ 
				selectedDate:delivery_datetime.delivery_date,
				selectedTime:delivery_datetime.delivery_timeslot
			});
		}
		if(deliveryCharges !== "0"){
			console.log("show",this.state.show)
			this.setState({ show: !this.state.show });
		}
	}

	// componentDidUpdate(){
	// 	console.log("FF",this.state.deliveryCharges)
	// 	console.log("FF1",this.state.show)
	// 	this.state.show?this.props.setExpressDeliveryCharges(this.state.deliveryCharges):this.props.setExpressDeliveryCharges(0)
	// }

	componentWillReceiveProps(newProps) {
		if(newProps.deliveryDates.length){
			this.getTimesSlots(newProps.deliveryDates,newProps.timeslotAvailability);
		}
	}

	handleShow = (deliveryCharges) => {
		console.log("deliveryCharges",deliveryCharges)
		if(!this.state.show){
			this.props.setExpressDeliveryCharges(deliveryCharges)
		}else{
			this.props.setExpressDeliveryCharges("0")
		}
		this.setState({ deliveryCharges: deliveryCharges });
		this.setState({ show: !this.state.show });
	};

	setTimeSlotFormat = (timeslot) =>{
		let index = timeslot.indexOf("-");  // Gets the first index where a space occours
		let start_time = timeslot.substr(0, index); // Gets the first part
		let end_time = timeslot.substr(index + 1);  // Gets the text part
		start_time = start_time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [start_time];
		end_time = end_time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [end_time];
		if (start_time.length > 1) { // If time format correct
			start_time = start_time.slice (1);  // Remove full string match value
			start_time[5] = +start_time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
			start_time[0] = +start_time[0] % 12 || 12; // Adjust hours
		}
		if (end_time.length > 1) { // If time format correct
			end_time = end_time.slice (1);  // Remove full string match value
			end_time[5] = +end_time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
			end_time[0] = +end_time[0] % 12 || 12; // Adjust hours
		}
		return start_time.join ('')+"-"+end_time.join ('');
	}

	handleDeliveryTime = (date,time) =>{
		this.onCloseModal();
		this.props.setDeliveryDateTime(date,time);
		this.setState({ 
			selectedDate:date,
			selectedTime:time
		});
		
	}

	

	render() {
		const { open, show, deliveryDates, selectedTime, selectedDate } = this.state;
		const { restaurant }=this.props;
		console.log("DELLLL",deliveryDates)
		console.log("delivery",this.props);
		return (
			<div className="input-group mb-20 px-4 justify-content-between align-items-baseline" style={{backgroundColor:" #fff"}}>
			{restaurant && restaurant.id?
			<React.Fragment>
				<div className="input-group mb-1 justify-content-between align-items-baseline pt-4">
					<div>
					<h2 className="mb-10" style={{fontSize:"1rem"}}>EXPRESS DELIVERY C$ <span style={{color:"red"}}>{restaurant && restaurant.express_delivery_charge?restaurant.express_delivery_charge:0}</span></h2>
					<p className="express-text mb-10">Supplier Deliver your Order within 3 Hrs</p>
					</div>
					<input type="checkbox" className="express-check" onClick={()=>this.handleShow(restaurant.express_delivery_charge)} checked={this.state.show}  ></input>
				</div>
				{show?
				null:
				<div className="input-group pb-10" style={{justifyContent:"center"}}>
					<div className="input-group pb-10 justify-content-between">
						<h2 className="item-text mb-10">Delivery Date</h2>
						<h2 className="item-text mb-10" style={{color:"orange"}} onClick={this.onOpenModal}>{selectedDate?selectedDate:"Choose date"}</h2>
					</div>
					<div className="input-group pb-10 justify-content-between">
						<h2 className="item-text mb-10">Delivery Time </h2>
						<h2 className="item-text mb-10" style={{color:"green"}} onClick={this.onOpenModal}>{selectedTime?this.setTimeSlotFormat(selectedTime):"Choose time"}</h2>
					</div>
					<Modal open={open} onClose={this.onCloseModal} classNames={{
						overlay: 'customOverlay',
						modal: 'customModal',
						closeButton:'customClose'
					}}>	
					<div className="input-group justify-content-between">
						<h4 className="p-4 mb-0" style={{color:"#b3b3b3"}}>SELECT DELIVERY TIME SLOT</h4>
						<p className="px-2 mb-0 py-2" style={{backgroundColor: "#ffe2c0"}}>Please select a time slot as per your convenience. Your order will be delivered during the selected time slot</p>	
					</div>
						{deliveryDates.length && deliveryDates && deliveryDates.map((delivery,i) =>
						<React.Fragment key={i}>
						<div className="input-group justify-content-between" style={{backgroundColor:"#81c49b",padding:" 14px",marginBottom:0}}>
							<h6 className="mb-0">{delivery.day}</h6>
							<h6 className="mb-0">{delivery.date}</h6>
						</div>
						{delivery.time.map((item,i) =>
						<React.Fragment key={i}>
						<div className="timeSlot input-group justify-content-between" onClick={()=>{item && item.unavailable?alert("TimeSlot is Unavailable"):this.handleDeliveryTime(delivery.date,item.time)}}>
							<p className="mb-0">{this.setTimeSlotFormat(item.time)}</p>
							{item && item.unavailable?
							<p  className="mb-0 px-2" style={{backgroundColor: "#848282",color:"white"}}>UNAVAILABLE</p>
							:null}
							<Ink duration={500} />
						</div>
						</React.Fragment>)}
						</React.Fragment>
						)}
					</Modal>
				</div>}
			</React.Fragment>:
			<ContentLoader height={378} width={400} speed={1.2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
				<rect x="20" y="20" rx="4" ry="4" width="80" height="78" />
				<rect x="144" y="30" rx="0" ry="0" width="115" height="18" />
				<rect x="144" y="60" rx="0" ry="0" width="165" height="16" />
			</ContentLoader>
			}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	restaurant: state.items.restaurant_info,
	delivery_datetime: state.delivery_datetime.delivery_datetime,
	ordersLimit:state.delivery_datetime.ordersLimit,
	timeslotAvailability:state.delivery_datetime.timeslotAvailability,
	deliveryCharges:state.delivery_datetime.deliveryCharges,
});

export default connect(mapStateToProps,{
	getRestaurantInfoById,
	setDeliveryDateTime,
	getDeliveryTimeSlot,
	setExpressDeliveryCharges
})(ExpressDelivery);
