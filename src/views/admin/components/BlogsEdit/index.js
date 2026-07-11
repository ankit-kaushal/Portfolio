"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import FaIcon from "@/components/common/FaIcon";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
	IconButton,
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Badge,
	Toast,
	Text,
	Flex,
	Skeleton,
} from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import AdminSectionHeader from "../shared/AdminSectionHeader";
import ConfirmModal from "../shared/ConfirmModal";
import styles from "../../admin.module.css";

const BlogsEdit = () => {
	const router = useRouter();
	const [blogs, setBlogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	useEffect(() => {
		fetchBlogs();
	}, []);

	const fetchBlogs = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(apiUrl("/blogs?all=true"));
			setBlogs(response.data);
		} catch (error) {
			console.error("Error fetching blogs:", error);
			Toast.error("Failed to load blogs");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(apiUrl(`/blogs/${deleteId}`), {
				headers: getAuthHeaders(),
			});
			setBlogs((prev) => prev.filter((blog) => blog._id !== deleteId));
			Toast.success("Blog deleted successfully!");
			setShowDeleteModal(false);
		} catch (error) {
			Toast.error(error.response?.data?.error || "Failed to delete blog");
		}
	};

	return (
		<>
			<AdminSectionHeader
				title="All Blogs"
				description={`${blogs.length} blog${blogs.length === 1 ? "" : "s"} on your website`}
				actionLabel="Add Blog"
				onAction={() => router.push("/admin/blogs/new")}
				actionIcon={<FaIcon icon={faPlus} />}
			/>

			<div className={styles.projectGrid}>
				{isLoading
					? Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} variant="rectangular" height={220} />
						))
					: blogs.map((blog) => (
							<Card key={blog._id}>
								{blog.coverImage && (
									<img
										src={blog.coverImage}
										alt={blog.title}
										className={styles.projectCardImage}
									/>
								)}
								<CardBody>
									<Flex
										align="start"
										justify="between"
										gap="0.75rem"
										style={{ marginBottom: "0.5rem" }}
									>
										<Flex direction="column" gap="0.25rem">
											<CardTitle>{blog.title}</CardTitle>
											<CardSubtitle>/{blog.slug}</CardSubtitle>
										</Flex>
										<Badge
											variant={blog.published ? "success" : "warning"}
											size="sm"
										>
											{blog.published ? "Published" : "Draft"}
										</Badge>
									</Flex>

									<Text size="sm" variant="muted">
										{blog.excerpt || "No excerpt"}
									</Text>

									<div className={styles.projectCardActions}>
										<IconButton
											icon={<FaIcon icon={faEdit} />}
											variant="ghost"
											aria-label="Edit blog"
											onClick={() =>
												router.push(`/admin/blogs/${blog._id}/edit`)
											}
										/>
										<IconButton
											icon={<FaIcon icon={faTrash} />}
											variant="ghost"
											colorScheme="red"
											aria-label="Delete blog"
											onClick={() => {
												setDeleteId(blog._id);
												setShowDeleteModal(true);
											}}
										/>
									</div>
								</CardBody>
							</Card>
						))}
			</div>

			{!isLoading && blogs.length === 0 && (
				<Text size="sm" variant="muted">
					No blogs yet. Create your first one.
				</Text>
			)}

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				title="Delete Blog"
				message="Are you sure you want to delete this blog?"
				confirmLabel="Delete"
			/>
		</>
	);
};

export default BlogsEdit;
