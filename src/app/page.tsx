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
import { Button, buttonVariants } from "@/components/ui/button";

export default function Page() {
  const observerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [data, setData] = useState<SearchResponse | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // State to check if user has searched, then show message if no results
  // this is to prevent showing the message on initial load
  const [hasSearched, setHasSearched] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    maxRating: 8,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    genre: "",
    year: "",
    maxRating: 8,
  });

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters when button is clicked
  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
    setMovies([]);
    setHasMore(true);
  };

  // Fetch movies with applied filters
  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedSearchTerm.trim()) {
        // Reset state when search term is empty
        setMovies([]);
        setData(null);
        setHasMore(false);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true); // Set hasSearched to true when making a request

      const filterPayload = {
        genre: appliedFilters.genre,
        year: appliedFilters.year,
        ratingMin: 1,
        ratingMax: appliedFilters.maxRating,
      };

      try {
        const data: SearchResponse = await tmdb.search(
          debouncedSearchTerm,
          page,
          filterPayload
        );

        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setData(data);

        setHasMore(page < data.total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page, debouncedSearchTerm, appliedFilters]);

  // Reset page and movies on new search term
  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // IntersectionObserver callback to load more movies: for infinite scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;

    const FULLY_VISIBLE = 1.0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: FULLY_VISIBLE }
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
          className={buttonVariants({
            variant: "outline",
          })}
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
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 size-5 text-sidebar-foreground/70"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <div className="flex items-center gap-3 max-md:flex-wrap">
          <div className="grid max-md:grow md:shrink-0 grid-cols-2 gap-3">
            {/* Genre Filter */}
            <div className="flex items-center">
              <label htmlFor="genre" className="mr-2 font-medium sr-only">
                Genre:
              </label>
              <select
                id="genre"
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                value={filters.genre}
                className="p-2 rounded-md border border-gray-300 w-full text-sm"
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
            <div className="flex items-center">
              <label htmlFor="year" className="mr-2 font-medium sr-only">
                Year:
              </label>
              <select
                id="year"
                onChange={(e) => handleFilterChange("year", e.target.value)}
                value={filters.year}
                className="p-2 rounded-md border border-gray-300 w-full text-sm"
              >
                <option value="">All Years</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1900 + 1 },
                  (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Rating Range Filter */}
          <div className="flex flex-col w-full max-md:flex-1 max-md:min-w-full">
            <label className="mr-2 text-sm font-semibold">Rating:</label>

            <div className="flex items-center gap-2 w-full">
              <span className="shrink-0 text-sm font-medium">1</span>

              <Slider
                value={[filters.maxRating]}
                min={1}
                max={10}
                step={0.1}
                className="w-full flex-1"
                onValueChange={([value]) => {
                  handleFilterChange("maxRating", value);
                }}
              />
              <span className="ml-2 text-sm font-medium">
                {filters.maxRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button
            onClick={applyFilters}
            className="shrink-0 text-sm"
            disabled={isLoading}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="rounded-xl transition-opacity duration-300">
        {hasSearched && data && data.total_results === 0 ? (
          <div className="grid place-items-center mt-12">
            <p className="text-center text-lg">
              No movies found for your search criteria.
            </p>
            <p className="text-center text-sm text-gray-500">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        {/* End of Pagination Message */}
        {hasSearched && !hasMore && movies.length > 0 && (
          <div className="grid place-items-center mt-8">
            <p className="text-center text-sm text-gray-500">
              You&apos;ve reached the end of the list.
            </p>
          </div>
        )}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="grid place-items-center mt-12">
            <p className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </p>
          </div>
        )}
        {/* Observer Element for Infinite Scroll */}
        {hasMore && !isLoading && movies.length > 0 && (
          <div ref={observerRef} style={{ height: "1px" }} />
        )}
      </div>
    </div>
  );
}
