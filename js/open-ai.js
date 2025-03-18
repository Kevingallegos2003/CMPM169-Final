export const getEmotion = async (message) => {
    const prompt = [
        { "role": "system", "content": "You are an emotion analysis bot. Please return a single word that describes the emotion conveyed in the following message. Please choose from these words: Neutral, Fear, Anger, Disgust, Sad, and Happy." },
        { "role": "user", "content": message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` // Replace with your actual API key
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: prompt,
        }),
    });

    const data = await response.json();
    const emotion = data.choices[0].message.content.trim();
    return emotion;
};
