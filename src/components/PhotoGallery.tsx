
import { useState } from "react";
import { PhotoItem, Photo } from "./PhotoItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhotos: (photoIds: string[]) => void;
  onDeleteSinglePhoto: (photoId: string) => void;
}

const PhotoGallery = ({ photos, onDeletePhotos, onDeleteSinglePhoto }: PhotoGalleryProps) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [spacing, setSpacing] = useState<string>("minimal");
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPhotos([]);
  };
  
  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prevSelected => {
      if (prevSelected.includes(photoId)) {
        return prevSelected.filter(id => id !== photoId);
      } else {
        return [...prevSelected, photoId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };
  
  const handleDeleteSelected = () => {
    if (selectedPhotos.length > 0) {
      onDeletePhotos(selectedPhotos);
      setSelectedPhotos([]);
      setIsSelectionMode(false);
    }
  };
  
  const handleViewPhoto = (photo: Photo) => {
    setViewPhoto(photo);
  };
  
  const spacingValues = {
    "none": "gap-0",
    "minimal": "gap-1",
    "small": "gap-2",
    "medium": "gap-4"
  };

  return (
    <div className="space-y-4">
      {photos.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Tabs 
                value={spacing} 
                onValueChange={setSpacing} 
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="none" className="text-xs px-2 py-1 h-7">
                    Без отступов
                  </TabsTrigger>
                  <TabsTrigger value="minimal" className="text-xs px-2 py-1 h-7">
                    Минимальные
                  </TabsTrigger>
                  <TabsTrigger value="small" className="text-xs px-2 py-1 h-7">
                    Маленькие
                  </TabsTrigger>
                  <TabsTrigger value="medium" className="text-xs px-2 py-1 h-7">
                    Средние
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {isSelectionMode ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Выбрано: {selectedPhotos.length} из {photos.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAll}
                >
                  {selectedPhotos.length === photos.length ? "Снять выделение" : "Выбрать все"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleDeleteSelected}
                  disabled={selectedPhotos.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Удалить выбранные
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectionMode}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectionMode}
                className="gap-1"
              >
                <CheckSquare className="h-4 w-4" />
                Выбрать
              </Button>
            )}
          </div>
          
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${spacingValues[spacing as keyof typeof spacingValues]}`}>
            {photos.map((photo) => (
              <PhotoItem
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.includes(photo.id)}
                isSelectionMode={isSelectionMode}
                onSelect={() => togglePhotoSelection(photo.id)}
                onView={() => handleViewPhoto(photo)}
                onDelete={() => onDeleteSinglePhoto(photo.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="mb-2 text-lg font-medium">Нет фотографий</h3>
          <p className="text-gray-500">
            Загрузите фотографии, чтобы они появились здесь
          </p>
        </div>
      )}
      
      {/* Диалог просмотра фотографии */}
      <Dialog open={!!viewPhoto} onOpenChange={(open) => !open && setViewPhoto(null)}>
        <DialogContent className="max-w-4xl p-1 bg-gray-900" hideClose>
          {viewPhoto && (
            <div className="relative" onClick={() => setViewPhoto(null)}>
              <img 
                src={viewPhoto.url} 
                alt={viewPhoto.name} 
                className="max-h-[80vh] mx-auto object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-medium">{viewPhoto.name}</p>
              </div>
              <Button 
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-auto"
                size="icon"
                variant="ghost"
                onClick={() => setViewPhoto(null)}
              >
                ✕
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGallery;
