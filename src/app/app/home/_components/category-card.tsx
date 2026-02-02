import React from "react";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="bg-app w-fit py-2 px-4 rounded-md cursor-pointer">
      <p className="uppercase select-none">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
