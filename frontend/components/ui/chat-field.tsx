import React, { useState } from 'react';

const ChatField = () => {
    const [input, setInput] = useState('');

    const sendPrompt = async (prompt: string) => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
      
        const data = await res.json();
        return data.result;
      };

    const sendPromptAndCreate = async (prompt: string) => {
        const res = await fetch('/api/chat/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        return data.result; // Assuming this returns the response you want to use for creating a new chat or listy
    }

    return (
        <div className="flex flex-col items-center justify-center w-auto p-4 bg-gray-100 rounded-lg shadow-md">
            <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="How can I help you?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <div 
                className="d-inline-flex items-center justify-center mt-2 text-sm text-gray-500">
                <button
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    onClick={async () => {
                        const response = await sendPrompt(input);
                        console.log(response); // Handle the response as needed
                        setInput(response); // Clear input after sending
                    }}
                >
                    Send
                </button>
                &nbsp;
                <button 
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"   
                    onClick={async () => {
                        const response = await sendPromptAndCreate(input);
                        console.log(response); // Handle the response as needed
                        setInput(''); // Clear input after sending
                        // Here you can add logic to create a new chat or listy with the response
                    }}
                    >
                    Send & Create
                </button>
            </div>
            
        </div>
    )
}

export default ChatField;