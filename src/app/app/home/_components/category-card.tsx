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
  selected?: boolean;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, selected = false, onClick }) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className={`w-fit py-2 px-4 rounded-md text-foreground cursor-pointer select-none transition-colors ${
        selected ? "bg-primary text-white" : "bg-app"
      }`}
    >
      <p className="uppercase">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
