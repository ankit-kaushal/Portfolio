import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/articles/article";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import { useSelector } from 'react-redux';

import "./styles/articles.css";

const Blogs = () => {
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
							{blogs.length ? 
								<>
									{blogs?.map((blog, index) => (
										<div
											className="articles-article"
											key={blog._id}
										>
											<Article
												key={blog._id}
												date={blog.blogPublishDate}
												title={blog.blogTitle}
												description={blog.blogDescription}
												link={blog.blogUrl}
											/>
										</div>
									))}
								</> : 
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
												description={article().description}
												link={article().link}
											/>
										</div>
									))}
								</>
							}
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
