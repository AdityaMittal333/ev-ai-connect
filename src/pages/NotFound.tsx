import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8 inline-block">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</span>
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-xl text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <a href="/">
          <Button size="lg" className="gradient-primary">
            Return to Home
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
