'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Status from '../app/enums/status'; // Adjust path if needed


interface Listy {
    id: string;
    name: string;
    description: string;
    status: string;
    isFavorite: boolean;
    collectionId: string;
    uId: number;
  }

interface Props {
  listy: Listy;
  onClose: () => void;
  onSave: (updated: Listy) => void;
}

const ListyModal: React.FC<Props> = ({ listy, onClose, onSave }) => {
  const [formState, setFormState] = useState<Listy>(listy);

  useEffect(() => {
    setFormState(listy);
  }, [listy]);

  const handleChange = (field: keyof Listy, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formState);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {formState.id ? 'Edit Listy' : 'Create Listy'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="Enter listy name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formState.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 resize-none"
              placeholder="Enter listy description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formState.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
            >
              <option value={Status.Cancelled}>Cancelled</option>
              <option value={Status.Closed}>Closed</option>
              <option value={Status.InProgress}>In Progress</option>
              <option value={Status.OnHold}>On Hold</option>
              <option value={Status.Open}>Open</option>
              <option value={Status.Reopened}>Reopened</option>
              <option value={Status.Resolved}>Resolved</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="favorite"
              checked={formState.isFavorite}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="favorite" className="text-sm font-medium text-gray-700">
              Mark as favorite
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListyModal;
