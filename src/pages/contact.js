import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import { useSelector } from 'react-redux';

import "./styles/contact.css";

const Contact = () => {
	const data = useSelector((state) => state.data);

	const { user = {} } = data || {};
	
	const social = user?.social?.reduce((acc, curr) => {
		acc[curr.name] = curr.url;
		return acc;
	}, {});




	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

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
							Let's Get in Touch ☎️
						</div>

						<div className="subtitle contact-subtitle">
							I'm thrilled that you want to get in touch with me.
							Whether you have a question, a project proposal, 
							or just want to say hello, I'd love to hear from you. 
							If you have a specific question or
							comment, please feel free to email me directly at
							&nbsp;{" "}
							<a href={`mailto:${social?.email || INFO.main.email}`} className="contact-link">
								{social?.email || INFO.main.email}
							</a>
							.Finally, if you prefer to connect on
							social media, you can find me on{" "}
							<a
								href={social?.instagram || INFO.socials.instagram}
								target="_blank"
								rel="noreferrer"
								className="contact-link"
							>
								{social?.instagram || INFO.socials.instagram}
							</a>
							.
							Thanks again for your interest, and I look forward
							to hearing from you!
						</div>
					</div>

					<div className="socials-container">
						<div className="contact-socials">
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

export default Contact;
