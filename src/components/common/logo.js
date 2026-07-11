"use client";

import Link from "next/link";
import Image from "next/image";

import INFO from "@/data/user";

import styles from "./logo.module.css";

export default function Logo({ width, link, user = {} }) {
	const showLink = link !== false;
	const src = user?.logoUrl || INFO.main.logo;

	const imageElement = (
		<Image
			src={src}
			alt="logo"
			className={styles.logo}
			width={width}
			height={width}
			unoptimized
		/>
	);

	return showLink ? <Link href="/">{imageElement}</Link> : imageElement;
}
