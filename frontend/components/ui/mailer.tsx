// components/ui/mailer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { v4 } from "uuid";
import { th } from 'zod/v4/locales';

interface MailerProps {
  onClose: () => void;
}

interface User {
  email: string;
  collectionName: string;

}

const Mailer: React.FC<MailerProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    to: '',
    cc: '',
    from: '',
    title: '',
    message: '',
  });
  const [user, setUser] = useState<User>();

  const userData = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    const u = userData();
    u.then(data => {
      if (data) {
        setUser(data);
        setForm({
          to: '',
          cc: '',
          from: data.email,
          title: `Invitation to collaborate on ${data.collectionName}`,
          message: '',
        });
      }
    });
    
  });

  const guid = v4();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let successful = false;

      await fetch('/api/reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive: 'send', guid: guid }),
      }).then(response => {
        if (response.ok) {
          successful = true;
        } else {
          throw new Error('Failed to send directive');
        }
      })

      if (successful) {
        await fetch('/api/mailer/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          onClose();
      }
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Send Mail</h2>

        <div className="space-y-4">
          <input
            type="email"
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="Recipient"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="email"
            name="cc"
            value={form.cc}
            onChange={handleChange}
            placeholder="CC"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="email"
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="Sender"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <div
            className="w-full border border-gray-300 rounded px-3 py-2"
            dangerouslySetInnerHTML={{__html: `
                <div class="prose">
                    <h1 class="text-2xl font-bold">Hello,</h1>
                    <p>${form.from} has sent you a request to collaborate on Listable!</p>
                    <p>If you are interested, please click the following link to get started</p>
                    <a href="localhost:3000/register?rid=${guid}&ex=mailer" class="text-purple-600 hover:underline">Get Started</a>
                    <p>Best regards,</p>
                    <p>Listable Team</p>
                    <p class="text-sm text-gray-500">This is an automated message, please do not reply.</p>
                </div>
            `}}
          ></div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mailer;
