import { Movie } from "@/types";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

type FavouriteStore = {
  favoriteMovies: Movie[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (movie: Movie) => boolean;
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

          return {
            favoriteMovies: [...state.favoriteMovies, movie],
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
