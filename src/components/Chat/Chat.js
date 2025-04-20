import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";

const Chat = () => {
	const messagesEndRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [chatHistory, setChatHistory] = useState(() => {
		const savedChats = localStorage.getItem("chatHistory");
		return savedChats
			? JSON.parse(savedChats)
			: [
					{
						text: "Hi there👋 , I am Ankit, you can ask anything about me",
						sender: "bot",
					},
				];
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
	}, [chatHistory]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		const userMessage = { text: message, sender: "user" };
		setChatHistory([...chatHistory, userMessage]);
		setMessage("");
		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				"https://www.api.ankitkaushal.in/chat",
				{
					message: message,
				},
			);
			setChatHistory((prev) => [
				...prev,
				{ text: response.data.reply, sender: "bot" },
			]);
		} catch (error) {
			setError("Failed to send message. Please try again.");
			console.error("Chat error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRetry = async () => {
		setError(null);
		setIsLoading(true);

		const lastUserMessage = chatHistory.findLast(
			(msg) => msg.sender === "user",
		);
		if (!lastUserMessage) return;

		try {
			const response = await axios.post(
				"https://www.api.ankitkaushal.in/chat",
				{
					message: lastUserMessage.text,
				},
			);
			setChatHistory((prev) => [
				...prev,
				{ text: response.data.reply, sender: "bot" },
			]);
		} catch (error) {
			setError("Failed to send message. Please try again.");
			console.error("Chat error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (isOpen) {
			scrollToBottom();
		}
	}, [isOpen, chatHistory]);

	return (
		<div className={`chat-widget ${isOpen ? "open" : ""}`}>
			<button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
				<FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
			</button>
			{isOpen && (
				<div className="chat-container">
					<div className="chat-messages">
						{chatHistory.map((msg, index) => (
							<div
								key={index}
								className={`message ${msg.sender}`}
							>
								{msg.text}
							</div>
						))}
						{isLoading && (
							<div className="loading-indicator">
								<div className="typing-dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						)}
						{error && (
							<div className="error-message">
								<span>{error}</span>
								<button
									onClick={handleRetry}
									className="retry-button"
									aria-label="Retry sending message"
								>
									<FontAwesomeIcon icon={faRedo} /> Retry
								</button>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type a message..."
						/>
						<button type="submit" disabled={isLoading}>
							Send
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Chat;
