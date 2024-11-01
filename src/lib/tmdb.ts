import { SearchResponse } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`,
  },
});

const tmdb = {
  search: async (
    query: string,
    page: number = 1,
    filters: {
      year?: string;
      genre?: string;
      ratingMin?: number;
      ratingMax?: number;
    } = {}
  ): Promise<SearchResponse> => {
    if (!query.trim()) {
      return { results: [], total_pages: 0, total_results: 0, page: 1 };
    }

    // Build filters into query string
    const filtersQuery = new URLSearchParams({
      ...(filters.year && { primary_release_year: filters.year }),
      ...(filters.genre && { with_genres: filters.genre }),
      ...(filters.ratingMin && {
        "vote_average.gte": filters.ratingMin.toString(),
      }),
      ...(filters.ratingMax && {
        "vote_average.lte": filters.ratingMax.toString(),
      }),
    }).toString();

    const url = `/search/movie?query=${encodeURIComponent(
      query
    )}&page=${page}&${filtersQuery}`;

    try {
      const { data } = await api.get<SearchResponse>(url);
      return data;
    } catch (error) {
      console.error("Error fetching movie search results:", error);
      return { results: [], total_pages: 0, total_results: 0, page: 1 };
    }
  },
};

export default tmdb;
