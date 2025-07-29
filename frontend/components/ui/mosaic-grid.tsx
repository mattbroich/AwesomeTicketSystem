import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image';
import { RedirectType } from 'next/navigation';

type Tile = {
  title: string;
  description: string;
  imageUrl: string;
  id: number;
};

type MosaicGridProps = {
  tiles: Tile[];
};

export default function MosaicGrid({ tiles }: MosaicGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {tiles.map((tile, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          onClick={() => { 
            location.href = `/listies?collectionId=${tile.id}`;
        }}  
        >
          <div className="relative h-48 w-full">
            <Image
              src={tile.imageUrl}
              alt={tile.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{tile.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{tile.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}