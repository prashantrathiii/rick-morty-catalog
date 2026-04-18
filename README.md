# Educase assignment — Rick and Morty browser

React Native CLI app (TypeScript) that loads a large, paginated dataset from a public API, supports search and infinite scrolling, uses Redux for state, persists character data locally, and records app lifecycle transitions.

## What it does

- **Characters** — Browse Rick and Morty characters from [The Rick and Morty API](https://rickandmortyapi.com/) with **infinite scroll** (loads the next page as you reach the end of the list).
- **Search** — Filter by name with **debounced** requests so typing does not spam the network.
- **Details** — Second screen shows a character’s profile (image, status, species, origin, location, episode count).
- **About** — Third screen summarizes the app and shows **recent `AppState` transitions** (foreground / background / inactive).
- **Persistence** — The characters slice (list, pagination metadata, search query) is **persisted with Redux Persist** to AsyncStorage so the last loaded data is available again after a cold start.
- **Lifecycle** — `AppState` is subscribed in `useAppLifecycle`; transitions are stored in Redux for the About screen.

UI uses **core React Native primitives only** (no UI kits). Navigation uses **React Navigation** (stack), which is separate from UI component libraries.

## How to run

**Prerequisites:** Node ≥ 22, JDK and Android Studio (for Android), Xcode (for iOS, macOS only). Follow the [official environment setup](https://reactnative.dev/docs/set-up-your-environment).

From this directory:

```sh
npm install
npm start
```

In another terminal:

```sh
# Android (emulator or device)
npm run android

# iOS (macOS): install pods after native dependency changes, then:
cd ios && bundle exec pod install && cd ..
npm run ios
```

**Tests:**

```sh
npm test
```

## Technical choices

| Area | Choice | Why |
|------|--------|-----|
| API | Rick and Morty REST API | Free, HTTPS, built-in **pagination** (`?page=`) and **name search** (`?name=`) |
| State | Redux Toolkit + react-redux | Fits the brief; async logic in `createAsyncThunk` |
| Persistence | redux-persist + AsyncStorage | Restores list + query after kill/relaunch; lifecycle slice is **not** persisted (session-only) |
| Navigation | `@react-navigation/native` + native stack | Standard stack navigation for three screens |
| Lists | `FlatList` + `keyExtractor` + windowing props | Keeps scrolling smooth on large lists |
| Search | Local debounce (400ms) | Reduces API calls while typing |

## Possible improvements (time permitting)

- Pull-to-refresh and explicit offline mode using persisted data when the network fails.
- Deeper error handling on the detail screen (failed single-character fetch).
- Unit tests for reducers/thunks and a small integration test for the list screen.
- Image caching or smaller thumbnails for slower networks.

## Project layout

- `App.tsx` — Providers (`redux`, `redux-persist`, safe area), `NavigationContainer`, lifecycle hook.
- `src/store/` — Store, persisted reducer, characters + lifecycle slices.
- `src/screens/` — List, detail, about.
- `src/api/` — Fetch helpers for the public API.
- `src/hooks/useAppLifecycle.ts` — `AppState` subscription.

---

Bootstrapped with `@react-native-community/cli` (React Native **0.85**, **no Expo**).
