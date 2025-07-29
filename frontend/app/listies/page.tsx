'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Listy from '../../components/listy';
import ListyModal from '../../components/listy-modal';
import { getCurrentUser } from '../api/auth/actions';
import SubMenu from '../../components/sub-menu';
import { useRouter } from 'next/navigation';
import Status from '../enums/status';

interface Listy {
  id: string;
  name: string;
  description: string;
  status: string;
  isFavorite: boolean;
  collectionId: string;
  uId: number;
}

const Listies = () => {
  const [listies, setListies] = useState<Listy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [selectedListy, setSelectedListy] = useState<Listy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const IMAGE_NOTFOUND_DIMENSION = 256;

  const fetchUser = async () => {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUserId(user.toString());
  };

  const fetchListies = useCallback(async () => {
    const collectionId = new URLSearchParams(window.location.search).get('collectionId');
    if (!userId) return;

    try {
      const response = await fetch('/api/listies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, collectionId }),
      });

      const data = await response.json();

      setListies(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching listies:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchListies();
    }
  }, [userId, fetchListies]);

  const handleFavoriteToggle = (id: string) => {
    setListies((prev) =>
      prev.map((listy) =>
        listy.id === id ? { ...listy, isFavorite: !listy.isFavorite } : listy
      )
    );
  };

  const handleSave = async (updatedListy: Listy) => {
    if (!updatedListy.uId) {
      updatedListy.uId = parseInt(userId);
    }

    if (!updatedListy.collectionId) {
      const collectionId = new URLSearchParams(window.location.search).get('collectionId');
      updatedListy.collectionId = collectionId || '';
    }

    try {
      await fetch('/api/listies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listy: updatedListy }),
      });
      await fetchListies();
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setSelectedListy(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SubMenu
          title="Listies"
          subtitle="Create and modify your Listies here"
          showActionButton={true}
          page="listies"
          setSharedState={() => {
            setSelectedListy({
              id: '',
              name: '',
              description: '',
              status: Status.Open,
              isFavorite: false,
              collectionId: '',
              uId: parseInt(userId),
            });
            setIsModalOpen(true);
          }}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-lg text-gray-500 animate-pulse">
            Loading your listies...
          </div>
        ) : listies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listies.map((listy) => (
              <Listy
                key={listy.id}
                listy={listy}
                onFavoriteToggle={handleFavoriteToggle}
                onUpdate={fetchListies}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-xl shadow-md p-8">
            <img
              src="/nolistiesyet.png"
              alt="No Listies"
              className="mb-4"
              width={IMAGE_NOTFOUND_DIMENSION}
              height={IMAGE_NOTFOUND_DIMENSION}
            />
            <p className="text-gray-500 text-lg">No listies available! How about we create some?</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedListy && (
        <ListyModal
          listy={selectedListy}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedListy(null);
          }}
        />
      )}
    </div>
  );
};

export default Listies;
