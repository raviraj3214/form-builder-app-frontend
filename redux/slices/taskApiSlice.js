import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setTasks, addTaskLocal, updateTaskLocal, deleteTaskLocal } from './taskSlice';
import customBaseQuery from './customBaseQuery';

export const taskApiSlice = createApi({
  reducerPath: 'taskApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    fetchTasks: builder.query({
      query: (range) => `/tasks?range=${range}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTasks(data.data.tasks)); 
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      },
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
        headers: { 'Content-Type': 'application/json' },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addTaskLocal(data)); 
        } catch (error) {
          console.error('Error adding task:', error);
        }
      },
    }),
    updateTask: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: updates,
        headers: { 'Content-Type': 'application/json' },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateTaskLocal({ id: arg.id, updates: data.data.task })); 
        } catch (error) {
          console.error('Error updating task:', error);
        }
      },
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(deleteTaskLocal(arg)); // Remove task from the store
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useLazyFetchTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApiSlice;
