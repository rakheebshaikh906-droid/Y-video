
import { useState } from "react";

const categories = [
    "All",
    "Music",
    "Gaming",
    "Coding",
    "Live",
    "Technology",
    "Cricket",
    "Podcasts",
    "News",
    "Recently uploaded",
];

function CategoryBar({ onCategoryChange }) {
    const [activeCategory, setActiveCategory] = useState("All");

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        onCategoryChange?.(category);
    };

    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex w-max min-w-full gap-3 pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeCategory === category
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryBar;
