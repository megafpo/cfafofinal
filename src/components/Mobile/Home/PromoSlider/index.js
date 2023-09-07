import React, { Component } from "react";

import ContentLoader from "react-content-loader";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import Ink from "react-ink";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader	
import { Carousel } from 'react-responsive-carousel';

class PromoSlider extends Component {
	render() {
		const { slides, size, secondarySlider } = this.props;
		const settings ={	
			autoPlay:true,	
			infiniteLoop:true,	
			showIndicators:false,	
			showArrows:false,	
			showStatus: false,	
			stopOnHover: true,	
			swipeable: true,	
			emulateTouch:true,	
			showThumbs: false,	
		}
		return (
			<div className="py-3"  style={{ position: "relative" }}>	
				<Carousel {...settings}>
					{slides.length === 0 ? (
						<ContentLoader
							height={170}
							width={400}
							speed={1.2}
							primaryColor="#f3f3f3"
							secondaryColor="#ecebeb"
						>
							<rect x="20" y="0" rx="4" ry="4" width="168" height="168" />
							<rect x="228" y="0" rx="4" ry="4" width="168" height="168" />
						</ContentLoader>
					) : (
						slides.map((slide) =>
							slide.data.model === "3" ? (
								<div
									className="slider-wrapper__img-wrapper"
									key={slide.data.id}
									style={{ position: "relative" }}
								>
									{/* if customURL then use anchor tag */}
									<a href={slide.url}>
										<LazyLoad>
											<img
												src={slide.data.image}
												alt={slide.data.name}
												className={`slider-wrapper__img slider-cust-img ${!secondarySlider &&
													"slider-wrapper__img-shadow"} custom-promo-img`}
												style={{
													height: (12 / 5) * size + "rem",
													width: "100%",
												}}
											/>
										</LazyLoad>
										<Ink duration="500" hasTouch={true} />
									</a>
								</div>	
							) : (
								<div
									className="slider-wrapper__img-wrapper"
									key={slide.data.id}
									style={{ position: "relative" }}
								>
									<a href={slide.url}>
										<LazyLoad>
											<img
												src={slide.data.image}
												alt={slide.data.name}
												className={`slider-wrapper__img slider-cust-img ${!secondarySlider &&
													"slider-wrapper__img-shadow"} custom-promo-img`}
												style={{
													height: (12 / 5) * size + "rem",
													width: "100%",
												}}
											/>
										</LazyLoad>
										<Ink duration="500" hasTouch={true} />
									</a>	
								</div>
							)
						)
					)}
					</Carousel>	
			</div>
		);
	}
}

export default PromoSlider;
