
import { useState } from "react";
import { Photo } from "./PhotoItem";
import PhotoItem from "./PhotoItem";
import { Button } from "@/components/ui/button";
import { Trash2Icon, SaveIcon, XIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhotos: (ids: string[]) => void;
}

const PhotoGallery = ({ photos, onDeletePhotos }: PhotoGalleryProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [gridGap, setGridGap] = useState<string>("gap-2");

  const handleSelectPhoto = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPhotos(prev => [...prev, id]);
    } else {
      setSelectedPhotos(prev => prev.filter(photoId => photoId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPhotos.length > 0) {
      onDeletePhotos(selectedPhotos);
      toast({
        title: "Удаление успешно",
        description: `Удалено ${selectedPhotos.length} фотографий`,
      });
      setSelectedPhotos([]);
    }
  };
  
  const handleSaveSelected = () => {
    if (selectedPhotos.length > 0) {
      toast({
        title: "Сохранение",
        description: `Выбрано ${selectedPhotos.length} фотографий для сохранения`,
      });
      // Здесь будет логика сохранения
    }
  };
  
  const clearSelection = () => {
    setSelectedPhotos([]);
  };
  
  const toggleGridGap = () => {
    setGridGap(gridGap === "gap-2" ? "gap-1" : "gap-2");
  };

  return (
    <div className="w-full">
      {photos.length > 0 ? (
        <>
          {/* Панель действий */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleGridGap}
              >
                {gridGap === "gap-2" ? "Уменьшить отступы" : "Увеличить отступы"}
              </Button>
            </div>
            
            {selectedPhotos.length > 0 && (
              <div className="flex items-center space-x-2 bg-portfolio-accent/20 px-3 py-1.5 rounded-md animate-fade-in">
                <span className="text-sm font-medium">Выбрано: {selectedPhotos.length}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                  onClick={handleDeleteSelected}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-green-600 hover:bg-green-50"
                  onClick={handleSaveSelected}
                >
                  <SaveIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={clearSelection}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Галерея фотографий */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${gridGap}`}>
            {photos.map(photo => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.includes(photo.id)}
                onSelect={handleSelectPhoto}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
          <div className="mb-4 text-portfolio-primary opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mb-1 text-xl font-medium">Нет фотографий</h3>
          <p className="text-gray-500">Загрузите фотографии, чтобы увидеть их здесь</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
