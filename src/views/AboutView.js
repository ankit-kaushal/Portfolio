"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import Socials from "@/components/about/socials";
import Works from "@/components/homepage/works";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import INFO from "@/data/user";

import styles from "./about.module.css";

export default function AboutView() {
	const [loadingImage, setLoadingImage] = useState(true);
	const [imageSrc, setImageSrc] = useState("");

	const data = useSelector((state) => state.data);
	const { user = {}, works = [] } = data || {};

	const social = user?.social?.reduce((acc, curr) => {
		acc[curr.name] = curr.url;
		return acc;
	}, {});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const img = new window.Image();
		img.src = `${user?.pictureUrl?.about || "/my-pic.jpg"}`;
		img.onload = () => {
			setImageSrc(img.src);
			setLoadingImage(false);
		};
	}, [user?.pictureUrl?.about]);

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="about" />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} user={user} />
					</div>
				</div>

				<div className={styles.container}>
					<div className={styles.main}>
						<div className={styles.rightSide}>
							<h1
								className={`${layoutStyles.title} ${styles.aboutTitle}`}
							>
								{user?.aboutTitle || INFO.about.title}
							</h1>
							<p
								className={`${layoutStyles.subtitle} ${styles.aboutSubtitle}`}
							>
								{user?.aboutDescription ||
									INFO.about.description}
							</p>
						</div>

						<div className={styles.leftSide}>
							<div className={styles.imageContainer}>
								{loadingImage ? (
									<div
										className={styles.imageWrapperLoading}
									/>
								) : (
									<div className={styles.imageWrapper}>
										<div
											className={styles.imageWrapCircle}
										/>
										<Image
											src={imageSrc}
											alt="about"
											className={styles.image}
											width={370}
											height={370}
											unoptimized
										/>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className={styles.afterTitle}>
						<div className={styles.aboutWorks}>
							<Works works={works} />
						</div>
						<div className={styles.aboutSocials}>
							<Socials social={social} />
						</div>
					</div>
					<div className={styles.aboutSocialsMobile}>
						<Socials social={social} />
					</div>
				</div>
				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
