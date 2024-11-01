import useFavouriteStore from "@/hooks/state/favorite-store";
import { Movie } from "@/types";
import { Heart } from "lucide-react";
import Image from "next/image";
import React, { FC, memo } from "react";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: FC<MovieCardProps> = memo(({ movie }) => {
  const toggleFavorite = useFavouriteStore((state) => state.toggleFavorite);
  const movies = useFavouriteStore((state) => state.favoriteMovies);

  const isFavorite = (movie: Movie) => {
    return movies.some((m) => m.id === movie.id);
  };

  return (
    <div key={movie.id} className="">
      <div className="relative overflow-hidden rounded-lg border aspect-[9/16]">
        <div className="bg-gradient-to-br from-black/30 to-transparent absolute inset-0 size-full z-[9]"></div>
        <button
          className="absolute top-0 left-0 p-2 z-10 size-6 focus-visible:outline-none"
          onClick={() => toggleFavorite(movie)}
        >
          {/* <HeartFilledIcon className="text-red-500 size-5" /> */}
          {isFavorite(movie) ? (
            <Heart className="size-5" fill="red" stroke="red" />
          ) : (
            <Heart className="text-white size-5" />
          )}
        </button>
        <Image
          height={750}
          width={500}
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="object-cover absolute inset-0 size-full"
          unoptimized
        />
      </div>
      <h3 className="text-sm md:text-base font-medium mt-2 line-clamp-2 text-foreground !leading-snug">
        {movie.title}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground">
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "2020"}
      </p>
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
