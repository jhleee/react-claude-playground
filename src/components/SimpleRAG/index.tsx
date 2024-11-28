import React, { FormEvent, useState } from "react";
import { Send, Loader2 } from "lucide-react";

const SimpleRAG = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit button clicked");

    if (!question.trim() || isLoading) {
      console.log("Submission prevented:", {
        emptyQuestion: !question.trim(),
        isLoading,
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting request with question:", question);

      // Simulate RAG response - replace with actual API call
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log("Response received");
          setResponse(
            "This is a sample response to your question: " + question
          );
          resolve(null);
        }, 2000);
      });
    } catch (error) {
      console.error("Error during request:", error);
      setResponse("An error occurred while processing your request.");
    } finally {
      console.log("Request completed");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">RAG Assistant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question here..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {(response || isLoading) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Response
            </h2>
            {isLoading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating response...</span>
              </div>
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleRAG;
