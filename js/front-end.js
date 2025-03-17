import { getEmotion } from './open-ai.js';
import { sendMessage } from './firebase.js';

const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user");
const messageInput = document.getElementById("message");
const emotionContainer = document.getElementById("emotion-container");
const emotionSpan = document.getElementById("emotion");
const messagesContainer = document.getElementById("messages-list");

const displayMessages = (messages) => {
  messagesContainer.innerHTML = "";
  messages.forEach((msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${msg.user}: ${msg.message} (Emotion: ${msg.emotion})`;
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
    const emotion = await getEmotion(message);

    emotionSpan.textContent = emotion;
    emotionContainer.classList.remove("hidden");

    await sendMessage(user, message, emotion);

    messageInput.value = "";
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error processing the message.");
  }
};

sendButton.addEventListener("click", handleSendMessage);
