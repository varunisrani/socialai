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
            "Decode Prompt for AI   Objective: Decode the encoded text to retrieve the original content with a length of at least 1500 words this output need to have long and with multiple pera at leats words and in more breif.Instructions:  Utilize the provided encoded text for decoding.   Ensure that the decoded text contains at least 1000 tokens to meet the specified length requirement.  Maintain fidelity to the original content while decoding.",
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

    return response.json();
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
                Blog Ai
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