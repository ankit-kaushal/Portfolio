"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Safe wrapper around FontAwesomeIcon.
 * The underlying component crashes when `className` is omitted
 * because it calls className.split(' ') without a default.
 */
export default function FaIcon({ className = "", ...props }) {
	return <FontAwesomeIcon className={className} {...props} />;
}
