"use client";
import  { Suspense, useState, useCallback } from "react";
import LocationAndSearch from "./_components/location-and-search";
import Stores from "./_components/stores";
import Categories from "./_components/categories";
import Products from "./_components/products";
import LocationModal from "./_components/location-modal";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setLatLng({ lat, lng });
      // setIsModalOpen(false);
    },
    [],
  );

  return (
    <main className="py-5">
      <LocationAndSearch onOpenModal={handleOpenModal} latLng={latLng} />
      <Stores />
      <Suspense fallback={<div>Loading...</div>}>
        <Categories />
        <Products />
      </Suspense>

      {isModalOpen && (
        <LocationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLocationSelect={handleLocationSelect}
          latLng={latLng}
        />
      )}
    </main>
  );
};

export default Home;