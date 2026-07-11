"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactGA from "react-ga4";

import {
	fetchDataRequest,
	fetchDataSuccess,
	fetchDataFailure,
	fetchHomeDataSuccess,
} from "@/lib/actions";
import { TRACKING_ID } from "@/data/tracking";
import layoutStyles from "@/components/layout/layout.module.css";

const EXCLUDED_PATHS = ["/journey", "/travel-journey"];

export default function AppInitializer({ children }) {
	const loading = useSelector((state) => state.loading);
	const dispatch = useDispatch();
	const pathname = usePathname();
	const hasFetched = useRef(false);

	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID, {
				gaOptions: {
					siteSpeedSampleRate: 100,
				},
			});
		}
	}, []);

	useEffect(() => {
		const isExcludedPath =
			EXCLUDED_PATHS.includes(pathname) ||
			pathname.startsWith("/journey/");

		if (isExcludedPath || hasFetched.current) return;

		let isSubscribed = true;
		const controller = new AbortController();

		const loadPortfolioData = async () => {
			dispatch(fetchDataRequest());
			try {
				const response = await axios.get("/data.json", {
					signal: controller.signal,
					headers: {
						"Cache-Control": "no-cache",
					},
				});
				if (!isSubscribed) return;

				const portfolio = response.data || {};
				const homeUser = portfolio.user || portfolio;

				dispatch(fetchHomeDataSuccess(homeUser));
				dispatch(fetchDataSuccess(portfolio));
				hasFetched.current = true;
			} catch (error) {
				if (!isSubscribed) return;
				if (axios.isCancel(error)) {
					console.log("Request canceled");
				} else {
					dispatch(fetchDataFailure(error.message));
				}
			}
		};

		loadPortfolioData();

		return () => {
			isSubscribed = false;
			controller.abort();
		};
	}, [dispatch, pathname]);

	if (loading) {
		return (
			<div
				className={layoutStyles.loadingWrap}
				role="alert"
				aria-busy="true"
				aria-label="Loading content"
			>
				<div>
					<div className={layoutStyles.bounceball} aria-hidden="true" />
					<div className={layoutStyles.loadingText}>
						PORTFOLIO LOADING...
					</div>
				</div>
			</div>
		);
	}

	return children;
}
