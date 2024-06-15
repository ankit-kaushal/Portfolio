import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";
import Works from "../components/homepage/works";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from 'react-redux';

import "./styles/about.css";

const About = () => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [imageSrc, setImageSrc] = useState('');

	const data = useSelector((state) => state.data);

	const { user = {}, works = {} } = data || {};

	const social = user?.social?.reduce((acc, curr) => {
		acc[curr.name] = curr.url;
		return acc;
	}, {});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	useEffect(() => {
		const loadImage = () => {
		  const img = new Image();
		  img.src = `${user?.pictureUrl?.about || "my-pic.jpg"}`; 
		  img.onload = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		  };
		};
		
		loadImage();
	  }, []);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`About | ${user?.name || INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={46} user={user} />
						</div>
					</div>

					<div className="about-container">
						<div className="about-main">
							<div className="about-right-side">
								<div className="title about-title">
									{user?.aboutTitle || INFO.about.title}
								</div>

								<div className="subtitle about-subtitle">
									{user?.aboutDescription || INFO.about.description}
								</div>
							</div>

							<div className="about-left-side">
								<div className="about-image-container">
								{loadingImage ?
									(<div className="about-image-wrapper-loading"></div>)
									: (<div className="about-image-wrapper">
											<div className="about-image-wrap-circle"></div>
											<img
												src={imageSrc}
												alt="about"
												className="about-image"
											/>
										</div>)
									}
								</div>
							</div>
						</div>
						<div className="about-after-title">
							<div className="about-works">
								<Works works={works} />
							</div>
							<div className="about-socials">
								<Socials social={social} />
							</div>
						</div>
						<div className="about-socials-mobile">
							<Socials social={social} />
						</div>
					</div>
					<div className="page-footer">
						<Footer user={user} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default About;
