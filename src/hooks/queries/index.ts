import tmdb from "@/lib/tmdb";
import { SearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const KEYS = {
  KEY_SEARCH_MOVIE: "search-movie",
};

export const useSearchMovie = (query: string, page: number = 1) => {
  return useQuery<SearchResponse, Error>({
    queryKey: [KEYS.KEY_SEARCH_MOVIE, query, page],
    queryFn: () => tmdb.search(query, 1),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: query.length > 0,
  });
};