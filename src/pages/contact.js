import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import emailjs from "@emailjs/browser";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from "react-redux";

import "./styles/contact.css";

const Contact = () => {
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

	const currentSEO = SEO.find((item) => item.page === "contact");

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
				process.env.REACT_APP_EMAILJS_SERVICE_ID,
				process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
				{
					name: formData.name,
					email: formData.email,
					message: formData.message,
				},
				process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
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
		<React.Fragment>
			<Helmet>
				<title>{`Contact | ${user?.name || INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />
				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={46} user={user} />
						</div>
					</div>

					<div className="contact-container">
						<div className="title contact-title">
							Let&apos;s Get in Touch ☎️
						</div>

						<div className="subtitle contact-subtitle">
							I&apos;m thrilled that you want to get in touch with
							me. Whether you have a question, a project proposal,
							or just want to say hello, I&apos;d love to hear
							from you. If you have a specific question or
							comment, please feel free to email me directly at
							&nbsp;{" "}
							<a
								href={`mailto:${social?.email || INFO.main.email}`}
								className="contact-link"
							>
								{social?.email || INFO.main.email}
							</a>
							.Finally, if you prefer to connect on social media,
							you can find me on{" "}
							<a
								href={
									social?.instagram || INFO.socials.instagram
								}
								target="_blank"
								rel="noreferrer"
								className="contact-link"
							>
								{social?.instagram || INFO.socials.instagram}
							</a>
							. Thanks again for your interest, and I look forward
							to hearing from you!
						</div>
					</div>

					<div className="flex-container">
						<div className="socials-container">
							<div className="contact-socials">
								<Socials social={social} />
							</div>
						</div>

						<form onSubmit={handleSubmit} className="contact-form">
							<div className="form-group">
								<input
									type="text"
									name="name"
									placeholder="Your Name"
									value={formData.name}
									onChange={handleChange}
									required
									className="form-input"
								/>
							</div>
							<div className="form-group">
								<input
									type="email"
									name="email"
									placeholder="Your Email"
									value={formData.email}
									onChange={handleChange}
									required
									className="form-input"
								/>
							</div>
							<div className="form-group">
								<textarea
									name="message"
									placeholder="Your Message"
									value={formData.message}
									onChange={handleChange}
									required
									className="form-textarea"
								/>
							</div>
							<button
								type="submit"
								className="submit-button"
								disabled={status === "sending"}
							>
								{status === "sending"
									? "Sending..."
									: "Send Message"}
							</button>
							{status === "success" && (
								<p className="success-message">
									Message sent successfully!
								</p>
							)}
							{status === "error" && (
								<p className="error-message">
									Failed to send message. Please try again.
								</p>
							)}
						</form>
					</div>

					<div className="page-footer">
						<Footer user={user} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Contact;
