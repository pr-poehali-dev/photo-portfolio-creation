
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FolderIcon } from "lucide-react";

export interface Album {
  id: string;
  name: string;
  count: number;
  cover?: string;
}

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  return (
    <Link to={`/album/${album.id}`} className="transition-transform hover:scale-105">
      <Card className="overflow-hidden border-2 hover:border-portfolio-primary">
        <CardContent className="p-0">
          {album.cover ? (
            <div className="relative h-48 overflow-hidden">
              <img 
                src={album.cover} 
                alt={album.name} 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white font-medium px-3 py-1 rounded-md bg-black bg-opacity-50">
                  Открыть
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-100">
              <FolderIcon className="w-16 h-16 text-portfolio-primary opacity-50" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start p-3 bg-white">
          <h3 className="font-medium text-portfolio-text">{album.name}</h3>
          <p className="text-sm text-gray-500">{album.count} фото</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AlbumCard;
