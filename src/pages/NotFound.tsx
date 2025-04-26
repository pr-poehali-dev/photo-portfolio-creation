
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-portfolio-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Страница не найдена</h2>
        <p className="text-gray-600 mb-6">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Button asChild>
          <Link to="/" className="bg-portfolio-primary hover:bg-portfolio-secondary">
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
