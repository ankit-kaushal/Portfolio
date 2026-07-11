"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import FaIcon from "@/components/common/FaIcon";
import {
	faArrowLeft,
	faChevronDown,
	faChevronUp,
	faUpload,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Switch,
	DateTimePicker,
	Toast,
} from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import BlogEditor from "./BlogEditor";
import editorStyles from "./blogEditor.module.css";
import styles from "./blogFormPage.module.css";

const EMPTY_FORM = {
	title: "",
	slug: "",
	excerpt: "",
	content: "",
	coverImage: "",
	tags: "",
	published: true,
	publishedAt: new Date().toISOString().split("T")[0],
};

export default function BlogFormPage({ blogId = null }) {
	const router = useRouter();
	const coverInputRef = useRef(null);
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(Boolean(blogId));
	const [isSaving, setIsSaving] = useState(false);
	const [isCoverUploading, setIsCoverUploading] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const isEditMode = Boolean(blogId);

	useEffect(() => {
		if (!blogId) return;

		const fetchBlog = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(apiUrl(`/blogs/${blogId}`));
				const blog = response.data;
				setFormData({
					title: blog.title || "",
					slug: blog.slug || "",
					excerpt: blog.excerpt || "",
					content: blog.content || "",
					coverImage: blog.coverImage || "",
					tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
					published: blog.published !== false,
					publishedAt: blog.publishedAt
						? new Date(blog.publishedAt).toISOString().split("T")[0]
						: new Date().toISOString().split("T")[0],
				});
			} catch {
				Toast.error("Failed to load blog");
				router.push("/admin?section=blogs");
			} finally {
				setIsLoading(false);
			}
		};

		fetchBlog();
	}, [blogId, router]);

	const handleChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const toPayload = () => ({
		title: formData.title,
		slug: formData.slug,
		excerpt: formData.excerpt,
		content: formData.content,
		coverImage: formData.coverImage,
		tags: formData.tags
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean),
		published: formData.published,
		publishedAt: formData.publishedAt,
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		const plainContent = formData.content
			.replace(/<[^>]*>/g, " ")
			.replace(/&nbsp;/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		if (!formData.title.trim()) {
			Toast.error("Title is required");
			return;
		}

		if (!plainContent) {
			Toast.error("Write some content before saving");
			return;
		}

		setIsSaving(true);

		try {
			if (isEditMode) {
				await axios.patch(apiUrl(`/blogs/${blogId}`), toPayload(), {
					headers: getAuthHeaders(),
				});
				Toast.success("Blog updated successfully!");
			} else {
				await axios.post(apiUrl("/blogs"), toPayload(), {
					headers: getAuthHeaders(),
				});
				Toast.success("Blog added successfully!");
			}
			router.push("/admin?section=blogs");
		} catch (error) {
			Toast.error(
				error.response?.data?.error ||
					`Failed to ${isEditMode ? "update" : "add"} blog`,
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCoverUpload = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		setIsCoverUploading(true);
		try {
			const uploadData = new FormData();
			const blob = new Blob([file], { type: file.type });
			uploadData.append("file", blob, file.name);

			const response = await fetch(apiUrl("/upload"), {
				method: "POST",
				body: uploadData,
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.error || "Cover upload failed");
			}

			const data = await response.json();
			handleChange("coverImage", data.secure_url || data.url);
			Toast.success("Cover image uploaded");
		} catch (error) {
			Toast.error(error.message || "Failed to upload cover image");
		} finally {
			setIsCoverUploading(false);
		}
	};

	if (isLoading) {
		return (
			<div className={styles.page}>
				<div className={styles.loadingState}>Loading blog...</div>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<Link href="/admin?section=blogs" className={styles.backLink}>
						<FaIcon icon={faArrowLeft} />
						Back to blogs
					</Link>
					<span className={styles.pageTitle}>
						{isEditMode ? "Edit blog" : "New blog"}
					</span>
				</div>
				<div className={styles.headerRight}>
					<Switch
						checked={formData.published}
						onChange={(checked) => handleChange("published", checked)}
						label={formData.published ? "Published" : "Draft"}
					/>
					<Button
						type="submit"
						form="blogForm"
						variant="primary"
						colorScheme="green"
						loading={isSaving}
					>
						{isEditMode ? "Update" : "Publish"}
					</Button>
				</div>
			</header>

			<main className={styles.main}>
				<form id="blogForm" onSubmit={handleSubmit}>
					<input
						className={styles.titleField}
						value={formData.title}
						onChange={(e) => handleChange("title", e.target.value)}
						placeholder="Blog title"
						aria-label="Blog title"
					/>

					<section className={styles.editorSection}>
						<BlogEditor
							key={blogId || "new-blog"}
							value={formData.content}
							onChange={(html) => handleChange("content", html)}
							placeholder="Start writing — headings, code, quotes, images..."
							fullHeight
						/>
					</section>

					<section className={styles.settings}>
						<button
							type="button"
							className={styles.settingsToggle}
							onClick={() => setSettingsOpen((open) => !open)}
						>
							<span>Post settings</span>
							<FaIcon icon={settingsOpen ? faChevronUp : faChevronDown} />
						</button>

						{settingsOpen ? (
							<div className={styles.settingsBody}>
								<FormControl className={styles.fullWidthField}>
									<FormLabel>Excerpt</FormLabel>
									<Textarea
										value={formData.excerpt}
										onChange={(e) =>
											handleChange("excerpt", e.target.value)
										}
										placeholder="Short summary for the blogs list"
										rows={2}
									/>
								</FormControl>

								<FormControl className={styles.fullWidthField}>
									<FormLabel>Cover Image</FormLabel>
									<div className={editorStyles.coverRow}>
										{formData.coverImage ? (
											<img
												src={formData.coverImage}
												alt="Cover preview"
												className={editorStyles.coverPreview}
											/>
										) : null}
										<div className={editorStyles.coverActions}>
											<input
												ref={coverInputRef}
												type="file"
												accept="image/*"
												hidden
												onChange={handleCoverUpload}
											/>
											<Button
												type="button"
												variant="outline"
												size="sm"
												loading={isCoverUploading}
												onClick={() => coverInputRef.current?.click()}
											>
												<FaIcon icon={faUpload} />{" "}
												{isCoverUploading
													? "Uploading..."
													: formData.coverImage
														? "Replace cover"
														: "Upload cover"}
											</Button>
											{formData.coverImage ? (
												<Button
													type="button"
													variant="ghost"
													size="sm"
													colorScheme="red"
													onClick={() => handleChange("coverImage", "")}
												>
													<FaIcon icon={faTimes} /> Remove
												</Button>
											) : null}
										</div>
									</div>
									<Input
										value={formData.coverImage}
										onChange={(e) =>
											handleChange("coverImage", e.target.value)
										}
										placeholder="Or paste an image URL"
										style={{ marginTop: "0.75rem" }}
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Slug (optional)</FormLabel>
									<Input
										value={formData.slug}
										onChange={(e) => handleChange("slug", e.target.value)}
										placeholder="my-blog-post"
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Tags (comma separated)</FormLabel>
									<Input
										value={formData.tags}
										onChange={(e) => handleChange("tags", e.target.value)}
										placeholder="react, css, tips"
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Publish Date</FormLabel>
									<DateTimePicker
										mode="date"
										value={formData.publishedAt}
										onChange={(value) => handleChange("publishedAt", value)}
									/>
								</FormControl>
							</div>
						) : null}
					</section>
				</form>
			</main>
		</div>
	);
}
