'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatField from './chat-field';

const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-h-[60vh] bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <ChatField />
        </div>
      )}
    </>
  );
};

export default ChatLauncher;
