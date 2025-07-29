# 📋 Listable

Listable is a sleek, modern web application built with **Next.js** that helps users organize their lives through **collections**, **listies**, and integrated features like **chat support** and **email functionality**. It's designed to be flexible, fast, and easy to extend.

---

## 🚀 Features

- ✨ Create and manage collections with images, names, and descriptions.
- 📝 Add, edit, and delete “Listies” (custom items within a collection).
- 🧠 Chat integration via OpenAI to suggest ideas or answer questions.
- 💌 Built-in mailer modal to send styled messages to users.
- 🖼️ Mosaic-style responsive grid layout for collections.
- 🧱 Modular components like `CollectionsModal`, `ChatField`, and `Mailer`.

---

## 🛠️ Tech Stack

| Tech         | Usage                       |
|--------------|-----------------------------|
| **Next.js**  | Full-stack React framework  |
| **TypeScript** | Static typing for components and APIs |
| **Tailwind CSS** | Modern utility-first styling |
| **Lucide Icons** | For clean, lightweight UI icons |
| **API Routes** | Custom logic for mail, chat, collections |

---

## 📁 Project Structure
components/
├── collection-modal.tsx # Modal for creating/editing collections
├── collections.tsx # Grid view of collections
├── ui/
│ ├── chat-field.tsx # Floating chat assistant
│ └── mosaic-grid.tsx # Reusable grid layout
pages/
├── api/
│ ├── collections/ # RESTful endpoints for collections
│ ├── mailer/send.ts # Send email via form modal
│ └── chat/ask.ts # Chat interaction with OpenAI
├── listies.tsx # View filtered Listies by collection
├── index.tsx # Home / landing view
