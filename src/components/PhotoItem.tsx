
import { useState } from "react";
import { Trash2Icon, Menu, ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface Photo {
  id: string;
  url: string;
  name: string;
  width: number;
  height: number;
  uploadDate: string;
}

interface PhotoItemProps {
  photo: Photo;
  onDelete: (id: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  selectionMode: boolean;
}

const PhotoItem = ({ photo, onDelete, onSelect, isSelected, selectionMode }: PhotoItemProps) => {
  const [showControls, setShowControls] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(photo.id, e.target.checked);
  };

  const handleImageClick = () => {
    if (selectionMode) {
      onSelect(photo.id, !isSelected);
    } else {
      setShowFullImage(true);
    }
  };

  const formattedDate = new Date(photo.uploadDate).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <>
      <div 
        className="group relative aspect-square overflow-hidden bg-gray-100"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Содержимое фото */}
        <div 
          className="w-full h-full cursor-pointer relative"
          onClick={handleImageClick}
        >
          <img 
            src={photo.url} 
            alt={photo.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Overlay при наведении */}
          <div className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 
            ${showControls ? 'opacity-100' : 'opacity-0'} 
            ${selectionMode ? 'opacity-100 bg-black/10' : ''} 
            ${isSelected ? 'opacity-100 bg-portfolio-primary/30' : ''} 
            transition-opacity`}
          >
            {!selectionMode && (
              <span className="text-white text-sm font-medium px-2 py-1 bg-black/50 rounded max-w-full truncate">
                {photo.name}
              </span>
            )}
          </div>
          
          {/* Чекбокс для выбора в режиме выбора */}
          {selectionMode && (
            <div className="absolute top-2 right-2 z-10">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-portfolio-primary focus:ring-portfolio-primary"
              />
            </div>
          )}
          
          {/* Название фото снизу */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-white text-xs truncate">{photo.name}</p>
          </div>
        </div>
        
        {/* Кнопка удаления */}
        {showControls && !selectionMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.id);
            }}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-red-500 transition-colors"
            aria-label="Удалить фото"
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Диалог с полным изображением */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-6xl p-2 bg-black/95 border-gray-800">
          <div className="relative flex flex-col items-center">
            <div className="max-h-[80vh] overflow-auto">
              <img 
                src={photo.url} 
                alt={photo.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-full mt-2 flex justify-between items-center text-white p-2">
              <p className="text-sm">{photo.name}</p>
              <p className="text-xs opacity-70">Загружено: {formattedDate}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoItem;
