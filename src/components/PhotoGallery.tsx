
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Photo, PhotoItem } from "./PhotoItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2, X } from "lucide-react";

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhotos: (photoIds: string[]) => void;
  onDeleteSinglePhoto: (photoId: string) => void;
}

const PhotoGallery = ({ photos, onDeletePhotos, onDeleteSinglePhoto }: PhotoGalleryProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [gapSize, setGapSize] = useState("0"); // 0, 1, 2 - значения отступов

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedPhotos([]);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
    } else {
      setSelectedPhotos([...selectedPhotos, photoId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };

  const deleteSelectedPhotos = () => {
    if (selectedPhotos.length > 0) {
      onDeletePhotos(selectedPhotos);
      setSelectedPhotos([]);
      setIsSelectionMode(false);
    }
  };

  const handleViewPhoto = (photo: Photo) => {
    setCurrentPhoto(photo);
    setIsViewerOpen(true);
  };

  const getGapClass = () => {
    switch (gapSize) {
      case "0": return "gap-0";
      case "1": return "gap-1";
      case "2": return "gap-2";
      default: return "gap-1";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2 items-center">
          <Button
            variant={isSelectionMode ? "default" : "outline"}
            size="sm"
            onClick={toggleSelectionMode}
            className={isSelectionMode ? "bg-primary" : ""}
          >
            {isSelectionMode ? "Отменить выбор" : "Выбрать фото"}
          </Button>
          
          {isSelectionMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedPhotos.length === photos.length ? "Снять выбор" : "Выбрать все"}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedPhotos}
                disabled={selectedPhotos.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить {selectedPhotos.length > 0 ? `(${selectedPhotos.length})` : ''}
              </Button>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Отступы:</span>
          <Select value={gapSize} onValueChange={setGapSize}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Размер отступов" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Без отступов</SelectItem>
              <SelectItem value="1">Маленькие</SelectItem>
              <SelectItem value="2">Средние</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {photos.length > 0 ? (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${getGapClass()}`}>
          {photos.map(photo => (
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
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-md">
          <p className="text-gray-500">В этом альбоме пока нет фотографий</p>
          <p className="text-sm mt-1 text-gray-400">Перейдите на вкладку "Загрузить" чтобы добавить фото</p>
        </div>
      )}
      
      {isSelectionMode && selectedPhotos.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-primary text-white rounded-full shadow-lg z-50">
          <Badge variant="secondary" className="mr-2">
            {selectedPhotos.length}
          </Badge>
          фото выбрано
        </div>
      )}
      
      {currentPhoto && (
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-5xl h-auto p-0 bg-black rounded-lg">
            <div className="relative h-full">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setIsViewerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.name} 
                  className="max-h-[80vh] max-w-full object-contain mx-auto"
                />
              </div>
              
              <div className="p-4 bg-black/95 text-white">
                <h3 className="text-lg font-medium">{currentPhoto.name}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(currentPhoto.uploadDate).toLocaleDateString()} • 
                  {currentPhoto.width}×{currentPhoto.height}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PhotoGallery;
