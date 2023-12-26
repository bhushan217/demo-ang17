import { ObjectKey } from './object-key.model';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import {
  EntityState,
  baseNumberAdapter,
  booleanAdapter,
  createEntityAdapter,
  numberAdapter,
  stringAdapter,
} from '@state-adapt/core/adapters';

export interface SearchState {
  key: string;
  value: any;
  condition: string;
}

export interface State {
  activeObjectKeyId: number | null;
  // search: SearchState[] | null;
  isLoading: boolean;
  error: any | null;
  objectKeys: EntityState<ObjectKey>; // https://github.com/state-adapt/state-adapt/blob/main/libs/core/adapters/src/lib/create-entity-adapter.function.ts#LL17C1-L23C2
}

const searchStateAdapter = joinAdapters<SearchState, keyof SearchState>()({
  key: stringAdapter,
  value: stringAdapter,
  condition: stringAdapter,
})();
const objectKeyAdapter = joinAdapters<ObjectKey, keyof ObjectKey>()({
  keyName: stringAdapter,
  label: stringAdapter,
  description: stringAdapter,
})(); // https://state-adapt.github.io/docs/core#joinadapters
const objectKeysAdapter = createEntityAdapter<ObjectKey>()(objectKeyAdapter, {
  // filters: ['keyName'],
  // sorters: ['label'],
  // page: 0,
  // size: 5,
  // useCache: true
}); // https://state-adapt.github.io/adapters/core#createEntityAdapter

const errorAdapter = createAdapter<object | null>()({}); // https://state-adapt.github.io/docs/core#createadapter
// https://state-adapt.github.io/docs/core#createadapter
const activeObjectKeyIdAdapter = createAdapter<number | null>()({
  setNull: () => null,
  reset: () => 0,
});

// https://state-adapt.github.io/docs/core#joinadapters
export const adapter = joinAdapters<State>()({
  activeObjectKeyId: activeObjectKeyIdAdapter,
  searchParams: [],
  isLoading: booleanAdapter,
  error: errorAdapter,
  objectKeys: objectKeysAdapter,
})({
  activeObjectKey: (s) => {
    if (s.activeObjectKeyId)
      return s.objectKeysEntities[s.activeObjectKeyId] ?? null;

    return null;
  },
  totalCount: (s) => s.objectKeysAll.length,
})({
  receiveObjectKeys: {
    isLoading: booleanAdapter.setFalse,
    objectKeys: objectKeysAdapter.setAll,
  },
  receiveError: {
    isLoading: booleanAdapter.setFalse,
    error: errorAdapter.set,
  },
  addObjectKey: {
    activeObjectKeyId: activeObjectKeyIdAdapter.reset,
    objectKeys: objectKeysAdapter.addOne,
  },
  updateObjectKey: {
    activeObjectKeyId: activeObjectKeyIdAdapter.reset,
    objectKeys: objectKeysAdapter.updateOne,
  },
})();
