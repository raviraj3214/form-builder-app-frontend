import { createApi } from '@reduxjs/toolkit/query/react';
import customBaseQuery from './customBaseQuery';

export const workspacesApi = createApi({
  reducerPath: 'workspacesApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    shareWorkspace: builder.mutation({
      query: (credentials) => ({
        url: '/workspace/share',
        method: 'POST',
        body: credentials,
      }),
    }),
    deleteWorkspace: builder.mutation({
      query: (workspaceId) => ({
        url: `/workspace/deleteworkspace/${workspaceId}`,
        method: 'DELETE',
      }),
    }),
    getUserWorkspaces: builder.query({
      query: () => ({
        url: '/workspace/workspaces',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useShareWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useLazyGetUserWorkspacesQuery,
} = workspacesApi;
