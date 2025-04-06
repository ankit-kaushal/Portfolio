export const optimizeImage = (url, width, format = "webp") => {
	if (url.startsWith("http")) {
		return url;
	}

	return `${url}?w=${width}&fmt=${format}`;
};
