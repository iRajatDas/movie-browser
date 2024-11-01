"use client";
import { Input } from "@/components/ui/input";
import { tmdbGenres } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Heart, Loader2, Search } from "lucide-react";
import MovieCard from "@/components/movie-card";
import tmdb from "@/lib/tmdb";
import { Movie, SearchResponse } from "@/types";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export default function Page() {
  const observerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [maxRating, setMaxRating] = useState<number>(8);
  const debouncedMaxRating = useDebounce(maxRating, 300);

  // Fetch movies with filters
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);

      try {
        const data: SearchResponse = await tmdb.search(
          debouncedSearchTerm,
          page,
          {
            genre: selectedGenre,
            year: selectedYear,
            ratingMin: 1,
            ratingMax: debouncedMaxRating,
          }
        );

        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );

        setHasMore(data.total_pages > page);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [
    page,
    debouncedSearchTerm,
    selectedGenre,
    selectedYear,
    debouncedMaxRating,
  ]);

  // Reset page and movies on new search term or filter change
  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, [debouncedSearchTerm, selectedGenre, selectedYear]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // IntersectionObserver callback to load more movies
  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  return (
    <div className="max-w-3xl mx-auto w-full h-full space-y-4 overscroll-none">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Search for a movie
        </h1>

        {/* Action for Favorites Page */}
        <Link
          className="flex items-center bg-rose-500 hover:bg-rose-600 transition-all md:hover:scale-105 px-3 py-2 text-white rounded"
          href="/favorites"
        >
          <Heart className="mr-2 size-4" />
          <span className="text-sm font-medium">Favorites</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative group/search">
        <div className="rounded-xl bg-muted/50 relative">
          <Input
            value={searchTerm}
            onChange={onSearchChange}
            type="text"
            className="block w-full h-full p-4 lg:text-lg font-medium placeholder-gray-500 bg-transparent"
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-sidebar-foreground/70"
            onClick={() => setPage(1)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </div>
      </div>

      {/* Filters */}
      {movies.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Genre Filter */}
            <div className="flex items-center shrink-0">
              <label htmlFor="genre" className="mr-2 font-medium sr-only">
                Genre:
              </label>
              <select
                id="genre"
                onChange={(e) => setSelectedGenre(e.target.value)}
                value={selectedGenre}
                className="p-2 rounded-md border border-gray-300"
              >
                <option value="">All Genres</option>
                {Object.entries(tmdbGenres).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center shrink-0">
              <label htmlFor="year" className="mr-2 font-medium sr-only">
                Year:
              </label>
              <input
                type="number"
                id="year"
                min="1900"
                max="2023"
                placeholder="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
                className="p-2 rounded-md border border-gray-300"
              />
            </div>
            {/* Rating Range Filter */}
            <div className="flex flex-col w-full max-md:flex-1">
              <label className="mr-2 text-sm font-semibold">Rating:</label>

              <div className="flex items-center gap-2 w-full">
                <span className="shrink-0">0</span>

                <Slider
                  defaultValue={[7]}
                  value={[maxRating]}
                  min={1}
                  max={10}
                  step={0.1}
                  className="w-full flex-1"
                  onValueChange={([value]) => {
                    setMaxRating(value);
                  }}
                />
                <span className="ml-2">{maxRating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="rounded-xl transition-opacity duration-300">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies?.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
          {hasMore && !isLoading && (
            <div ref={observerRef} style={{ height: "1px" }} />
          )}
        </div>
        {isLoading && (
          <div className="grid place-items-center mt-12">
            <p className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
