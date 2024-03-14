import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./Auth/firebase";

const Task2 = () => {
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [user] = useAuthState(auth);
  const API_KEY = "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";

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);

    try {
      const response = await processQuestionToChatGPT(userInput);
      const content = response.choices[0]?.message?.content;
      if (content) {
        setQuestions([...questions, { question: userInput, answer: content }]);
      }
    } catch (error) {
      console.error("Error processing question:", error);
    } finally {
      setIsGenerating(false);
      setUserInput("");
    }
  };

  const handleClearQuiz = () => {
    setQuestions([]);
  };

  async function processQuestionToChatGPT(question) {
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Decode Prompt for AI:\n" +
            "Objective: Decode the provided encoded transcript to generate content suitable for various platforms, including Twitter, email newsletters, Instagram posts with images, and threaded discussions.\n" +
            "Instructions:\n" +
            "- Utilize the encoded transcript provided for decoding.\n" +
            "- Ensure that the decoded text contains a minimum of 1000 words to meet the specified length requirement.\n" +
            "- Generate content tailored for each platform based on the decoded text while maintaining fidelity to the original content.\n" +
            "Twitter Prompt:\n" +
            "Objective: Create a prompt for the AI tool to generate a Twitter post based on the decoded text.\n" +
            "Instructions:\n" +
            "- Craft a concise and engaging Twitter post using the decoded text.\n" +
            "- Ensure that the post fits within the character limit of a tweet (280 characters).\n" +
            "- Capture the essence of the decoded text while keeping the message clear and impactful.\n" +
            "Example:\n" +
            "Twitter Prompt: Craft a concise and engaging Twitter post based on the decoded text to inform followers about Next.js installation for React frameworks. Remember to keep the message clear and impactful within the character limit.\n" +
            "Email Newsletter Prompt:\n" +
            "Objective: Create a prompt for the AI tool to generate content for an email newsletter based on the decoded text.\n" +
            "Instructions:\n" +
            "- Develop engaging content for an email newsletter using the decoded text.\n" +
            "- Tailor the content to suit the audience of the newsletter, ensuring relevance and interest.\n" +
            "- Include compelling subject lines and calls-to-action to encourage engagement and click-throughs.\n" +
            "Example:\n" +
            "Email Newsletter Prompt: Create compelling content for an email newsletter focused on guiding readers through installing Next.js for React frameworks. Tailor the content with engaging subject lines and calls-to-action to encourage interaction with the newsletter recipients.\n" +
            "Instagram Post Image Prompt:\n" +
            "Objective: Create a prompt for the AI tool to generate a caption for an Instagram post image based on the decoded text.\n" +
            "Instructions:\n" +
            "- Write an engaging caption for an Instagram post using the decoded text as inspiration.\n" +
            "- Ensure that the caption complements the image and captures attention.\n" +
            "- Use relevant hashtags and emojis to enhance discoverability and expressiveness.\n" +
            "Example:\n" +
            "Instagram Post Image Prompt: Generate an engaging caption for an Instagram post image using the decoded text as inspiration to showcase the process of installing. Enhance the caption with relevant hashtags and emojis to capture attention and improve discoverability.\n" +
            "Threaded Discussion Prompt:\n" +
            "Objective: Create a prompt for the AI tool to initiate a threaded discussion based on the decoded text.\n" +
            "Instructions:\n" +
            "- Start a threaded discussion on a suitable platform utilizing the decoded text as the topic.\n" +
            "- Provide context and prompt discussion with insightful questions or prompts.\n" +
            "- Encourage participation and engagement from other users by fostering a constructive and inclusive environment.\n" +
            "Example:\n" +
            "Threaded Discussion Prompt: Start a threaded discussion on a suitable platform utilizing the decoded text as the topic to initiate conversations about Next.js installation. Provide context and prompt discussion with insightful questions or prompts to encourage active participation and engagement from other users in a constructive and inclusive environment.\n",
        },
        { role: "user", content: question },
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json(); // Await the response.json() method
  }

  return (
    <>
      {!user ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1>Login to access the app</h1>
        </div>
      ) : (
        <>
          <div className="flex justify-center h-screen mt-10">
            <div className="flex-1 flex flex-col p-4 max-w-3xl">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
                Creator Ai
              </h1>
              <div className="flex justify-end mb-2">
                <button
                  className="p-2 bg-red-500 text-white rounded-md"
                  onClick={handleClearQuiz}
                >
                  Clear Blog
                </button>
              </div>
              <div className="flex-1 overflow-y-auto w-full">
                <div className="flex flex-col space-y-4 w-full">
                  {questions.map((q, i) => (
                    <div key={i} className="text-left">
                      <div className="bg-blue-500 text-white p-2 rounded-md">
                        <strong>Question:</strong> {q.question}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Answer:</strong> {q.answer}
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="text-left text-gray-500">
                      Quiz Generator is working...
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-none w-full">
                <div className="flex w-full">
                  <input
                    type="text"
                    placeholder="Provide a Question"
                    className="border p-2 w-full rounded-full border-blue-700"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateQuiz()}
                  />
                  <button
                    className="p-2 rounded-md text-white ml-5"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #00F0FF, #5200FF, #FF2DF7)",
                    }}
                    onClick={handleGenerateQuiz}
                  >
                    Generate Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Task2;
