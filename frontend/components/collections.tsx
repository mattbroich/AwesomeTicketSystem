// components/collections.tsx
"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CollectionsModal from "./collection-modal";
import { useRouter } from "next/navigation";

interface Collection {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

interface Props {
  collections: Collection[];
}

const Collections: React.FC<Props> = ({ collections }) => {
  const [localCollections, setLocalCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCollection, setEditedCollection] = useState<Collection>({
    id: 0,
    name: "",
    description: "",
    imageUrl: "",
  });

  const router = useRouter();

  // Sync with incoming props
  useEffect(() => {
    setLocalCollections(collections);
  }, [collections]);

  const handleDelete = async (id: number) => {
    try {
      await fetch("/api/collections/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setLocalCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  const handleInputChange = <K extends keyof Collection>(field: K, value: Collection[K]) => {
    setEditedCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/collections/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, collection: editedCollection }), // Replace 1 with actual userId
      });

      const data = await response.json();
      if (response.ok) {
        setLocalCollections((prev) => [...prev, data.collection]);
        setIsModalOpen(false);
      } else {
        console.error("Failed to save collection:", data.message);
      }
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  return (
    <div className="flex flex-col h-full mx-5">
      {localCollections && localCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {localCollections.map((collection) => (
            <div
              key={collection.id}
              className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              onClick={() => {
                setEditedCollection(collection);
                setIsModalOpen(true);
              }}
            >
              <img
                src={collection.imageUrl || "/default-collection-image.png"}
                alt={collection.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-gray-800 hover:underline hover:text-purple-600 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/listies?collectionId=${collection.id}`);
                }}
                >
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-500">{collection.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(collection.id);
                }}
                className="absolute bottom-2 right-2 text-purple-600 hover:text-purple-800 transition"
                title="Delete collection"
                type="button"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No collections available.</p>
          <br />
          <p className="text-purple-600">
            You can ask the chatbot to come up with some ideas!
          </p>
        </div>
      )}
      {isModalOpen && (
        <CollectionsModal
          setIsModalOpen={setIsModalOpen}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          editedCollection={editedCollection}
        />
      )}
    </div>
  );
};

export default Collections;
