import React, { useState, useEffect } from 'react';
import { RestaurantProfile } from './types';
import { getStoredRestaurantData } from './data/restaurant';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MenuSection } from './components/MenuSection';
import { HoursLocation } from './components/HoursLocation';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';

export const App: React.FC = () => {
  const [restaurant, setRestaurant] = useState<RestaurantProfile>(getStoredRestaurantData());
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  
  
  
  
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-brand-secondary selection:text-black">
      <Navbar
        restaurant={restaurant}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      <main className="flex-grow">
        <Hero
          restaurant={restaurant}
          onOpenReservation={() => setIsReservationOpen(true)}
        />
        <About restaurant={restaurant} />
        <MenuSection categories={restaurant.menu} />
        <HoursLocation
          restaurant={restaurant}
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      </main>

      <Footer restaurant={restaurant} />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        restaurant={restaurant}
      />
    </div>
  );
};

export default App;
