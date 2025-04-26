
import { useState } from "react";
import Header from "@/components/Header";
import AlbumCard, { Album } from "@/components/AlbumCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlusIcon, InfoIcon, Trash2 } from "lucide-react";
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
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      const newAlbum: Album = {
        id: `album-${Date.now()}`,
        name: newAlbumName.trim(),
        count: 0
      };
      
      setAlbums([...albums, newAlbum]);
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
  
  const handleDeleteAlbum = () => {
    if (albumToDelete) {
      setAlbums(albums.filter(album => album.id !== albumToDelete.id));
      toast({
        title: "Альбом удален",
        description: `Альбом "${albumToDelete.name}" был успешно удален`,
      });
      setIsDeleteDialogOpen(false);
      setAlbumToDelete(null);
    }
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
              onClick={() => setIsInfoDialogOpen(true)}
              variant="outline"
              className="gap-1"
            >
              <InfoIcon className="w-4 h-4" />
              <span>Тарифы</span>
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
                <button
                  onClick={(e) => openDeleteDialog(album, e)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
      
      {/* Диалог с информацией о тарифах */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Тарифы и хранилище</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h3 className="font-medium">Бесплатный тариф</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>5 ГБ бесплатного хранилища</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>До 3 альбомов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Базовые форматы фотографий (JPG, PNG)</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Премиум тариф — 299 ₽/месяц</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>50 ГБ хранилища</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Неограниченное количество альбомов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Поддержка RAW форматов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Расширенные инструменты организации</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Профессиональный тариф — 899 ₽/месяц</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>200 ГБ хранилища</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Все функции премиум-тарифа</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Приоритетная поддержка</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Публичные галереи для клиентов</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">
                Для увеличения хранилища выберите подходящий тариф в личном кабинете.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsInfoDialogOpen(false)} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Понятно
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
