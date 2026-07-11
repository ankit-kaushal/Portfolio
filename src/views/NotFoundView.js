"use client";

import Link from "next/link";
import FaIcon from "@/components/common/FaIcon";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";

import NavBar from "@/components/common/navBar";
import Logo from "@/components/common/logo";
import layoutStyles from "@/components/layout/layout.module.css";

import styles from "./notFound.module.css";

export default function NotFoundView() {
	return (
		<div className={`${styles.notFound} ${layoutStyles.pageContent}`}>
			<NavBar />
			<div className={layoutStyles.contentWrapper}>
				<div className={styles.logoContainer}>
					<div className={styles.logo}>
						<Logo width={46} />
					</div>
				</div>
				<div className={styles.container}>
					<div className={styles.message}>
						<div className={styles.title}>
							Oops! <FaIcon icon={faFaceSadTear} />
						</div>
						<div className={styles.notFoundMessage}>
							We can&apos;t seem to find the page you&apos;re
							looking for.
							<br />
							The requested URL was not found on this server.
						</div>
						<Link href="/" className={styles.notFoundLink}>
							Go back to the home page
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
