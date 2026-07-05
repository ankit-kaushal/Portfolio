"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import FaIcon from "@/components/common/FaIcon";
import {
	faTwitter,
	faGithub,
	faInstagram,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "@/components/common/logo";
import Footer from "@/components/common/footer";
import NavBar from "@/components/common/navBar";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import INFO from "@/data/user";
import SEO from "@/data/seo";

import styles from "./homepage.module.css";

export default function HomepageView() {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [loadingImage, setLoadingImage] = useState(true);
	const [imageSrc, setImageSrc] = useState("");

	const user = useSelector(
		(state) => state.homeData,
		(prev, next) => JSON.stringify(prev) === JSON.stringify(next),
	);

	const socialObject = useMemo(() => {
		return (
			user?.social?.reduce((acc, curr) => {
				acc[curr.name] = curr.url;
				return acc;
			}, {}) || {}
		);
	}, [user?.social]);

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
			setImageSrc("/my-pic.jpg");
			setLoadingImage(false);
			return;
		}

		const img = new window.Image();
		img.src = user.pictureUrl.home;

		const handleLoad = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		};

		const handleError = () => {
			setImageSrc("/my-pic.jpg");
			setLoadingImage(false);
		};

		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleError);

		return () => {
			img.removeEventListener("load", handleLoad);
			img.removeEventListener("error", handleError);
		};
	}, [user?.pictureUrl?.home]);

	const currentSEO = useMemo(() => SEO.find((item) => item.page === "home"), []);

	const logoStyle = useMemo(
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

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="home" />
			<main className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div style={logoStyle}>
						<Logo width={logoSize} user={user} link={false} />
					</div>
				</div>
				<div className={styles.container}>
					<section
						className={styles.firstArea}
						aria-label="Introduction"
					>
						<div className={styles.firstAreaLeftSide}>
							<h1
								className={`${layoutStyles.title} ${styles.homepageTitle}`}
							>
								Ankit Kaushal
							</h1>
							<p
								className={`${layoutStyles.subtitle} ${styles.homepageSubtitle}`}
							>
								{user?.description || INFO.homepage.description}
							</p>
						</div>
						<div className={styles.firstAreaRightSide}>
							<div className={styles.imageContainer}>
								{loadingImage ? (
									<div
										className={styles.imageWrapperLoading}
										role="progressbar"
										aria-label="Loading profile image"
									/>
								) : (
									<div className={styles.imageWrapper}>
										<div
											className={styles.imageWrapCircle}
											aria-hidden="true"
										/>
										<Image
											src={imageSrc}
											alt={`${user?.name || INFO.main.title}'s portrait`}
											className={styles.image}
											width={370}
											height={370}
											unoptimized
										/>
									</div>
								)}
							</div>
						</div>
					</section>

					<nav
						className={styles.socials}
						aria-label="Social media links"
					>
						<a
							href={socialObject?.github || INFO.socials.github}
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub Profile"
						>
							<FaIcon
								icon={faGithub}
								className={styles.socialIcon}
							/>
						</a>
						<a
							href={socialObject?.linkedin || INFO.socials.linkedin}
							target="_blank"
							rel="noreferrer"
						>
							<FaIcon
								icon={faLinkedin}
								className={styles.socialIcon}
							/>
						</a>
						<a
							href={socialObject?.twitter || INFO.socials.twitter}
							target="_blank"
							rel="noreferrer"
						>
							<FaIcon
								icon={faTwitter}
								className={styles.socialIcon}
							/>
						</a>
						<a
							href={
								socialObject?.instagram || INFO.socials.instagram
							}
							target="_blank"
							rel="noreferrer"
						>
							<FaIcon
								icon={faInstagram}
								className={styles.socialIcon}
							/>
						</a>
						<a
							href={`mailto:${socialObject?.email || INFO.main.email}`}
							target="_blank"
							rel="noreferrer"
						>
							<FaIcon
								icon={faMailBulk}
								className={styles.socialIcon}
							/>
						</a>
					</nav>

					<footer className={layoutStyles.pageFooter}>
						<Footer user={user} />
					</footer>
				</div>
			</main>
		</div>
	);
}

export const homepageMetadata = {
	title: "Ankit Kaushal",
	description: SEO.find((item) => item.page === "home")?.description,
};
