import { combineReducers } from '@reduxjs/toolkit';
import charactersReducer from './slices/charactersSlice';
import lifecycleReducer from './slices/lifecycleSlice';

const rootReducer = combineReducers({
  characters: charactersReducer,
  lifecycle: lifecycleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
