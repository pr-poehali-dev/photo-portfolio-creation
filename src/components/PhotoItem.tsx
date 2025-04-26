
import { Trash2, CheckCircle2 } from "lucide-react";

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
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

export const PhotoItem = ({
  photo,
  isSelected,
  isSelectionMode,
  onSelect,
  onView,
  onDelete
}: PhotoItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      onSelect();
    } else {
      onView();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div 
      className={`relative aspect-square cursor-pointer group ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={handleClick}
    >
      {/* Фото с полным заполнением пространства */}
      <div className="w-full h-full overflow-hidden">
        <img 
          src={photo.url} 
          alt={photo.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {/* Название фото снизу */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1 px-2">
        <div className="text-white text-xs font-medium truncate">
          {photo.name}
        </div>
      </div>
      
      {/* Иконка выбора в режиме выбора */}
      {isSelectionMode && (
        <div className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full 
          ${isSelected ? "bg-primary text-white" : "bg-black/40 text-white/70"}`}>
          <CheckCircle2 className={`h-5 w-5 ${isSelected ? "opacity-100" : "opacity-70"}`} />
        </div>
      )}
      
      {/* Кнопка удаления при наведении */}
      {!isSelectionMode && (
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
