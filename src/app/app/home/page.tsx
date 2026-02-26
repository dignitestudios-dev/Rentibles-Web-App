import React, { Suspense } from "react";
import LocationAndSearch from "./_components/location-and-search";
import Stores from "./_components/stores";
import Categories from "./_components/categories";
import Products from "./_components/products";

const Home = () => {
  return (
    <main className="py-5">
      <LocationAndSearch />
      <Stores />
      <Suspense fallback={<div>Loading...</div>}>
        <Categories />
        <Products />
      </Suspense>
    </main>
  );
};

export default Home;
