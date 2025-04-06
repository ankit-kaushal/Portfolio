import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGithub,
	faInstagram,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from "react-redux";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [loadingImage, setLoadingImage] = useState(true);
	const [imageSrc, setImageSrc] = useState("");

	const debounce = useCallback((func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}, []);

	const user = useSelector(
		(state) => state.homeData,
		(prev, next) => JSON.stringify(prev) === JSON.stringify(next),
	);

	const socialObject = React.useMemo(() => {
		return (
			user?.social?.reduce((acc, curr) => {
				acc[curr.name] = curr.url;
				return acc;
			}, {}) || {}
		);
	}, [user?.social]);

	useEffect(() => {
		const handleScroll = debounce(() => {
			const scroll = Math.round(window.pageYOffset, 2);
			const newLogoSize = Math.max(40, 80 - (scroll * 4) / 10);

			setLogoSize(newLogoSize);
			setStayLogo(newLogoSize <= 40);
		}, 10);

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!user?.pictureUrl?.home) return;

		const img = new Image();
		img.src = user.pictureUrl.home;

		const handleLoad = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		};

		const handleError = () => {
			setImageSrc("my-pic.jpg");
			setLoadingImage(false);
		};

		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleError);

		return () => {
			img.removeEventListener("load", handleLoad);
			img.removeEventListener("error", handleError);
		};
	}, [user?.pictureUrl?.home]);

	const currentSEO = React.useMemo(
		() => SEO.find((item) => item.page === "home"),
		[],
	);

	const logoStyle = React.useMemo(
		() => ({
			display: "flex",
			position: stayLogo ? "fixed" : "relative",
			top: stayLogo ? "3vh" : "auto",
			zIndex: 999,
			border: stayLogo ? "1px solid white" : "none",
			borderRadius: stayLogo ? "50%" : "none",
			boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
		}),
		[stayLogo],
	);

	useEffect(() => {
		let rafId;
		const handleScroll = () => {
			rafId = requestAnimationFrame(() => {
				const scroll = Math.round(window.pageYOffset, 2);
				const newLogoSize = Math.max(40, 80 - (scroll * 4) / 10);

				setLogoSize(newLogoSize);
				setStayLogo(newLogoSize <= 40);
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			cancelAnimationFrame(rafId);
		};
	}, []);

	useEffect(() => {
		if (!user?.pictureUrl?.home) {
			setImageSrc("my-pic.jpg");
			setLoadingImage(false);
			return;
		}

		const img = new Image();
		img.src = user.pictureUrl.home;

		const handleLoad = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		};

		const handleError = () => {
			setImageSrc("my-pic.jpg");
			setLoadingImage(false);
		};

		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleError);

		return () => {
			img.removeEventListener("load", handleLoad);
			img.removeEventListener("error", handleError);
		};
	}, [user?.pictureUrl?.home]);

	const loadImage = () => {
		const img = new Image();
		img.src = `${user?.pictureUrl?.home || "my-pic.jpg"}`;
		img.onload = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		};
	};

	loadImage();
	return (
		<React.Fragment>
			<Helmet>
				<title>{user?.name || INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="home" />
				<main className="content-wrapper">
					<div className="homepage-logo-container">
						<div style={logoStyle}>
							<Logo width={logoSize} user={user} link={false} />
						</div>
					</div>
					<div className="homepage-container">
						<section
							className="homepage-first-area"
							aria-label="Introduction"
						>
							<div className="homepage-first-area-left-side">
								<h1 className="title homepage-title">
									{user?.name || INFO.homepage.title}
								</h1>

								<p className="subtitle homepage-subtitle">
									{user?.description ||
										INFO.homepage.description}
								</p>
							</div>
							<div className="homepage-first-area-right-side">
								<div className="homepage-image-container">
									{loadingImage ? (
										<div
											className="homepage-image-wrapper-loading"
											role="progressbar"
											aria-label="Loading profile image"
										></div>
									) : (
										<div className="homepage-image-wrapper">
											<div
												className="image-wrap-circle"
												aria-hidden="true"
											></div>
											<img
												src={imageSrc}
												alt={`${user?.name || INFO.main.title}'s portrait`}
												className="homepage-image"
												loading="lazy"
											/>
										</div>
									)}
								</div>
							</div>
						</section>

						<nav
							className="homepage-socials"
							aria-label="Social media links"
						>
							{/* Social media links with improved accessibility */}
							<a
								href={
									socialObject?.github || INFO.socials.github
								}
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub Profile"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={
									socialObject?.linkedin ||
									INFO.socials.linkedin
								}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faLinkedin}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={
									socialObject?.twitter ||
									INFO.socials.twitter
								}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faTwitter}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={
									socialObject?.instagram ||
									INFO.socials.instagram
								}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={`mailto:${socialObject?.email || INFO.main.email}`}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faMailBulk}
									className="homepage-social-icon"
								/>
							</a>
						</nav>

						<footer className="page-footer">
							<Footer user={user} />
						</footer>
					</div>
				</main>
			</div>
		</React.Fragment>
	);
};

export default React.memo(Homepage);
