import React from "react";
import LocationAndSearch from "./_components/location-and-search";
import Stores from "./_components/stores";
import Categories from "./_components/categories";
import Products from "./_components/products";

const Home = () => {
  return (
    <main className="py-5">
      <LocationAndSearch />
      <Stores />
      <Categories />
      <Products />
    </main>
  );
};

export default Home;
