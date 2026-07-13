export function slugify(text = "") {
	return text
		.toString()
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

export function stripHtml(html = "") {
	return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function makeExcerpt(content = "", maxLength = 160) {
	const text = stripHtml(content);
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trim()}...`;
}

export function getReadingMinutes(content = "", wordsPerMinute = 200) {
	const words = stripHtml(content)
		.split(/\s+/)
		.filter(Boolean).length;

	if (!words) return 1;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}
