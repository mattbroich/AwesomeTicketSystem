'use client'

import CollectionsModal from "../../components/collection-modal";
import SubMenu from "../../components/sub-menu";
import { useEffect, useState } from "react";
import Collections from "../../components/collections";
import { getCookie } from 'cookies-next'; 

interface Collection {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
}

const CollectionsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedCollection, setEditedCollection] = useState({
        name: "",
        description: "",
        imageUrl: "",
        isDeleted: false
    });
    const [collections, setCollections] = useState<Collection[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const handleInputChange = (field: string, value: any) => {
        setEditedCollection({
            ...editedCollection,
            [field]: value
        });
    };

    const fetchUserIdFromCookie = async () => {
        try {
            const response = await fetch('/api/collections', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }); 
    
            const data = await response.json();
            if (response.ok) {
                setUserId(data.userId);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchCollections = async (uid: string) => {
        try {
            const response = await fetch('/api/collections', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: uid }),
            }); 
    
            const data = await response.json();
            if (response.ok) {
                const collectionArray: Collection[] = (data.collections || []).map((collection: any) => ({
                    id: collection.id,
                    name: collection.name,
                    description: collection.description || "",
                    imageUrl: collection.imageUrl || ""
                }));

                setCollections(collectionArray);
            } else {
                console.error('Failed to fetch collections:', data.message);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const saveCollection = async () => {
        if (!userId) return;

        try {
            const response = await fetch('/api/collections/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, collection: editedCollection }),
            }); 
    
            const data = await response.json();

            if (response.ok) {
                setIsModalOpen(false);
                fetchCollections(userId); // Refresh
            } else {
                console.error('Failed to save collection:', data.message);
            }
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    };

    useEffect(() => {
        fetchUserIdFromCookie();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCollections(userId);
        }
    }, [userId]);

    const handleSave = () => {
        if (!editedCollection.name.trim()) {
            console.error("Collection name is required");
            return;
        }

        saveCollection();
    };

    return (
        <div className="flex flex-col h-full">
            <SubMenu 
                title="Collections" 
                subtitle="Manage, create and edit Collections" 
                showActionButton={true} 
                page="collections" 
                setSharedState={setIsModalOpen} 
            />
            
            <Collections collections={collections} />

            {isModalOpen && (
                <CollectionsModal 
                    handleInputChange={handleInputChange} 
                    editedCollection={editedCollection} 
                    setIsModalOpen={setIsModalOpen} 
                    handleSave={handleSave}  
                />
            )}
        </div>
    );
}

export default CollectionsPage;
