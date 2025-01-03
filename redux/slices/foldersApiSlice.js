import { createApi } from '@reduxjs/toolkit/query/react';
import customBaseQuery from './customBaseQuery'; 

export const foldersApi = createApi({
  reducerPath: 'foldersApi',
  baseQuery: customBaseQuery, 
  endpoints: (builder) => ({
    createFolder: builder.mutation({
      query: (credentials) => ({
        url: '/folder/createfolder',
        method: 'POST',
        body: credentials,
      }),
    }),
    deleteFolder: builder.mutation({
      query: (folderId) => ({
        url: `/folder/deletefolder/${folderId}`,
        method: 'DELETE',
      }),
    }),
    getUserFolders: builder.query({
      query: () => ({
        url: '/folder/user',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useLazyGetUserFoldersQuery,
} = foldersApi;
