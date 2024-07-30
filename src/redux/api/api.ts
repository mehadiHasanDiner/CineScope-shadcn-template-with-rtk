/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["movies"],

  endpoints: (builder) => ({
    getMovies: builder.query({
      query: () => ({
        url: "/movies",
        method: "GET",
      }),
      providesTags: ["movies"],
    }),
    addRating: builder.mutation({
      query: ({ data, slug }) => {
        // console.log(data);
        return {
          url: `/movies/${slug}/review`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["movies"],
    }),
    getSingleMovie: builder.query({
      query: (slug: string) => ({
        // console.log(data);
        url: `/movies/${slug}`,
        method: "GET",
      }),
      providesTags: ["movies"],
    }),
    getMovieDetailsAndReviews: builder.query({
      queryFn: async (slug: string): Promise<any> => {
        try {
          const [movieResponse, reviewResponse] = await Promise.all([
            fetch(`http://localhost:5000/api/movies/${slug}`),
            fetch(`http://localhost:5000/api/movies/${slug}/reviews`),
          ]);
          if (!movieResponse.ok || !reviewResponse.ok) {
            throw new Error("Something went wrong");
          }
          const [movieData, reviewData] = await Promise.all([
            movieResponse.json(),
            reviewResponse.json(),
          ]);
          return {
            data: {
              movie: movieData,
              reviews: reviewData,
            },
          };
        } catch (err) {
          return err;
        }
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useAddRatingMutation,
  useGetSingleMovieQuery,
  useGetMovieDetailsAndReviewsQuery,
} = baseApi;
