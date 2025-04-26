
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadIcon, XIcon, ImageIcon, FolderPlusIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PhotoUploaderProps {
  onUploadComplete: (photos: Array<{ id: string, url: string, name: string, width: number, height: number, uploadDate: string }>) => void;
  albumId: string;
}

const PhotoUploader = ({ onUploadComplete, albumId }: PhotoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(albumId);
  const [isNewAlbumDialogOpen, setIsNewAlbumDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const generatePreviews = (selectedFiles: File[]) => {
    // Очищаем старые превью при добавлении новых файлов
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    return () => {
      // Очистка URL объектов при размонтировании
      newPreviews.forEach(URL.revokeObjectURL);
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      generatePreviews(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...selectedFiles]);
      generatePreviews(selectedFiles);
      
      // Сбрасываем значение input, чтобы можно было загрузить те же файлы повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    // Удаляем файл и его превью
    setFiles(files.filter((_, i) => i !== index));
    
    // Освобождаем URL объект для превью
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    // Имитация загрузки с прогрессом
    const totalFiles = files.length;
    const uploadedPhotos: Array<{
      id: string;
      url: string;
      name: string;
      width: number;
      height: number;
      uploadDate: string;
    }> = [];
    
    // Исправляем логику для корректной загрузки файлов
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      
      // Создаем временный URL для превью
      const fileUrl = URL.createObjectURL(file);
      
      // Имитация загрузки с получением реальных размеров изображения
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Добавляем фото в массив загруженных
          uploadedPhotos.push({
            id: `photo-${Date.now()}-${i}`,
            url: fileUrl, // В реальном приложении здесь будет URL с сервера
            name: file.name,
            width: img.width,
            height: img.height,
            uploadDate: new Date().toISOString()
          });
          
          // Обновляем прогресс
          setProgress(Math.round(((i + 1) / totalFiles) * 100));
          resolve();
        };
        img.src = fileUrl;
      });
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // По завершении загрузки
    setTimeout(() => {
      setUploading(false);
      setFiles([]);
      setPreviews([]);
      
      toast({
        title: "Загрузка завершена",
        description: `Успешно загружено ${totalFiles} фото`,
      });
      
      // Передаем загруженные фото в родительский компонент
      onUploadComplete(uploadedPhotos);
    }, 500);
  };

  const createNewAlbum = () => {
    if (newAlbumName.trim()) {
      // В реальном приложении здесь будет API-запрос на создание альбома
      const newAlbumId = `album-new-${Date.now()}`;
      
      toast({
        title: "Альбом создан",
        description: `Альбом "${newAlbumName}" успешно создан`,
      });
      
      setSelectedAlbum(newAlbumId);
      setIsNewAlbumDialogOpen(false);
      setNewAlbumName("");
    }
  };

  // Мок-данные доступных альбомов (в реальном приложении будут загружаться с сервера)
  const availableAlbums = [
    { id: "album-1", name: "Пейзажи" },
    { id: "album-2", name: "Портреты" },
    { id: "album-3", name: "Путешествия" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Выбор альбома */}
      <div className="mb-4">
        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Выберите альбом для загрузки:</label>
            <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите альбом" />
              </SelectTrigger>
              <SelectContent>
                {availableAlbums.map(album => (
                  <SelectItem key={album.id} value={album.id}>
                    {album.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setIsNewAlbumDialogOpen(true)}
          >
            <FolderPlusIcon className="h-4 w-4 mr-2" />
            Новый альбом
          </Button>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <p className="text-base font-medium">
              Перетащите файлы сюда или
            </p>
            <p className="text-sm text-gray-500">
              Поддерживаются JPG, PNG, GIF
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Выбрать файлы
          </Button>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">
            Выбрано файлов: {files.length}
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={preview} 
                  alt={`Превью ${index + 1}`} 
                  className="w-full h-24 object-cover rounded"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-white text-xs truncate">
                  {files[index]?.name}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          {uploading ? (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-gray-500">
                Загружено {progress}%
              </p>
            </div>
          ) : (
            <Button
              className="mt-4 w-full bg-primary hover:bg-primary/90"
              onClick={uploadFiles}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Загрузить {files.length} файлов
            </Button>
          )}
        </div>
      )}
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg mb-2">Информация о хранилище</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Базовый тариф</span>
            <span className="font-medium">5 ГБ бесплатно</span>
          </li>
          <li className="flex justify-between">
            <span>Тариф "Фотограф"</span>
            <span className="font-medium">20 ГБ - 299 ₽/мес</span>
          </li>
          <li className="flex justify-between">
            <span>Тариф "Профессионал"</span>
            <span className="font-medium">100 ГБ - 699 ₽/мес</span>
          </li>
          <li className="flex justify-between">
            <span>Тариф "Студия"</span>
            <span className="font-medium">1 ТБ - 1999 ₽/мес</span>
          </li>
        </ul>
        <div className="mt-4">
          <Progress value={35} className="h-2" />
          <p className="text-xs mt-1 text-gray-500">Использовано 1.75 ГБ из 5 ГБ (35%)</p>
        </div>
      </div>

      {/* Диалог создания нового альбома */}
      <Dialog open={isNewAlbumDialogOpen} onOpenChange={setIsNewAlbumDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Создать новый альбом</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Введите название альбома"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewAlbumDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={createNewAlbum}
              className="bg-primary hover:bg-primary/90"
              disabled={!newAlbumName.trim()}
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoUploader;
