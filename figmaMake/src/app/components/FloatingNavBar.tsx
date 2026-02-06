import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

export function FloatingNavBar() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'bag', icon: ShoppingBag, label: 'Bag' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black px-6 py-4 shadow-2xl z-50"
      style={{
        borderRadius: '999px',
      }}
    >
      <div className="flex gap-8 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-all duration-200 ${
                isActive ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={item.label}
            >
              <Icon 
                size={22} 
                color="white" 
                strokeWidth={1.5}
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
