
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";

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
  onSelect: (id: string, isSelected: boolean) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  selectionMode: boolean;
}

const PhotoItem = ({ photo, onSelect, onDelete, isSelected, selectionMode }: PhotoItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isHorizontal = photo.width > photo.height;
  
  const handlePhotoClick = () => {
    if (selectionMode) {
      onSelect(photo.id, !isSelected);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(photo.id);
  };
  
  return (
    <>
      <div 
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative overflow-hidden rounded-md bg-gray-100 cursor-pointer"
          onClick={handlePhotoClick}
        >
          <div className="w-full pb-[100%] relative">
            <img
              src={photo.url}
              alt={photo.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
        
        {(selectionMode || isSelected) && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(photo.id, checked === true)}
              className="bg-white border-gray-300 data-[state=checked]:bg-portfolio-primary data-[state=checked]:border-portfolio-primary"
            />
          </div>
        )}

        {isHovered && !selectionMode && (
          <button 
            className="absolute top-2 right-2 z-10 bg-white/90 p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
            onClick={handleDeleteClick}
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        )}
        
        <div className="mt-1 text-xs text-gray-600 truncate px-1">
          {photo.name}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-1 bg-black">
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={photo.url}
              alt={photo.name}
              className="max-h-[80vh] max-w-full object-contain"
            />
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-md text-sm">
              <div className="flex justify-between items-center">
                <span>{photo.name}</span>
                <span className="text-xs text-gray-300">
                  {isHorizontal ? '15×10' : '10×15'} | {Math.round(photo.width/photo.height * 100)/100}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoItem;
