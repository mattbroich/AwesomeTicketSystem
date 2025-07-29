// components/collection-modal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";

interface Collection {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

interface CollectionsModalProps {
  editedCollection: Collection;
  handleInputChange: (field: keyof Collection, value: string) => void;
  handleSave: () => void;
  setIsModalOpen: (open: boolean) => void;
}

const CollectionsModal: React.FC<CollectionsModalProps> = ({
  editedCollection,
  handleInputChange,
  handleSave,
  setIsModalOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={() => setIsModalOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-purple-700">Edit Collection</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedCollection.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedCollection.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={editedCollection.imageUrl || ""}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsModal;
