import { createApi } from '@reduxjs/toolkit/query/react';
import customBaseQuery from './customBaseQuery'; 

export const formApiSlice = createApi({
  reducerPath: 'formApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    saveForm: builder.mutation({
      query: (formDetails) => ({
        url: '/form/saveform',
        method: 'POST',
        body: formDetails,
      }),
    }),
    updateForm: builder.mutation({
      query: ({ formId, formDetails }) => ({
        url: `/form/updateform/${formId}`,
        method: 'PUT',
        body: formDetails,
      }),
    }),
    getFormsByUser: builder.query({
      query: () => ({
        url: `/form/user`,
        method: 'GET',
      }),
    }),
    fetchFormById: builder.query({
      query: (formId) => ({
        url: `/form/fetchform/${formId}`,
        method: 'GET',
      }),
    }),
    fetchFormByUniqueUrl: builder.query({
      query: (uniqueUrl) => ({
        url: `/form/fetchByUniqueUrl/${uniqueUrl}`,
        method: 'GET',
      }),
    }),
    getFormsByFolder: builder.query({
      query: (folderId) => ({
        url: `/form/folder/${folderId}`,
        method: 'GET',
      }),
    }),
    saveFormResponse: builder.mutation({
      query: ({ uniqueUrl, response }) => ({
        url: `/responses/saveResponse/${uniqueUrl}`,
        method: 'POST',
        body: response,
      }),
    }),
    fetchFormResponses: builder.query({
      query: (formId) => ({
        url: `/responses/form/${formId}/responses`,
        method: 'GET',
      }),
    }),
    updateFormTheme: builder.mutation({
      query: ({ formId, theme }) => ({
        url: `/form/updateTheme/${formId}`,
        method: 'PUT',
        body: { theme },
      }),
    }),
    deleteForm: builder.mutation({
      query: (formId) => ({
        url: `/form/deleteform/${formId}`,
        method: 'DELETE',
      }),
    }),
    updateViewCount: builder.mutation({
      query: (formId) => ({
        url: `/forms/${formId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSaveFormMutation,
  useUpdateFormMutation,
  useGetFormsByUserQuery,
  useLazyGetFormsByUserQuery,
  useFetchFormByIdQuery,
  useLazyFetchFormByIdQuery,
  useFetchFormByUniqueUrlQuery,
  useLazyFetchFormByUniqueUrlQuery,
  useGetFormsByFolderQuery,
  useLazyGetFormsByFolderQuery,
  useSaveFormResponseMutation,
  useLazyFetchFormResponsesQuery,
  useUpdateFormThemeMutation,
  useDeleteFormMutation,
  useUpdateViewCountMutation,
} = formApiSlice;

