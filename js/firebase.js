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

// Clear messages from Firebase
export const clearMessages = async () => {
    try {
        const snapshot = await db.collection("cmpm169-final").get();

        const batch = db.batch();
        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("All messages cleared successfully!");

    } catch (e) {
        console.error("Error clearing messages:", e);
    }
};

export const receiveMessage = async () => {
	
	db.collection("cmpm169-final")
		.orderBy("timestamp", "asc")
		.onSnapshot((snapshot) => {
			const messages = [];
			snapshot.forEach(doc => {
				const data = doc.data();
				data.id = doc.id; // Add Firestore's document ID directly
				messages.push(data);

				//Trigger clearMessages() when detecting special message
                if (data.message === "This conversation is now over.") {
                    clearMessages();
                }
			});

			displayMessages(messages);
		}, (error) => {
			console.error("Error receiving messages:", error);
		});
}

// Track messages that have already been emitted
const processedMessages = new Set();

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
    	//activeScene.events.emit('displayedMessage', { message1: msg.emotion });
		messageDiv.appendChild(messageBox);

		// Emit event only if this message hasn't been processed yet
        if (!processedMessages.has(msg.id)) {
            activeScene.events.emit('displayedMessage', { message1: msg.emotion });
            processedMessages.add(msg.id); // Mark message as processed
        }

		messagesContainer.appendChild(messageDiv);
	});
}