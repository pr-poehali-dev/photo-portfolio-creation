
import { useState } from "react";
import Header from "@/components/Header";
import AlbumCard, { Album } from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlusIcon, Trash2, PencilIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Пример данных для альбомов
const initialAlbums: Album[] = [
  {
    id: "album-1",
    name: "Пейзажи",
    count: 15,
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
  },
  {
    id: "album-2",
    name: "Портреты",
    count: 8,
    cover: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop"
  },
  {
    id: "album-3",
    name: "Путешествия",
    count: 24,
    cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
  }
];

const Index = () => {
  const [albums, setAlbums] = useState<Album[]>(() => {
    const savedAlbums = localStorage.getItem('photoAlbums');
    return savedAlbums ? JSON.parse(savedAlbums) : initialAlbums;
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");

  // Сохранение альбомов в localStorage
  const saveAlbums = (updatedAlbums: Album[]) => {
    localStorage.setItem('photoAlbums', JSON.stringify(updatedAlbums));
    setAlbums(updatedAlbums);
  };

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      const newAlbum: Album = {
        id: `album-${Date.now()}`,
        name: newAlbumName.trim(),
        count: 0
      };
      
      const updatedAlbums = [...albums, newAlbum];
      saveAlbums(updatedAlbums);
      
      setNewAlbumName("");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Альбом создан",
        description: `Альбом "${newAlbumName.trim()}" успешно создан`,
      });
    }
  };
  
  const openDeleteDialog = (album: Album, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAlbumToDelete(album);
    setIsDeleteDialogOpen(true);
  };
  
  const openEditDialog = (album: Album, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAlbumToEdit(album);
    setNewAlbumName(album.name);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteAlbum = () => {
    if (albumToDelete) {
      const updatedAlbums = albums.filter(album => album.id !== albumToDelete.id);
      saveAlbums(updatedAlbums);
      
      toast({
        title: "Альбом удален",
        description: `Альбом "${albumToDelete.name}" был успешно удален`,
      });
      setIsDeleteDialogOpen(false);
      setAlbumToDelete(null);
    }
  };
  
  const handleEditAlbum = () => {
    if (albumToEdit && newAlbumName.trim()) {
      const updatedAlbums = albums.map(album => 
        album.id === albumToEdit.id 
          ? { ...album, name: newAlbumName.trim() } 
          : album
      );
      
      saveAlbums(updatedAlbums);
      
      toast({
        title: "Альбом переименован",
        description: `Новое название: "${newAlbumName.trim()}"`,
      });
      
      setIsEditDialogOpen(false);
      setAlbumToEdit(null);
      setNewAlbumName("");
    }
  };
  
  const handleDeleteAllAlbums = () => {
    saveAlbums([]);
    
    toast({
      title: "Все альбомы удалены",
      description: "Все альбомы были успешно удалены",
    });
    
    setIsDeleteAllDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Мои альбомы</h2>
            <p className="text-gray-500">Организуйте свои фотографии по альбомам</p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setIsDeleteAllDialogOpen(true)}
              variant="outline"
              className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              disabled={albums.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span>Удалить все альбомы</span>
            </Button>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 gap-1"
            >
              <FolderPlusIcon className="w-4 h-4" />
              <span>Создать альбом</span>
            </Button>
          </div>
        </div>
        
        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="relative group">
                <AlbumCard album={album} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => openEditDialog(album, e)}
                    className="bg-black/60 text-white p-1.5 rounded-full hover:bg-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => openDeleteDialog(album, e)}
                    className="bg-black/60 text-white p-1.5 rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed rounded-lg">
            <h3 className="mb-2 text-xl font-medium">Нет альбомов</h3>
            <p className="mb-4 text-gray-500">Создайте свой первый альбом для загрузки фотографий</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <FolderPlusIcon className="w-4 h-4 mr-2" />
              Создать альбом
            </Button>
          </div>
        )}
      </main>
      
      {/* Диалог создания альбома */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый альбом</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="album-name" className="text-sm font-medium">
                Название альбома
              </label>
              <Input
                id="album-name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Введите название альбома"
              />
            </div>
            <Button 
              onClick={handleCreateAlbum} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!newAlbumName.trim()}
            >
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования альбома */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать альбом</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-album-name" className="text-sm font-medium">
                Название альбома
              </label>
              <Input
                id="edit-album-name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Введите новое название альбома"
              />
            </div>
            <Button 
              onClick={handleEditAlbum} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!newAlbumName.trim() || (albumToEdit && newAlbumName.trim() === albumToEdit.name)}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Диалог удаления альбома */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить альбом</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить альбом "{albumToDelete?.name}"? Все фотографии в этом альбоме будут удалены.
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
      
      {/* Диалог удаления всех альбомов */}
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить все альбомы</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Вы уверены, что хотите удалить все альбомы? Это действие невозможно отменить.
              Все фотографии во всех альбомах будут удалены.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteAllDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteAllAlbums}
            >
              Удалить все
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
