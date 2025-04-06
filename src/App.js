import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import React, { Suspense, lazy } from "react";

import Homepage from "./pages/homepage";
import About from "./pages/about";
import Projects from "./pages/projects";
import Blogs from "./pages/blogs";
import Contact from "./pages/contact";
import Notfound from "./pages/404";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
	fetchDataRequest,
	fetchDataSuccess,
	fetchDataFailure,
	fetchHomeDataSuccess,
} from "./requests/actions";
import { ThemeProvider } from "./components/context/themeContext";
import { useLocation } from "react-router-dom";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";

const TravelJourney = lazy(() => import("./pages/TravelJourney"));
const JourneyDetail = lazy(() => import("./pages/JourneyDetail"));

const EXCLUDED_PATHS = ["/journey", "/travel-journey"];
import Chat from "./components/Chat/Chat";

function App() {
	const loading = useSelector((state) => state.loading);
	const dispatch = useDispatch();
	const location = useLocation();
	const hasFetched = useRef(false);

	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	useEffect(() => {
		const isExcludedPath =
			EXCLUDED_PATHS.includes(location.pathname) ||
			location.pathname.startsWith("/journey/");

		if (isExcludedPath || hasFetched.current) return;

		const fetchData = async () => {
			dispatch(fetchDataRequest());
			try {
				if (location.pathname === "/") {
					const homeResponse = await axios.get(
						"https://www.api.ankitkaushal.in.net/home",
					);
					dispatch(fetchHomeDataSuccess(homeResponse.data));
					dispatch(fetchDataRequest(false));
					const profileResponse = await axios.get(
						"https://www.api.ankitkaushal.in.net/profile",
					);
					dispatch(fetchDataSuccess(profileResponse.data));
				} else {
					const profileResponse = await axios.get(
						"https://www.api.ankitkaushal.in.net/profile",
					);
					dispatch(fetchDataSuccess(profileResponse.data));
					dispatch(fetchDataRequest(false));
					const homeResponse = await axios.get(
						"https://www.api.ankitkaushal.in.net/home",
					);
					dispatch(fetchHomeDataSuccess(homeResponse.data));
				}
				hasFetched.current = true;
			} catch (error) {
				dispatch(fetchDataFailure(error.message));
			}
		};

		fetchData();
	}, [dispatch, location.pathname]);

	if (loading) {
		return (
			<div className="loading-wrap">
				<div>
					<div className="bounceball"></div>
					<div className="loading-text">PORTFOLIO LOADING...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="App">
			<ThemeProvider>
				<Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="/about" element={<About />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/blogs" element={<Blogs />} />
						<Route path="/contact" element={<Contact />} />
						<Route
							path="/travel-journey"
							element={<TravelJourney />}
						/>
						<Route
							path="/journey/:id"
							element={<JourneyDetail />}
						/>
						<Route path="*" element={<Notfound />} />
					</Routes>
					<Chat />
				</Suspense>
			</ThemeProvider>
		</div>
	);
}

export default App;
