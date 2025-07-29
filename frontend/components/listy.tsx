'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, Edit3, Trash2 } from 'lucide-react';
import Status from '../app/enums/status';
import { getCurrentUser } from '../app/api/auth/actions';

interface ListyProps {
  listy: {
    id: string;
    name: string;
    description: string;
    status: string;
    isFavorite: boolean;
    collectionId: string;
    uId: number;
  };
  onFavoriteToggle: (id: string) => void;
  onUpdate: () => void; // Triggers parent to refresh the list
}

const Listy: React.FC<ListyProps> = ({ listy, onFavoriteToggle, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedListy, setEditedListy] = useState(listy);
  const [collectionId, setCollectionId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUserId(user.toString());
    };
    fetchUser();
    setCollectionId(new URLSearchParams(window.location.search).get('collectionId') || '');
  }, []);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Open:
        return 'bg-green-100 text-green-800 border-green-200';
      case Status.Closed:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case Status.OnHold:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Status.Cancelled:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const truncateDescription = (text: string, maxLength = 50) => {
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
  };

  const handleListyClick = (e: any) => {
    if (e.target.closest('.star-button') || e.target.closest('.delete-button')) return;
    setEditedListy(listy); // ensure fresh values
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedListy(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedListy.collectionId) {
      editedListy.collectionId = collectionId
    }

    if (!editedListy.collectionId) {
      alert('Missing collectionId');
      return;
    }

    if (!editedListy.uId) {
      editedListy.uId = parseInt(userId);
    }

    try {
      const res = await fetch('/api/listies/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({listy: editedListy}),
      });

      if (!res.ok) throw new Error('Failed to save listy');

      setIsModalOpen(false);
      onUpdate();
    } catch (err) {
      console.error('Error saving listy:', err);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/listies/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listyId: listy.id, userId: userId }),
      });

      if (!res.ok) throw new Error('Failed to delete listy');

      onUpdate();
    } catch (err) {
      console.error('Error deleting listy:', err);
      alert('An error occurred while deleting.');
    }
  };

  return (
    <>
      <div
        className="relative bg-white rounded-xl border border-gray-200 p-4 cursor-pointer 
                   hover:shadow-lg transition-all duration-200 hover:border-gray-300 group"
        onClick={handleListyClick}
        title={listy.isFavorite ? 'Dismiss' : 'Favorite'}
      >
        <button
          className="star-button absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(listy.id);
          }}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              listy.isFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
        </button>

        <div className="pr-8">
          <span hidden>{listy.uId}</span>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
            {listy.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {truncateDescription(listy.description)}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                listy.status as Status
              )}`}
            >
              {listy.status}
            </span>
          </div>
        </div>
        <div className="flex">
          <button
              className="delete-button absolute bottom-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Delete listy"
            >
            <Trash2 className="w-5 h-5 text-purple-600 hover:text-purple-800 transition-colors" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Listy</h2>
              <button
                onClick={() => setIsModalOpen(false)}
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
                  value={editedListy.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter listy name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedListy.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter listy description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editedListy.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="on hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={editedListy.isFavorite}
                  onChange={(e) => handleInputChange('isFavorite', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="favorite" className="text-sm font-medium text-gray-700">
                  Mark as favorite
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Listy;
