"use client";

import { useState } from "react";
import axios from "axios";
import { Box, Text, Alert } from "uiplex";
import { apiUrl, getAuthHeaders } from "@/lib/api";
import AdminProvider from "./AdminProvider";
import OTPInput from "./OTPInput";
import { useAdminSession } from "../hooks/useAdminSession";
import styles from "../admin.module.css";

export default function AdminAuthGate({ children }) {
	const { isAuthenticated, isSessionChecked, login } = useAdminSession();
	const [error, setError] = useState("");

	const handleOTPComplete = async (code) => {
		try {
			const response = await axios.post(
				apiUrl("/validate"),
				{ token: code },
				{ headers: getAuthHeaders() },
			);

			if (response.status === 200) {
				login();
				setError("");
			}
		} catch {
			setError("Invalid authentication code");
		}
	};

	if (!isSessionChecked) {
		return null;
	}

	if (!isAuthenticated) {
		return (
			<AdminProvider>
				<Box className={`${styles.adminRoot} ${styles.loginPage}`}>
					<Box className={styles.loginCard}>
						<Text className={styles.loginTitle}>Admin Login</Text>
						<Text className={styles.loginText}>
							Enter the 6-digit code from your authenticator app
						</Text>
						{error && (
							<Box marginBottom="1rem">
								<Alert variant="error">{error}</Alert>
							</Box>
						)}
						<OTPInput onComplete={handleOTPComplete} />
					</Box>
				</Box>
			</AdminProvider>
		);
	}

	return <AdminProvider>{children}</AdminProvider>;
}
