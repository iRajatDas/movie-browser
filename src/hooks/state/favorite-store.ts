import { FavouriteMovie } from "@/types";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

type FavouriteStore = {
  favoriteMovies: FavouriteMovie[];
  toggleFavorite: (movie: FavouriteMovie) => void;
  isFavorite: (movie: FavouriteMovie) => boolean;
};

type MyPersist = (
  config: StateCreator<FavouriteStore>,
  options: PersistOptions<FavouriteStore>
) => StateCreator<FavouriteStore>;

const useFavouriteStore = create<FavouriteStore, []>(
  (persist as MyPersist)(
    (set, get): FavouriteStore => ({
      favoriteMovies: [],
      toggleFavorite(movie) {
        set((state) => {
          const isFavorite = state.favoriteMovies.some(
            (favMovie) => favMovie.id === movie.id
          );

          if (isFavorite) {
            return {
              favoriteMovies: state.favoriteMovies.filter(
                (favMovie) => favMovie.id !== movie.id
              ),
            };
          }

          const movieWithDate = {
            ...movie,
            dateAdded: Date.now(),
          } satisfies FavouriteMovie;

          return {
            favoriteMovies: [...state.favoriteMovies, movieWithDate],
          };
        });
      },
      isFavorite(movie) {
        return get().favoriteMovies.some(
          (favMovie) => favMovie.id === movie.id
        );
      },
    }),
    {
      name: "favorite-movies",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFavouriteStore;
