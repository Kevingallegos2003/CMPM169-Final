import { getEmotion } from './open-ai.js';

const firebaseConfig = {
	apiKey: "",
	authDomain: "cmpm169-final.firebaseapp.com",
	projectId: "cmpm169-final",
	storageBucket: "cmpm169-final.firebasestorage.app",
	messagingSenderId: "900631031086",
	appId: "1:900631031086:web:3ea41379ebc3ced6cb5ebf"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Send message to Firebase
export const sendMessage = async (user, message) => {
	
	const emotion = await getEmotion(message);

	try {

		await db.collection("cmpm169-final").add({
			user: user,
			message: message,
			emotion: emotion,
			timestamp: firebase.firestore.Timestamp.now()
		});

		console.log("Message sent successfully!");

	} catch (e) {

		console.error("Error sending message:", e);

	}

}

export const receiveMessage = async () => {
	
	db.collection("cmpm169-final")
		.orderBy("timestamp", "asc")
		.onSnapshot((snapshot) => {
			const messages = [];
			snapshot.forEach(doc => {
				const data = doc.data();
				messages.push(data);
			});

			displayMessages(messages);
		}, (error) => {
			console.error("Error receiving messages:", error);
		});
}

const displayMessages = (messages) => {
	const messagesContainer = document.getElementById("messages-container");
	messagesContainer.innerHTML = "";
	const activeScene = game.scene.getScene('GalleryScene'); 

	messages.forEach((msg) => {
		const messageDiv = document.createElement("div");
		
		const nameDiv = document.createElement("div");
		const usernameBox = document.createElement("div");
		usernameBox.classList.add("username-message");
		usernameBox.textContent = `${msg.user}` 
		nameDiv.appendChild(usernameBox);
		messageDiv.appendChild(nameDiv);

		const messageBox = document.createElement("div");
		messageBox.classList.add("single-message");
		messageBox.innerHTML = `${msg.message} (${msg.emotion})`;
    	activeScene.events.emit('displayedMessage', { message1: msg.emotion });
		messageDiv.appendChild(messageBox);

		messagesContainer.appendChild(messageDiv);
	});
}