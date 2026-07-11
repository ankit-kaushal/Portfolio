"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import FaIcon from "@/components/common/FaIcon";
import {
	faBold,
	faItalic,
	faUnderline,
	faStrikethrough,
	faHeading,
	faListUl,
	faListOl,
	faQuoteLeft,
	faCode,
	faLink,
	faImage,
	faParagraph,
	faUndo,
	faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import styles from "./blogEditor.module.css";

async function uploadToCloudinary(file) {
	const formData = new FormData();
	const blob = new Blob([file], { type: file.type });
	formData.append("file", blob, file.name);

	const response = await fetch(apiUrl("/upload"), {
		method: "POST",
		body: formData,
		headers: getAuthHeaders(),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.error || "Upload failed");
	}

	const data = await response.json();
	return data.secure_url || data.url;
}

function ToolbarButton({ onClick, active, disabled, label, icon }) {
	return (
		<button
			type="button"
			className={`${styles.toolbarBtn} ${active ? styles.active : ""}`}
			onClick={onClick}
			disabled={disabled}
			title={label}
			aria-label={label}
		>
			{icon ? <FaIcon icon={icon} /> : label}
		</button>
	);
}

export default function BlogEditor({
	value = "",
	onChange,
	placeholder = "Start writing your blog...",
	fullHeight = false,
}) {
	const fileInputRef = useRef(null);
	const uploadHandlerRef = useRef(null);
	const [uploading, setUploading] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
			}),
			Underline,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					rel: "noopener noreferrer",
					target: "_blank",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class: styles.editorImage,
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value || "",
		immediatelyRender: false,
		onUpdate: ({ editor: currentEditor }) => {
			onChange?.(currentEditor.getHTML());
		},
		editorProps: {
			attributes: {
				class: fullHeight ? `${styles.prose} ${styles.proseFull}` : styles.prose,
			},
			handleDrop: (_view, event, _slice, moved) => {
				if (moved || !event.dataTransfer?.files?.length) return false;
				const file = event.dataTransfer.files[0];
				if (!file?.type?.startsWith("image/")) return false;
				event.preventDefault();
				uploadHandlerRef.current?.(file);
				return true;
			},
			handlePaste: (_view, event) => {
				const items = event.clipboardData?.items;
				if (!items) return false;
				for (const item of items) {
					if (item.type.startsWith("image/")) {
						const file = item.getAsFile();
						if (file) {
							event.preventDefault();
							uploadHandlerRef.current?.(file);
							return true;
						}
					}
				}
				return false;
			},
		},
	});

	const handleImageFile = useCallback(
		async (file) => {
			if (!editor || !file) return;
			setUploading(true);
			try {
				const url = await uploadToCloudinary(file);
				editor.chain().focus().setImage({ src: url, alt: file.name }).run();
			} catch (error) {
				console.error(error);
				alert(error.message || "Image upload failed");
			} finally {
				setUploading(false);
			}
		},
		[editor],
	);

	useEffect(() => {
		uploadHandlerRef.current = handleImageFile;
	}, [handleImageFile]);

	useEffect(() => {
		if (!editor) return;
		const current = editor.getHTML();
		const next = value || "";
		if (next !== current) {
			editor.commands.setContent(next, { emitUpdate: false });
		}
	}, [editor, value]);

	const insertImage = () => {
		fileInputRef.current?.click();
	};

	const onFileChange = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (file) await handleImageFile(file);
	};

	const setLink = () => {
		if (!editor) return;
		const previous = editor.getAttributes("link").href || "";
		const url = window.prompt("Enter URL", previous);
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url })
			.run();
	};

	if (!editor) {
		return <div className={styles.loading}>Loading editor...</div>;
	}

	return (
		<div
			className={`${styles.editorShell} ${
				fullHeight ? styles.editorShellFull : ""
			}`}
		>
			<div className={styles.toolbar}>
				<div className={styles.toolbarGroup}>
					<ToolbarButton
						label="Undo"
						icon={faUndo}
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
					/>
					<ToolbarButton
						label="Redo"
						icon={faRedo}
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
					/>
				</div>

				<div className={styles.toolbarGroup}>
					<ToolbarButton
						label="Paragraph"
						icon={faParagraph}
						active={editor.isActive("paragraph")}
						onClick={() => editor.chain().focus().setParagraph().run()}
					/>
					<ToolbarButton
						label="Heading 1"
						icon={faHeading}
						active={editor.isActive("heading", { level: 1 })}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					/>
					<button
						type="button"
						className={`${styles.toolbarBtn} ${
							editor.isActive("heading", { level: 2 }) ? styles.active : ""
						}`}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						title="Heading 2"
					>
						H2
					</button>
					<button
						type="button"
						className={`${styles.toolbarBtn} ${
							editor.isActive("heading", { level: 3 }) ? styles.active : ""
						}`}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						title="Heading 3"
					>
						H3
					</button>
				</div>

				<div className={styles.toolbarGroup}>
					<ToolbarButton
						label="Bold"
						icon={faBold}
						active={editor.isActive("bold")}
						onClick={() => editor.chain().focus().toggleBold().run()}
					/>
					<ToolbarButton
						label="Italic"
						icon={faItalic}
						active={editor.isActive("italic")}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					/>
					<ToolbarButton
						label="Underline"
						icon={faUnderline}
						active={editor.isActive("underline")}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					/>
					<ToolbarButton
						label="Strike"
						icon={faStrikethrough}
						active={editor.isActive("strike")}
						onClick={() => editor.chain().focus().toggleStrike().run()}
					/>
					<ToolbarButton
						label="Inline code"
						icon={faCode}
						active={editor.isActive("code")}
						onClick={() => editor.chain().focus().toggleCode().run()}
					/>
				</div>

				<div className={styles.toolbarGroup}>
					<ToolbarButton
						label="Bullet list"
						icon={faListUl}
						active={editor.isActive("bulletList")}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					/>
					<ToolbarButton
						label="Numbered list"
						icon={faListOl}
						active={editor.isActive("orderedList")}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					/>
					<ToolbarButton
						label="Quote / comment"
						icon={faQuoteLeft}
						active={editor.isActive("blockquote")}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					/>
					<button
						type="button"
						className={`${styles.toolbarBtn} ${
							editor.isActive("codeBlock") ? styles.active : ""
						}`}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						title="Code block"
					>
						{"</>"}
					</button>
				</div>

				<div className={styles.toolbarGroup}>
					<ToolbarButton
						label="Link"
						icon={faLink}
						active={editor.isActive("link")}
						onClick={setLink}
					/>
					<ToolbarButton
						label={uploading ? "Uploading..." : "Insert image"}
						icon={faImage}
						onClick={insertImage}
						disabled={uploading}
					/>
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				hidden
				onChange={onFileChange}
			/>

			<div
				className={`${styles.editorBody} ${
					fullHeight ? styles.editorBodyFull : ""
				}`}
				style={
					fullHeight
						? { minHeight: "calc(100vh - 220px)" }
						: undefined
				}
			>
				<EditorContent editor={editor} />
				{uploading && (
					<div className={styles.uploadOverlay}>
						Uploading image to Cloudinary...
					</div>
				)}
			</div>
		</div>
	);
}
