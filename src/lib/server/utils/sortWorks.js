const MONTHS = {
	Jan: 0,
	Feb: 1,
	Mar: 2,
	Apr: 3,
	May: 4,
	Jun: 5,
	June: 5,
	Jul: 6,
	Aug: 7,
	Sept: 8,
	Sep: 8,
	Oct: 9,
	Nov: 10,
	Dec: 11,
};

function parseWorkDate(dateStr) {
	const [month, year] = dateStr.split(" ");
	return new Date(parseInt(year, 10), MONTHS[month]);
}

export function sortWorksByDate(works) {
	return [...works].sort(
		(a, b) =>
			parseWorkDate(b.workDuration.start) -
			parseWorkDate(a.workDuration.start),
	);
}
