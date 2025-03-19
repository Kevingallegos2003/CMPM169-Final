const firebaseConfig = {
	apiKey: "",
	authDomain: "cmpm169-final.firebaseapp.com",
	projectId: "cmpm169-final",
	storageBucket: "cmpm169-final.firebasestorage.app",
	messagingSenderId: "900631031086",
	appId: "1:900631031086:web:3ea41379ebc3ced6cb5ebf"
	};

const initializeFirebase = (firebaseApiKey) => {
	const firebaseConfig = {
		apiKey: firebaseApiKey,	// Use the API key sent from the Cloudflare Worker
		authDomain: "cmpm169-final.firebaseapp.com",
		projectId: "cmpm169-final",
		storageBucket: "cmpm169-final.firebasestorage.app",
		messagingSenderId: "900631031086",
		appId: "1:900631031086:web:3ea41379ebc3ced6cb5ebf"
	};

	firebase.initializeApp(firebaseConfig);
	return firebase.firestore();
}

let firebaseApiKey;
// Send message to Firebase
export const sendMessage = async (user, message) => {
		try {
				// Call Cloudflare Worker for emotion analysis
				const response = await fetch("cmpm169-worker.valdenornathan.workers.dev", { 
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ message })
				});

				const data = await response.json();
				firebaseApiKey = data.firebaseApiKey;
				const emotion = data.emotion; // Get emotion response from Cloudflare Worker

				const db = initializeFirebase(firebaseApiKey);
				// Store message + emotion in Firestore
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
};


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
	
	const db = initializeFirebase(firebaseApiKey);
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
		messageBox.innerHTML = `${msg.message}`;

		if (msg.emotion.toLowerCase() === "sad") {
			messageBox.style.backgroundColor = "#82c0f3";
			usernameBox.style.backgroundColor = "#82c0f3";
			}
			else if(msg.emotion.toLowerCase() === "happy") {
			messageBox.style.backgroundColor = "#f3e282";
			usernameBox.style.backgroundColor = "#f3e282";
			}
			else if(msg.emotion.toLowerCase() === "anger") {
			messageBox.style.backgroundColor = "#f38282";
			usernameBox.style.backgroundColor = "#f38282";
			}
			else if(msg.emotion.toLowerCase() === "fear") {
			messageBox.style.backgroundColor = "#e482f3";
			usernameBox.style.backgroundColor = "#e482f3";
			}
			else if(msg.emotion.toLowerCase() === "disgust") {
			messageBox.style.backgroundColor = "#82f388";
			usernameBox.style.backgroundColor = "#82f388";
			}
			else {
			// use default color gray
			}

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