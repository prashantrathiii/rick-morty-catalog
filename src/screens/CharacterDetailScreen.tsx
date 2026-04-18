import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';
import {
  fetchCharacterByIdThunk,
  selectCharacterById,
} from '../store/slices/charactersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type Props = RootStackScreenProps<'CharacterDetail'>;

export default function CharacterDetailScreen({ route }: Props) {
  const { characterId } = route.params;
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const character = useAppSelector((s) => selectCharacterById(s, characterId));

  useEffect(() => {
    if (!character) {
      dispatch(fetchCharacterByIdThunk(characterId));
    }
  }, [character, characterId, dispatch]);

  if (!character) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.hint}>Loading character…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.title}>{character.name}</Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Status: </Text>
        {character.status}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Species: </Text>
        {character.species}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Gender: </Text>
        {character.gender}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Origin: </Text>
        {character.origin.name}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Last known location: </Text>
        {character.location.name}
      </Text>
      <Text style={styles.line}>
        <Text style={styles.label}>Episodes: </Text>
        {character.episode.length}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hint: {
    marginTop: 8,
    color: '#6b7280',
  },
  content: {
    padding: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  line: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#111',
  },
});
