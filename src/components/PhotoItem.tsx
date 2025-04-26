
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const PhotoItem = ({ photo, onSelect, isSelected }: PhotoItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const isHorizontal = photo.width > photo.height;
  const aspectRatio = isHorizontal ? 'aspect-[3/2]' : 'aspect-[2/3]';
  
  return (
    <>
      <div className="group relative">
        <div 
          className={`relative ${aspectRatio} overflow-hidden rounded-md bg-gray-100 cursor-pointer`}
          onClick={() => setIsDialogOpen(true)}
        >
          <img
            src={photo.url}
            alt={photo.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
        
        <div className="absolute top-2 left-2 z-10">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(photo.id, checked === true)}
            className="bg-white border-gray-300 data-[state=checked]:bg-portfolio-primary data-[state=checked]:border-portfolio-primary"
          />
        </div>
        
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
              {photo.name}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoItem;
