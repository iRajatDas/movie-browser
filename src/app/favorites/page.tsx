"use client";
import MovieCard from "@/components/movie-card";
import useFavouriteStore from "@/hooks/state/favorite-store";
import React from "react";

const FavoritesPage = () => {
  const favorites = useFavouriteStore((state) => state.favoriteMovies);
  return (
    <div className="max-w-3xl mx-auto w-full overscroll-none">
      <h1 className="text-2xl font-semibold tracking-tight">
        Your favorite movies
      </h1>
      <p className={`mt-2 text-gray-500 text-base`}>
        {favorites.length === 0
          ? "You have no favorite movies yet."
          : "Here are your favorite movies:"}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {favorites?.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
