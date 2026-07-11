"use client";

import Link from "next/link";

import styles from "./footer.module.css";

const FOOTER_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Projects", href: "/projects" },
	{ label: "Blogs", href: "/blogs" },
	{ label: "Contact", href: "/contact" },
];

export default function Footer({ user = {} }) {
	return (
		<div className={styles.footer}>
			<div className={styles.footerLinks}>
				<ul className={styles.footerNavLinkList}>
					{FOOTER_LINKS.map((link) => (
						<li
							key={link.href}
							className={styles.footerNavLinkItem}
						>
							<Link href={link.href}>{link.label}</Link>
						</li>
					))}
				</ul>
			</div>

			<div className={styles.footerCredits}>
				<div className={styles.footerCreditsText}>
					© {new Date().getFullYear()}{" "}
					{user?.name || "Ankit Kaushal"}. All Rights Reserved.
				</div>
			</div>
		</div>
	);
}
