import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/articles/article";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import { useSelector } from "react-redux";
import ShootingStars from "../components/common/ShootingStars";

import "./styles/articles.css";

const Blogs = () => {
	const parser = new DOMParser();
	const data = useSelector((state) => state.data);

	const { user = {}, blogs = [] } = data || {};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "blogs");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Articles | ${user?.name || INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<ShootingStars />
				<NavBar active="blogs" />
				<div className="content-wrapper">
					<div className="articles-logo-container">
						<div className="articles-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="articles-main-container">
						<div className="title articles-title">
							{INFO.blogs.title}
						</div>

						<div className="subtitle articles-subtitle">
							{INFO.blogs.description}
						</div>

						<div className="articles-container">
							<div className="articles-wrapper">
								{blogs.length ? (
									<>
										{blogs?.map((blog, index) => {
											const doc = parser.parseFromString(
												blog.description,
												"text/html",
											);
											const firstParagraph =
												doc.querySelector("p");
											let description = firstParagraph
												? firstParagraph.textContent
												: "";
											const maxLength = 100;
											if (
												description.length > maxLength
											) {
												description =
													description.slice(
														0,
														maxLength,
													) + "...";
											}
											const firstImage =
												doc.querySelector("img");
											const imageUrl = firstImage
												? firstImage.getAttribute("src")
												: "";
											return (
												<div
													className="articles-article"
													key={blog.guid}
												>
													<Article
														key={blog.guid}
														date={blog.pubDate}
														title={blog.title}
														description={
															description
														}
														image={imageUrl}
														link={blog.link}
													/>
												</div>
											);
										})}
									</>
								) : (
									<>
										{myArticles.map((article, index) => (
											<div
												className="articles-article"
												key={(index + 1).toString()}
											>
												<Article
													key={(index + 1).toString()}
													date={article().date}
													title={article().title}
													description={
														article().description
													}
													link={article().link}
												/>
											</div>
										))}
									</>
								)}
							</div>
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

export default Blogs;
