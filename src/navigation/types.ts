import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { characterId: number };
  About: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
