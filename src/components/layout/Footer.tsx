import React from 'react';
import { PawPrint, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <PawPrint className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Happy-Paws</span>
          </div>
          
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for pet lovers
          </p>
          
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Happy-Paws. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
