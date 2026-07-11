"use client";

import { Textarea } from "uiplex";

export default function RichTextEditor({
	value,
	onChange,
	placeholder,
}) {
	return (
		<Textarea
			value={value}
			onChange={(event) => onChange(event.target.value)}
			placeholder={placeholder}
			rows={10}
		/>
	);
}
