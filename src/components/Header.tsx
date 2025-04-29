
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FolderIcon, HomeIcon } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header = ({ title = "Фотогалерея", showBackButton = false }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <HomeIcon className="w-5 h-5" />
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-2">
            <FolderIcon className="w-6 h-6 text-portfolio-primary" />
            <h1 className="text-xl font-bold text-portfolio-text">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-portfolio-primary hover:bg-portfolio-secondary text-white" 
            size="sm"
          >
            Войти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
