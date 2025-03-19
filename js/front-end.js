import { getEmotion } from './open-ai.js';
import { sendMessage } from './firebase.js';
import { receiveMessage } from './firebase.js';

const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user");
const messageInput = document.getElementById("message");
const emotionContainer = document.getElementById("emotion-container");
const emotionSpan = document.getElementById("emotion");
const messagesContainer = document.getElementById("sent-messages-list");
const sentmessages = [];

const displayMessages = (user, mes, emotion) => {
	const textstring = `${user}: ${mes} (Emotion: ${emotion})`;
	sentmessages.push(textstring);
	messagesContainer.innerHTML = "";
	sentmessages.forEach((msg) => {
		const messageDiv = document.createElement("div");
		messageDiv.textContent = msg;
		messagesContainer.appendChild(messageDiv);
	});
};

const handleSendMessage = async () => {
	const user = userInput.value.trim();
	const message = messageInput.value.trim();
	
	if (!user || !message) {
		alert("Please enter both username and message.");
		return;
	}
	
	try {
		
		const response = await fetch("https://cmpm169-worker.valdenornathan.workers.dev", { 
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message })
		});
	
		const data = await response.json();
		const emotion = data.emotion; // Get the emotion from Cloudflare Worker
	
		emotionSpan.textContent = emotion;
		emotionContainer.classList.remove("hidden");
	
		await sendMessage(user, message, emotion);
		displayMessages(user, message, emotion);
	
		messageInput.value = "";
	
		const activeScene = game.scene.getScene('GalleryScene'); 
		activeScene.events.emit('buttonClicked', { message: emotion });
	
	} catch (error) {
		console.error("Error:", error);
		alert("There was an error processing the message.");
	}
	};
	
	sendButton.addEventListener("click", handleSendMessage);
	receiveMessage(); // Continue receiving messages as before
	

