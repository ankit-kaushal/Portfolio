import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Homepage from "./pages/homepage";
import About from "./pages/about";
import Projects from "./pages/projects";
import Blogs from "./pages/blogs";
import Contact from "./pages/contact";
import Notfound from "./pages/404";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from './requests/actions';
import { ThemeProvider } from "./components/context/themeContext";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";

function App() {
	const loading = useSelector(state => state.loading);
	
	const dispatch = useDispatch();

	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
		  dispatch(fetchDataRequest());
		  try {
			const response = await axios.get('https://www.pi.ankitkaushal.tech/profile');
			dispatch(fetchDataSuccess(response.data));
		  } catch (error) {
			dispatch(fetchDataFailure(error.message));
		  }
		};
	
		fetchData();
	  }, [dispatch]);

	if (loading) {
		return (
			<div class="loading-wrap">
				<div>
					<div class="bounceball"></div>
					<div class="loading-text">PORTFOLIO LOADING...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="App">
			<ThemeProvider>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/about" element={<About />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/blogs" element={<Blogs />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
			</ThemeProvider>
		</div>
	);
}

export default App;
