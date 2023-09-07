import React, { Component } from "react";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";

class OrderScheduling extends Component {
	state = {
		timeStops: [],
		time: [],
		day: "",
		slotsArray: [],
		days: [],
		sortedArray: [],
		open: false,
		todayDate: null,
		selectedDate: null,
		slotsDays: [],
		selectedSlot: {},
	};

	componentDidMount() {
		this.getCurrentDay();
		if (JSON.parse(this.props.restaurant.schedule_data)) {
			this.getSlots(
				JSON.parse(this.props.restaurant.schedule_data)[this.getCurrentDay(new Date().getDay())],
				30,
				"m"
			);
		}

		let d1 = new Date();
		this.setState({
			todayDate: moment(new Date()).format("YYYY-MM-DD"),
			currentTime: moment(d1.getTime()).format("hh:mm A"),
			selectedDate: moment(new Date()).format("YYYY-MM-DD"),
		});

		let arr = [];
		for (let i = 0; i < Object.keys(JSON.parse(this.props.restaurant.schedule_data)).length; i++) {
			arr.push({
				days: Object.keys(JSON.parse(this.props.restaurant.schedule_data))[i],
			});
		}
		this.setState({ slotsDays: arr }, () => {
			this.getCurrentWeek();
		});
	}

	getCurrentDay = (i) => {
		let day;
		switch (i) {
			case 0:
				day = "sunday";
				break;
			case 1:
				day = "monday";
				break;
			case 2:
				day = "tuesday";
				break;
			case 3:
				day = "wednesday";
				break;
			case 4:
				day = "thursday";
				break;
			case 5:
				day = "friday";
				break;
			case 6:
				day = "saturday";
				break;
			default:
				day = "";
				break;
		}
		this.setState({ day: day });

		return day;
	};

	getCurrentWeek = () => {
		let currentDate = moment();
		let weekStart = currentDate.clone().startOf("isoWeek");

		// let weekEnd = moment().add(new Date().getDay() - 4, "days");
		// let weekEnd = moment().add(new Date().getDay() === 6 ? new Date().getDay() - 4 : new Date().getDay() === 0 ? new Date().getDay() - 1 : new Date().getDay() === new Date().getDay() - 1 ? 1 , "days");

		let weekEnd = currentDate.clone().endOf("isoWeek") + 1;

		let days = [];
		let nextWeek = [];

		for (let i = 0; i <= 6; i++) {
			days.push({
				day: moment(weekStart)
					.add(i, "days")
					.format("dddd"),
				date: moment(weekStart)
					.add(i, "days")
					.format("YYYY-MM-DD"),
			});
			nextWeek.push({
				day: moment(weekEnd)
					.add(i, "days")
					.format("dddd"),
				date: moment(weekEnd)
					.add(i, "days")
					.format("YYYY-MM-DD"),
			});
		}

		let arr = [];
		for (let i = 0; i < days.length; i++) {
			if (moment(days[i].date).isSameOrAfter(moment(new Date()).format("YYYY-MM-DD"))) {
				arr.push(days[i]);
			}
		}

		if (parseInt(localStorage.getItem("orderSchedulingFutureDays")) > arr.length) {
			let array1 = arr.concat(nextWeek).filter((days) => {
				return this.state.slotsDays.some((availSlots) => {
					return days.day.toLowerCase() === availSlots.days.toLowerCase();
				});
			});

			this.setState({ days: array1 }, () => {
				this.daysAvailable(this.state.days);
			});
		} else {
			let array1 = arr.filter((days) => {
				return this.state.slotsDays.some((availSlots) => {
					return days.day.toLowerCase() === availSlots.days.toLowerCase();
				});
			});

			this.setState({ days: array1 }, () => {
				this.daysAvailable(this.state.days);
			});
		}
	};

	daysAvailable = () => {
		if (this.state.days.length > 0) {
			this.state.days.sort((a, b) => {
				let day1 = new Date(a.date);
				let day2 = new Date(b.date);
				return day1 - day2;
			});

			if (localStorage.getItem("enFixedNumberOfDays") === "true") {
				let arr = this.state.days.slice(0, parseInt(localStorage.getItem("orderSchedulingFutureDays")));

				if (arr.length > 0) {
					let sortedArray = arr.filter((days) => {
						return this.state.slotsDays.some((availSlots) => {
							return days.day.toLowerCase() === availSlots.days.toLowerCase();
						});
					});

					this.setState({ sortedArray: sortedArray });
				}
			} else {
				this.setState({ sortedArray: this.state.days });
			}
		}
	};

	getSlots = (data, timeSlots, format) => {
		let slots = [];
		if (data && data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				let date = moment();
				//get date and timezone of today
				let d1 = date.format().split("T")[0];
				let d2 = date.format().split("+")[1];

				var open = moment(d1 + "T" + data[i].open + ":00+" + d2);

				let close = moment(d1 + "T" + data[i].close + ":00+" + d2);

				//get the difference in the first open/close time (get number of hours ))
				let duration = moment.duration(close.diff(open));

				//if Hour = 5, slots will be 10 (30 mins diff)
				let slotsAvailable = Math.floor(duration.asHours() * 2);

				let startTime = "";

				for (let j = 0; j < slotsAvailable; j++) {
					if (j === 0) {
						startTime = data[i].open;
					}

					let time = moment(startTime, "hh:mm A");
					time.add(timeSlots, format);

					let slot = {
						open: moment(startTime, "hh:mm A").format("hh:mm A"),
						close: time.format("hh:mm A"),
					};
					slots.push(slot);
					startTime = time.format("HH:mm A").split(" ")[0];
				}
			}
		}

		this.setState({ slotsArray: slots });
		return slots;
	};

	setDay = (scheduleDay) => {
		this.setState({
			day: scheduleDay.day,
			selectedDate: scheduleDay.date,
			selectedSlot: {},
		});
		let dateAndDay = {
			day: scheduleDay.day,
			date: scheduleDay.date,
		};
		localStorage.setItem("orderDate", JSON.stringify(dateAndDay));

		if (scheduleDay.day !== this.state.day) {
			localStorage.removeItem("orderSlot");
		}

		if (scheduleDay) {
			let tomorrow = JSON.parse(this.props.restaurant.schedule_data)[
				this.getCurrentDay(
					scheduleDay.day.toLowerCase() === "sunday"
						? 0
						: scheduleDay.day.toLowerCase() === "monday"
						? 1
						: scheduleDay.day.toLowerCase() === "tuesday"
						? 2
						: scheduleDay.day.toLowerCase() === "wednesday"
						? 3
						: scheduleDay.day.toLowerCase() === "thursday"
						? 4
						: scheduleDay.day.toLowerCase() === "friday"
						? 5
						: 6
				)
			];
			this.getSlots(tomorrow, 30, "m");
		}
	};

	toggleSchedulePopup = () => {
		this.setState({ open: !this.state.open });
	};

	chooseOrderSlot = (dateDetails) => {
		if (localStorage.getItem("orderDate") === null) {
			let dateAndDay = {
				day: this.state.day,
				date: moment(new Date()).format("YYYY-MM-DD"),
			};
			localStorage.setItem("orderDate", JSON.stringify(dateAndDay));
		}
		localStorage.setItem("orderSlot", JSON.stringify(dateDetails));
		this.setState({ selectedSlot: dateDetails });
	};

	renderScheduleButton = () => {
		const orderDate = localStorage.getItem("orderDate");
		const orderSlot = localStorage.getItem("orderSlot");
		if (!(orderDate !== null && orderSlot !== null)) {
			return (
				<React.Fragment>
					<i className="si si-clock" />
					<span className="ml-2">{localStorage.getItem("modOSScheduleThisOrderText")}</span>
				</React.Fragment>
			);
		} else {
			const orderDateJson = JSON.parse(orderDate);
			const orderSlotJson = JSON.parse(orderSlot);
			return (
				<React.Fragment>
					<div className="d-flex justify-content-between w-100">
						<div>
							<span>
								{localStorage.getItem("modOSScheduleForText")} {orderDateJson.day}{" "}
								<small className="text-white">({orderDateJson.date})</small> <br />({orderSlotJson.open}{" "}
								- {orderSlotJson.close})
							</span>
						</div>
						<div>
							<button className="btn btn-sm" onClick={this.removeSelectedSchedule}>
								{localStorage.getItem("modOSRemoveBtnText")}
							</button>
						</div>
					</div>
				</React.Fragment>
			);
		}
	};

	renderDoneButton = () => {
		const orderDate = localStorage.getItem("orderDate");
		const orderSlot = localStorage.getItem("orderSlot");
		if (orderDate !== null && orderSlot !== null) {
			if (this.state.open) {
				return (
					<React.Fragment>
						<button
							className="btn btn-main"
							style={{
								color: localStorage.getItem("cartColorText"),
								backgroundColor: localStorage.getItem("cartColorBg"),
								position: "fixed",
								bottom: "0",
								zIndex: "9999999",
							}}
							onClick={this.toggleSchedulePopup}
						>
							{localStorage.getItem("modOSDoneBtnText")}
						</button>
					</React.Fragment>
				);
			}
		}
	};

	getFirstSlot = (time) => {
		let slotBasedOnCurrentTime = moment(this.state.currentTime, "hh:mm A").add(
			this.props.restaurant.schedule_slot_buffer,
			"minutes"
		); //add minutes from store's schedule_slot_buffer value
		let openTime = moment(time.open, "hh:mm A");
		if (slotBasedOnCurrentTime.isSameOrBefore(openTime)) {
			return true;
		} else {
			return false;
		}
	};

	render() {
		return (
			<React.Fragment>
				<div className="schedule-order-btn p-10 mx-15 mt-2" onClick={this.toggleSchedulePopup}>
					<React.Fragment>{this.renderScheduleButton()}</React.Fragment>
				</div>

				<Dialog
					maxWidth={false}
					fullWidth={true}
					fullScreen={true}
					open={this.state.open}
					onClose={this.toggleSchedulePopup}
					style={{ margin: "auto", position: "absolute", bottom: "0", top: "25%" }}
					PaperProps={{
						style: {
							backgroundColor: "#fff",
							borderTopLeftRadius: "15px",
							borderTopRightRadius: "15px",
						},
					}}
				>
					<div className="container p-0 m-0" style={{ borderRadius: "5px" }}>
						<h3 className="text-center my-20">{localStorage.getItem("modOSSelectDateTimeText")}</h3>
						<div className="slider-wrapper secondary-slider-wrapper sticky-top my-0 mr-20">
							{this.state.sortedArray.length > 0 && (
								<React.Fragment>
									{this.state.sortedArray.map((day) => (
										<div
											key={day.date}
											className="slider-wrapper__img-wrapper time-slots"
											style={{
												backgroundColor:
													this.state.day.toLowerCase() === day.day.toLowerCase() &&
													this.state.selectedDate === day.date
														? localStorage.getItem("cartColorBg")
														: "transparent",
												color:
													this.state.day.toLowerCase() === day.day.toLowerCase() &&
													this.state.selectedDate === day.date
														? localStorage.getItem("cartColorText")
														: "#000",
											}}
											onClick={() => this.setDay(day)}
										>
											{day.date === this.state.todayDate
												? "Today"
												: day.date ===
												  moment()
														.clone()
														.add(1, "days")
														.format("YYYY-MM-DD")
												? "Tomorrow"
												: moment(day.date).format("Do MMM") + " " + day.day.slice(0, 3)}
										</div>
									))}
								</React.Fragment>
							)}
						</div>

						<div className="time-slots-holder">
							{this.state.slotsArray.map((time, index) => (
								<React.Fragment key={index}>
									{this.state.todayDate === this.state.selectedDate ? (
										<React.Fragment>
											{this.getFirstSlot(time) && (
												<div className="available-time-slot-block">
													<span
														className={
															this.state.selectedSlot.open === time.open
																? "selected-slot"
																: ""
														}
														onClick={() => this.chooseOrderSlot(time)}
													>
														{time.open + " - " + time.close}
													</span>
													<hr />
												</div>
											)}
										</React.Fragment>
									) : (
										<div className="available-time-slot-block">
											<span
												className={
													this.state.selectedSlot.open === time.open ? "selected-slot" : ""
												}
												onClick={() => this.chooseOrderSlot(time)}
											>
												{time.open + " - " + time.close}
											</span>
											<hr />
										</div>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				</Dialog>
				{this.renderDoneButton()}
			</React.Fragment>
		);
	}
}

export default OrderScheduling;
