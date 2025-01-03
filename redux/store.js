import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage)
import { persistStore, persistReducer } from 'redux-persist';
import { authApi } from './slices/authApiSlice';
import authReducer from './slices/authSlice'; 
import {formApiSlice} from './slices/formApiSlice';
import { foldersApi } from './slices/foldersApiSlice';
import { workspacesApi } from './slices/workspacesApiSlice';


// Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer, 
  [authApi.reducerPath]: authApi.reducer,
  [foldersApi.reducerPath]: foldersApi.reducer,
  [formApiSlice.reducerPath]: formApiSlice.reducer,
  [workspacesApi.reducerPath]: workspacesApi.reducer,
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }).concat(authApi.middleware).concat(foldersApi.middleware).concat(formApiSlice.middleware).concat(workspacesApi.middleware),
});

// Setup Redux Persistor
export const persistor = persistStore(store);

// Enable RTK Query Listeners
setupListeners(store.dispatch);

export default store;
