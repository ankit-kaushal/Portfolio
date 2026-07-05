import Image from "next/image";

import Card from "@/components/common/card";

import styles from "./works.module.css";

function WorkItem({ item = {} }) {
	const {
		companyName = "",
		companyLogo = "",
		designation = "",
		workDuration = {},
	} = item || {};

	return (
		<div className={styles.work}>
			<Image
				src={companyLogo}
				alt={companyName}
				className={styles.workImage}
				width={30}
				height={30}
				unoptimized
			/>
			<div className={styles.workTitle}>{companyName}</div>
			<div className={styles.workSubtitle}>{designation}</div>
			<div className={styles.workDuration}>
				{workDuration?.start} - {workDuration?.end}
			</div>
		</div>
	);
}

export default function Works({ works = [] }) {
	return (
		<div className={styles.works}>
			<Card
				title="Work"
				body={
					<div className={styles.worksBody}>
						{works.length ? (
							works.map((item, index) => (
								<WorkItem key={index} item={item} />
							))
						) : (
							<>
								<div className={styles.work}>
									<Image
										src="/cogoport.jpeg"
										alt="Cogoport"
										className={styles.workImage}
										width={30}
										height={30}
									/>
									<div className={styles.workTitle}>
										Cogoport Pvt. Ltd.
									</div>
									<div className={styles.workSubtitle}>
										Software Development Engineer I
									</div>
									<div className={styles.workDuration}>
										Jan 2022 - Present
									</div>
								</div>

								<div className={styles.work}>
									<Image
										src="/kohli.jpeg"
										alt="Kohli Media LLP"
										className={styles.workImage}
										width={30}
										height={30}
									/>
									<div className={styles.workTitle}>
										Kohli Media LLP.
									</div>
									<div className={styles.workSubtitle}>
										Software Engineer
									</div>
									<div className={styles.workDuration}>
										June 2020 - Dec 2021
									</div>
								</div>
							</>
						)}
					</div>
				}
			/>
		</div>
	);
}
