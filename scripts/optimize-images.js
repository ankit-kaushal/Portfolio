const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImages = async () => {
	const imageDir = path.join(__dirname, "../public");
	const files = fs.readdirSync(imageDir);

	for (const file of files) {
		if (file.match(/\.(jpg|jpeg|png)$/i)) {
			await sharp(path.join(imageDir, file))
				.webp({ quality: 80 })
				.toFile(path.join(imageDir, `${file.split(".")[0]}.webp`));
		}
	}
};

optimizeImages();
