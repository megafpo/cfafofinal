import React, { Component } from "react";

const slider = React.createRef();
const container = React.createRef();
const isTouchDevice = "ontouchstart" in document.documentElement;

export default class ReactSwipeButton extends Component {
	isDragging = false;
	sliderLeft = 0;

	state = {};

	componentDidMount() {
		if (isTouchDevice) {
			document.addEventListener("touchmove", this.onDrag);
			document.addEventListener("touchend", this.stopDrag);
		} else {
			document.addEventListener("mousemove", this.onDrag);
			document.addEventListener("mouseup", this.stopDrag);
		}
		this.containerWidth = container.current.clientWidth - 80;
	}

	onDrag = (e) => {
		if (this.unmounted || this.state.unlocked) return;
		if (this.isDragging) {
			if (isTouchDevice) {
				this.sliderLeft = Math.min(Math.max(0, e.touches[0].clientX - this.startX), this.containerWidth);
			} else {
				this.sliderLeft = Math.min(Math.max(0, e.clientX - this.startX), this.containerWidth);
			}
			this.updateSliderStyle();
		}
	};

	updateSliderStyle = () => {
		if (this.unmounted || this.state.unlocked) return;
		slider.current.style.left = this.sliderLeft + 80 + "px";
	};

	stopDrag = () => {
		if (this.unmounted || this.state.unlocked) return;
		if (this.isDragging) {
			this.isDragging = false;
			if (this.sliderLeft > this.containerWidth * 0.9) {
				this.sliderLeft = this.containerWidth;
				this.onSuccess();
				if (this.props.onSuccess) {
					this.props.onSuccess();
				}
			} else {
				this.sliderLeft = 0;
				if (this.props.onFailure) {
					this.props.onFailure();
				}
			}
			this.updateSliderStyle();
		}
	};

	startDrag = (e) => {
		if (this.unmounted || this.state.unlocked) return;
		this.isDragging = true;
		if (isTouchDevice) {
			this.startX = e.touches && e.touches[0].clientX;
		} else {
			this.startX = e.clientX;
		}
	};

	onSuccess = () => {
		container.current.style.width = container.current.clientWidth + "px";
		this.setState({
			unlocked: true,
		});
	};

	getText = () => {
		return this.state.unlocked
			? this.props.text_unlocked || <i className="si si-check" />
			: this.props.text || "Slide to Proceed";
	};

	reset = () => {
		if (this.unmounted) return;
		this.setState({ unlocked: false }, () => {
			this.sliderLeft = 0;
			this.updateSliderStyle();
		});
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.reset) {
			this.reset();
		}
	}
	componentWillUnmount() {
		this.unmounted = true;
	}

	render() {
		return (
			<div className="ReactSwipeButton">
				<div
					className={`rsbContainer slider-bg-color ${this.state.unlocked && "rsbContainerUnlocked"}`}
					ref={container}
				>
					<div className="rsbcSlider" ref={slider} onMouseDown={this.startDrag} onTouchStart={this.startDrag}>
						<span className="rsbcSliderText">{this.getText()}</span>
						<span className="rsbcSliderArrow" />
					</div>
					<div className="rsbcText">{this.getText()}</div>
				</div>
			</div>
		);
	}
}
