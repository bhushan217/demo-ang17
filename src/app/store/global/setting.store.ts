import { adapt, provideStore } from '@state-adapt/angular';
import { Source } from '@state-adapt/rxjs';
import { tap } from 'rxjs';

import { getItem, removeItem, setItem } from 'app/store/utils/storage';
import { StateAdapt } from '@state-adapt/rxjs';

import { UserInfo, UserToken } from '../types/entity';
import { StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode } from '../types/enum';
import { Injectable } from '@angular/core';
import { createAdapter, joinAdapters } from '@state-adapt/core';

export const featureKey = 'settings';
type State = {
  themeColorPresets: ThemeColorPresets;
  themeMode: ThemeMode;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
};

const settingsAdapter = createAdapter<State>()({});

@Injectable({ providedIn: 'root' })
export class SettingStore{

   initialState: State = getItem<State>(StorageEnum.Settings) || {
    themeColorPresets: ThemeColorPresets.Default,
    themeMode: ThemeMode.Light,
    themeLayout: ThemeLayout.Vertical,
    themeStretch: false,
  };
  
   settingsChange$ = new Source<State>('settingsChange$');
   settingsReset$ = new Source<void>('settingsReset$');
  
   store = adapt(this.initialState, {
    adapter: settingsAdapter,
    sources: {
      set: this.settingsChange$.pipe(tap(({ payload }) => setItem(StorageEnum.Settings, payload))),
      reset: this.settingsReset$.pipe(tap(() => removeItem(StorageEnum.Settings))),
    },
  path: featureKey
  });
  // settingsStore.state$.subscribe();
  
  // export const useSettings = () => useStore(settingsStore).state;
}