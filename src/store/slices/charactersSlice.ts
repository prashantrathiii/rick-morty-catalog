import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  fetchCharacterById,
  fetchCharactersPage as fetchCharactersPageApi,
} from '../../api/rickAndMorty';
import type { Character } from '../../types/api';

export type CharactersLoading = 'idle' | 'pending' | 'refreshing';

type CharactersState = {
  ids: number[];
  entities: Record<number, Character>;
  page: number;
  totalPages: number;
  hasMore: boolean;
  loading: CharactersLoading;
  error: string | null;
  searchQuery: string;
};

const initialState: CharactersState = {
  ids: [],
  entities: {},
  page: 0,
  totalPages: 0,
  hasMore: true,
  loading: 'idle',
  error: null,
  searchQuery: '',
};

export const fetchCharactersPage = createAsyncThunk(
  'characters/fetchPage',
  async (
    { page, name }: { page: number; name: string },
    { rejectWithValue },
  ) => {
    try {
      return await fetchCharactersPageApi(page, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  },
);

export const fetchCharacterByIdThunk = createAsyncThunk(
  'characters/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      return await fetchCharacterById(id);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  },
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.ids = [];
      state.entities = {};
      state.page = 0;
      state.totalPages = 0;
      state.hasMore = true;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharactersPage.pending, (state, action) => {
        const isFirst = action.meta.arg.page === 1;
        state.loading = isFirst ? 'refreshing' : 'pending';
        if (isFirst) {
          state.error = null;
        }
      })
      .addCase(fetchCharactersPage.fulfilled, (state, action) => {
        state.loading = 'idle';
        const { results, info } = action.payload;
        const append = action.meta.arg.page > 1;
        if (!append) {
          state.ids = [];
          state.entities = {};
        }
        for (const c of results) {
          if (!state.entities[c.id]) {
            state.ids.push(c.id);
            state.entities[c.id] = c;
          }
        }
        state.page = action.meta.arg.page;
        state.totalPages = info.pages;
        state.hasMore = Boolean(info.next);
      })
      .addCase(fetchCharactersPage.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = String(action.payload ?? 'Unknown error');
      })
      .addCase(fetchCharacterByIdThunk.fulfilled, (state, action) => {
        const c = action.payload;
        state.entities[c.id] = c;
        if (!state.ids.includes(c.id)) {
          state.ids.unshift(c.id);
        }
      });
  },
});

export const { setSearchQuery, clearError } = charactersSlice.actions;

type CharactersRoot = { characters: CharactersState };

export const selectCharacterById = (state: CharactersRoot, id: number) =>
  state.characters.entities[id];

export const selectCharactersForList = (state: CharactersRoot) =>
  state.characters.ids.map((i) => state.characters.entities[i]);

export const selectCharactersMeta = (state: CharactersRoot) => ({
  loading: state.characters.loading,
  error: state.characters.error,
  hasMore: state.characters.hasMore,
  page: state.characters.page,
  searchQuery: state.characters.searchQuery,
});

export default charactersSlice.reducer;
