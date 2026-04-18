import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { appStateChanged } from '../store/slices/lifecycleSlice';

export function useAppLifecycle() {
  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      dispatch(appStateChanged(next));
      if (__DEV__) {
        console.log(`[AppState] ${prev} -> ${next}`);
      }
    });

    dispatch(appStateChanged(AppState.currentState));

    return () => sub.remove();
  }, [dispatch]);
}
