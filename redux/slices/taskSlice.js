import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    isLoading: false,
    error: null,
    selectedDateRange: { id: 2, name: 'This week', value: 7 },
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTaskLocal: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTaskLocal: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task._id === id);
      if (taskIndex > -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
    },
    deleteTaskLocal: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
  },
});

export const {
  setTasks,
  addTaskLocal,
  updateTaskLocal,
  deleteTaskLocal,
  setLoading,
  setError,
  setDateRange,
} = taskSlice.actions;

export default taskSlice.reducer;
