
import { useState } from "react";
import { Photo } from "./PhotoItem";
import PhotoItem from "./PhotoItem";
import { Button } from "@/components/ui/button";
import { Trash2Icon, SaveIcon, XIcon, CheckIcon, GridIcon, Grid3X3Icon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhotos: (ids: string[]) => void;
  onDeleteSinglePhoto: (id: string) => void;
}

const PhotoGallery = ({ photos, onDeletePhotos, onDeleteSinglePhoto }: PhotoGalleryProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [gridGap, setGridGap] = useState<string>("gap-1");
  const [gridCols, setGridCols] = useState<string>("grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5");
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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
      setIsSelectionMode(false);
    }
  };
  
  const handleSaveSelected = () => {
    if (selectedPhotos.length > 0) {
      toast({
        title: "Сохранение",
        description: `Выбрано ${selectedPhotos.length} фотографий для сохранения`,
      });
      // Здесь будет логика сохранения
      setSelectedPhotos([]);
      setIsSelectionMode(false);
    }
  };
  
  const clearSelection = () => {
    setSelectedPhotos([]);
    setIsSelectionMode(false);
  };
  
  const toggleGridGap = () => {
    setGridGap(gridGap === "gap-1" ? "gap-0.5" : "gap-1");
  };
  
  const toggleGridSize = () => {
    if (gridCols.includes("grid-cols-5")) {
      setGridCols("grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"); // Уменьшаем
    } else {
      setGridCols("grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"); // Увеличиваем
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedPhotos([]);
    }
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
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
                {gridGap === "gap-1" ? "Меньше отступы" : "Больше отступы"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleGridSize}
              >
                <Grid3X3Icon className="h-4 w-4 mr-1" />
                {gridCols.includes("grid-cols-5") ? "Крупнее" : "Мельче"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectionMode}
                className={isSelectionMode ? "bg-portfolio-accent/20" : ""}
              >
                {isSelectionMode ? "Отменить выбор" : "Выбрать несколько"}
              </Button>
              
              {isSelectionMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllPhotos}
                >
                  {selectedPhotos.length === photos.length ? "Снять выделение" : "Выбрать все"}
                </Button>
              )}
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
          <div className={`grid ${gridCols} ${gridGap}`}>
            {photos.map(photo => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.includes(photo.id)}
                onSelect={handleSelectPhoto}
                onDelete={onDeleteSinglePhoto}
                selectionMode={isSelectionMode}
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
