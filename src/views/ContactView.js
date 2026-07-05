"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";

import NavBar from "@/components/common/navBar";
import Footer from "@/components/common/footer";
import Logo from "@/components/common/logo";
import Socials from "@/components/about/socials";
import ShootingStars from "@/components/common/ShootingStars";
import layoutStyles from "@/components/layout/layout.module.css";
import INFO from "@/data/user";

import styles from "./contact.module.css";

export default function ContactView() {
	const data = useSelector((state) => state.data);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState("");

	const { user = {} } = data || {};

	const social = user?.social?.reduce((acc, curr) => {
		acc[curr.name] = curr.url;
		return acc;
	}, {});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setStatus("sending");

		emailjs
			.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
				{
					name: formData.name,
					email: formData.email,
					message: formData.message,
				},
				process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
			)
			.then(() => {
				setStatus("success");
				setFormData({ name: "", email: "", message: "" });
			})
			.catch((error) => {
				console.error("error", error);
				setStatus("error");
			});
	};

	return (
		<div className={layoutStyles.pageContent}>
			<ShootingStars />
			<NavBar active="contact" />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} user={user} />
					</div>
				</div>

				<div className={styles.container}>
					<div className={layoutStyles.title}>
						Let&apos;s Get in Touch ☎️
					</div>
					<div
						className={`${layoutStyles.subtitle} ${styles.contactSubtitle}`}
					>
						I&apos;m thrilled that you want to get in touch with
						me. Whether you have a question, a project proposal, or
						just want to say hello, I&apos;d love to hear from you.
						If you have a specific question or comment, please feel
						free to email me directly at{" "}
						<a
							href={`mailto:${social?.email || INFO.main.email}`}
							className={styles.contactLink}
						>
							{social?.email || INFO.main.email}
						</a>
						. Finally, if you prefer to connect on social media,
						you can find me on{" "}
						<a
							href={
								social?.instagram || INFO.socials.instagram
							}
							target="_blank"
							rel="noreferrer"
							className={styles.contactLink}
						>
							{social?.instagram || INFO.socials.instagram}
						</a>
						. Thanks again for your interest, and I look forward
						to hearing from you!
					</div>
				</div>

				<div className={styles.flexContainer}>
					<div className={styles.socialsContainer}>
						<div className={styles.contactSocials}>
							<Socials social={social} />
						</div>
					</div>

					<form onSubmit={handleSubmit} className={styles.contactForm}>
						<div className={styles.formGroup}>
							<input
								type="text"
								name="name"
								placeholder="Your Name"
								value={formData.name}
								onChange={handleChange}
								required
								className={styles.formInput}
							/>
						</div>
						<div className={styles.formGroup}>
							<input
								type="email"
								name="email"
								placeholder="Your Email"
								value={formData.email}
								onChange={handleChange}
								required
								className={styles.formInput}
							/>
						</div>
						<div className={styles.formGroup}>
							<textarea
								name="message"
								placeholder="Your Message"
								value={formData.message}
								onChange={handleChange}
								required
								className={styles.formTextarea}
							/>
						</div>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={status === "sending"}
						>
							{status === "sending"
								? "Sending..."
								: "Send Message"}
						</button>
						{status === "success" && (
							<p className={styles.successMessage}>
								Message sent successfully!
							</p>
						)}
						{status === "error" && (
							<p className={styles.errorMessage}>
								Failed to send message. Please try again.
							</p>
						)}
					</form>
				</div>

				<div className={layoutStyles.pageFooter}>
					<Footer user={user} />
				</div>
			</div>
		</div>
	);
}
