import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, clearUser } from './authSlice';
import customBaseQuery from './customBaseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
        
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data)); 
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    }),
    register: builder.mutation({
        query: (credentials) => ({
          url: '/user/signup',
          method: 'POST',
          body: credentials,
          
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setUser(data.info)); // Update Redux state
          } catch (error) {
            console.error('Login error:', error);
          }
        },
      }),
    logout: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser()); 
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    updateInfo: builder.mutation({
      query: (credentials) => ({
        url: '/user/updateuser',
        method: 'PUT',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          dispatch(setUser(response.data)); 
        } catch (error) {
          console.error('Update Info error:', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useUpdateInfoMutation, useRegisterMutation } = authApi;
