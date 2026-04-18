import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';
import {
  clearError,
  fetchCharactersPage,
  selectCharactersForList,
  selectCharactersMeta,
  setSearchQuery,
} from '../store/slices/charactersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Character } from '../types/api';

const DEBOUNCE_MS = 500;
const LIST_PAGE_SIZE_HINT = 20;
/** Avoid hammering the API when onEndReached fires repeatedly while scrolling. */
const MIN_MS_BETWEEN_PAGE_LOADS = 450;

type Props = RootStackScreenProps<'CharacterList'>;

export default function CharacterListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const list = useAppSelector(selectCharactersForList);
  const { loading, error, hasMore, page, searchQuery } =
    useAppSelector(selectCharactersMeta);

  const [input, setInput] = useState(searchQuery);
  const lastPageLoadAt = useRef(0);

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (input !== searchQuery) {
        dispatch(setSearchQuery(input));
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [dispatch, input, searchQuery]);

  useEffect(() => {
    dispatch(fetchCharactersPage({ page: 1, name: searchQuery }));
  }, [dispatch, searchQuery]);

  const onEndReached = useCallback(() => {
    if (loading !== 'idle' || !hasMore) {
      return;
    }
    const now = Date.now();
    if (now - lastPageLoadAt.current < MIN_MS_BETWEEN_PAGE_LOADS) {
      return;
    }
    lastPageLoadAt.current = now;
    dispatch(
      fetchCharactersPage({ page: page + 1, name: searchQuery }),
    );
  }, [dispatch, hasMore, loading, page, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        onPress={() =>
          navigation.navigate('CharacterDetail', { characterId: item.id })
        }>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {item.species} · {item.status}
          </Text>
        </View>
      </Pressable>
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Character) => String(item.id), []);

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <TextInput
          accessibilityLabel="Search characters by name"
          placeholder="Search by name"
          placeholderTextColor="#888"
          style={styles.search}
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <Pressable
          accessibilityRole="button"
          style={styles.aboutLink}
          onPress={() => navigation.navigate('About')}>
          <Text style={styles.aboutLinkText}>About</Text>
        </Pressable>
      </View>
    ),
    [input, navigation],
  );

  const footer = useMemo(() => {
    if (loading === 'pending' && page > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  }, [loading, page]);

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {listHeader}
      {loading === 'refreshing' && list.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.hint}>Loading…</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.banner}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              dispatch(clearError());
              dispatch(
                fetchCharactersPage({ page: 1, name: searchQuery }),
              );
            }}>
            <Text style={styles.retry}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          loading === 'idle' && !error ? (
            <Text style={styles.empty}>No characters to show.</Text>
          ) : null
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={footer}
        initialNumToRender={12}
        maxToRenderPerBatch={LIST_PAGE_SIZE_HINT}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  search: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  aboutLink: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  aboutLinkText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  rowPressed: {
    backgroundColor: '#f3f4f6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  sub: {
    marginTop: 2,
    fontSize: 14,
    color: '#6b7280',
  },
  center: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 8,
    color: '#6b7280',
  },
  banner: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#fecaca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
  },
  retry: {
    color: '#2563eb',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#6b7280',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
