import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import User from "@/lib/server/models/User";
import Work from "@/lib/server/models/Work";
import Project from "@/lib/server/models/Project";
import Friend from "@/lib/server/models/Friend";
import TravelJourney from "@/lib/server/models/TravelJourney";
import { sortWorksByDate } from "@/lib/server/utils/sortWorks";

const HF_API =
	"https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

const PERSONAL_CONTEXT = `I am Ankit Kaushal, a software developer. Here's your information:
- I am passionate about web development and creating innovative solutions
- My tech stack includes: JavaScript, React, Node.js, Express, MongoDB
- I have experience in Software Engineering
- I graduated from IIIT Kalyani with a Bachelor's degree in Computer Science
- My interests include Traveling, Cooking, and Swimming
- I am currently working as Frontend Developer at Silverlabs India Pvt Ltd
Remember to always respond as if you are Ankit speaking in first person.`;

async function getPersonalContext() {
	try {
		await connectDB();

		const [userData, workData, projectData, friendsData, travelData] =
			await Promise.all([
				User.findOne({}, { _id: 0, createdAt: 0, updatedAt: 0 }).sort({
					updatedAt: -1,
				}),
				Work.find(),
				Project.find().sort({ projectPublishDate: -1 }),
				Friend.find({}, { name: 1, about: 1, relation: 1, _id: 0 }),
				TravelJourney.find()
					.populate("buddies", "name")
					.sort({ "duration.startDate": -1 }),
			]);

		const sortedWorks = sortWorksByDate(workData);
		const currentWork = sortedWorks[0];
		const previousWorks = sortedWorks
			.slice(1)
			.map(
				(work) =>
					`${work.companyName} as ${work.designation} (${work.workDuration.start} - ${work.workDuration.end})`,
			)
			.join(", ");

		const projectsList = projectData
			.map(
				(project) =>
					`${project.projectName} (${project.projectDescription})`,
			)
			.join(", ");

		const friendsList = friendsData
			.filter((friend) => friend.relation === "Friend")
			.map((friend) => `${friend.name} (${friend.about})`)
			.join(", ");

		const travelList = travelData
			.map((journey) => {
				const buddiesList = journey.buddies.map((buddy) => buddy.name).join(", ");
				const travelDate = new Date(journey.duration.startDate).toLocaleDateString(
					"en-US",
					{ month: "long", year: "numeric" },
				);
				return `${journey.place} in ${travelDate}${buddiesList ? ` with ${buddiesList}` : ""}`;
			})
			.join("; ");

		return `I am ${userData.name}, a software developer. Here's my information:
            - ${userData.description}
            - My skills include: C, C++, HTML, CSS, JavaScript, Typescript, React, React Native, Node, SQL, Webflow
            - My current position: ${currentWork.designation} at ${currentWork.companyName} from ${currentWork.workDuration.start}
            - I graduated from IIIT Kalyani with a Bachelor's degree in Computer Science
            - My interests include Traveling, Cooking, and Swimming
            - I love traveling! Here are the places I've visited: ${travelList}
            - I am currently living in ${userData.currentLocation}
            - Earlier, I worked in ${previousWorks}
            - My projects include: ${projectsList}
            - My friends include: ${friendsList}
            Remember to always respond as if you are ${userData.name} speaking in first person.`;
	} catch {
		return PERSONAL_CONTEXT;
	}
}

export async function POST(request) {
	try {
		const { message } = await request.json();
		const context = await getPersonalContext();

		const response = await axios.post(
			HF_API,
			{
				inputs: `${context}\n\nUser: ${message}\nAnkit:`,
				parameters: {
					max_new_tokens: 250,
					temperature: 0.7,
					top_p: 0.9,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
				},
			},
		);

		const reply =
			response.data[0]?.generated_text?.split("Ankit:")[1]?.trim() ||
			"Sorry, I had trouble responding.";

		return NextResponse.json({ reply });
	} catch (error) {
		console.error(error.response?.data || error.message);
		return NextResponse.json(
			{ reply: "Something went wrong." },
			{ status: 500 },
		);
	}
}
