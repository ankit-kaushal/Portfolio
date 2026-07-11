"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

import styles from "./navBar.module.css";

const NAV_ITEMS = [
	{ id: "home", label: "Home", href: "/" },
	{ id: "about", label: "About", href: "/about" },
	{ id: "projects", label: "Projects", href: "/projects" },
	{ id: "blogs", label: "Blogs", href: "/blogs" },
	{ id: "contact", label: "Contact", href: "/contact" },
];

export default function NavBar({ active }) {
	const { toggleTheme, theme } = useTheme();

	return (
		<>
			<div className={styles.navContainer}>
				<nav className={styles.navbar}>
					<div className={styles.navBackground}>
						<ul className={styles.navList}>
							{NAV_ITEMS.map((item) => (
								<li
									key={item.id}
									className={`${styles.navItem} ${
										active === item.id
											? styles.navItemActive
											: ""
									}`}
								>
									<Link href={item.href}>{item.label}</Link>
								</li>
							))}
						</ul>
					</div>
				</nav>
			</div>
			<label id="switch" className={styles.switch}>
				<input
					type="checkbox"
					checked={theme === "dark"}
					onChange={toggleTheme}
					id="slider"
				/>
				<span className={`${styles.slider} ${styles.round}`} />
			</label>
		</>
	);
}
