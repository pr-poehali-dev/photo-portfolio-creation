
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoGallery from "@/components/PhotoGallery";
import { Photo } from "@/components/PhotoItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FolderIcon, UploadIcon, GridIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const mockAlbums = {
  "album-1": { id: "album-1", name: "Пейзажи", count: 15 },
  "album-2": { id: "album-2", name: "Портреты", count: 8 },
  "album-3": { id: "album-3", name: "Путешествия", count: 24 },
};

const mockPhotos: Record<string, Photo[]> = {
  "album-1": [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
      name: "Горный пейзаж.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-10T10:30:00Z"
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?w=800&auto=format&fit=crop",
      name: "Река между гор.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-12T14:20:00Z"
    },
    {
      id: "photo-3",
      url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop",
      name: "Озеро в горах.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-15T09:45:00Z"
    },
    {
      id: "photo-7",
      url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
      name: "Звездное небо.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-16T12:30:00Z"
    },
    {
      id: "photo-8",
      url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&auto=format&fit=crop",
      name: "Горная дорога.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-17T08:15:00Z"
    }
  ],
  "album-2": [
    {
      id: "photo-4",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop",
      name: "Портрет 1.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-18T16:30:00Z"
    },
    {
      id: "photo-9",
      url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop",
      name: "Портрет 2.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-19T14:20:00Z"
    },
    {
      id: "photo-10",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
      name: "Портрет 3.jpg",
      width: 1200,
      height: 1800,
      uploadDate: "2025-04-20T10:30:00Z"
    }
  ],
  "album-3": [
    {
      id: "photo-5",
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop",
      name: "Берег моря.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-20T11:15:00Z"
    },
    {
      id: "photo-6",
      url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&auto=format&fit=crop",
      name: "Узкая улочка.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-22T13:40:00Z"
    },
    {
      id: "photo-11",
      url: "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?w=800&auto=format&fit=crop",
      name: "Городская площадь.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-23T09:45:00Z"
    },
    {
      id: "photo-12",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&auto=format&fit=crop",
      name: "Венеция.jpg",
      width: 1000,
      height: 1500,
      uploadDate: "2025-04-24T16:20:00Z"
    },
    {
      id: "photo-13",
      url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&auto=format&fit=crop",
      name: "Закат в Сантьяго.jpg",
      width: 1500,
      height: 1000,
      uploadDate: "2025-04-25T18:30:00Z"
    }
  ]
};

const AlbumView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState<{ id: string; name: string; count: number } | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [activeTab, setActiveTab] = useState("gallery");
  
  useEffect(() => {
    // Имитация загрузки данных альбома
    if (id) {
      const albumData = mockAlbums[id as keyof typeof mockAlbums];
      if (albumData) {
        setAlbum(albumData);
        setNewAlbumName(albumData.name);
        
        // Загрузка фотографий альбома
        const albumPhotos = mockPhotos[id] || [];
        setPhotos(albumPhotos);
      } else {
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handlePhotoUpload = (newPhotos: Photo[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
    
    if (album) {
      setAlbum({
        ...album,
        count: album.count + newPhotos.length
      });
    }
    
    // Автоматический переход на вкладку галереи после загрузки
    setActiveTab("gallery");
    
    toast({
      title: "Фотографии загружены",
      description: `Добавлено ${newPhotos.length} фото в альбом "${album?.name}"`,
    });
  };

  const handleDeletePhotos = (photoIds: string[]) => {
    setPhotos(prev => prev.filter(photo => !photoIds.includes(photo.id)));
    
    if (album) {
      setAlbum({
        ...album,
        count: album.count - photoIds.length
      });
    }
    
    toast({
      title: "Фотографии удалены",
      description: `Удалено ${photoIds.length} фотографий`,
    });
  };
  
  const handleDeleteSinglePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    
    if (album) {
      setAlbum({
        ...album,
        count: album.count - 1
      });
    }
    
    toast({
      title: "Фото удалено",
      description: "Фотография была успешно удалена",
    });
  };

  const handleRenameAlbum = () => {
    if (album && newAlbumName.trim()) {
      setAlbum({
        ...album,
        name: newAlbumName.trim()
      });
      
      setIsRenameDialogOpen(false);
      toast({
        title: "Альбом переименован",
        description: `Новое название: ${newAlbumName.trim()}`,
      });
    }
  };

  const handleDeleteAlbum = () => {
    toast({
      title: "Альбом удален",
      description: `Альбом "${album?.name}" был удален`,
    });
    navigate("/");
  };

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Загрузка альбома...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={album.name} showBackButton />
      
      <main className="container px-4 py-6 mx-auto">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <a href="/">
                <ArrowLeftIcon className="h-4 w-4" />
              </a>
            </Button>
            
            <h2 className="text-2xl font-bold text-gray-800">{album.name}</h2>
            <span className="text-sm font-medium text-gray-500">
              {album.count} {album.count === 1 ? 'фото' : 
                album.count >= 2 && album.count <= 4 ? 'фото' : 'фотографий'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRenameDialogOpen(true)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Переименовать
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Удалить альбом
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="gallery" className="gap-2">
              <GridIcon className="h-4 w-4" />
              Галерея
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <UploadIcon className="h-4 w-4" />
              Загрузить
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <PhotoGallery 
              photos={photos} 
              onDeletePhotos={handleDeletePhotos}
              onDeleteSinglePhoto={handleDeleteSinglePhoto}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <PhotoUploader 
              onUploadComplete={handlePhotoUpload} 
              albumId={album.id}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Диалог переименования альбома */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Переименовать альбом</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Введите новое название"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleRenameAlbum}
              className="bg-primary hover:bg-primary/90"
              disabled={!newAlbumName.trim() || newAlbumName.trim() === album.name}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог удаления альбома */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить альбом</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить альбом "{album.name}"? Все фотографии в этом альбоме будут удалены.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteAlbum}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlbumView;
