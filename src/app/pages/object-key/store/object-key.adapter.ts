import { ObjectKey } from './object-key.model';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import {
  EntityState,
  booleanAdapter,
  createEntityAdapter,
  stringAdapter,
} from '@state-adapt/core/adapters';

export interface State {
  activeObjectKeyId: number | null;
  isLoading: boolean;
  error: object | null;
  objectKeys: EntityState<ObjectKey>; // https://github.com/state-adapt/state-adapt/blob/main/libs/core/adapters/src/lib/create-entity-adapter.function.ts#LL17C1-L23C2
}

const objectKeyAdapter = joinAdapters<ObjectKey, keyof ObjectKey>()({
  keyName: stringAdapter,
  label: stringAdapter,
  description: stringAdapter
})(); // https://state-adapt.github.io/docs/core#joinadapters
const objectKeysAdapter = createEntityAdapter<ObjectKey>()(objectKeyAdapter,{
  filters: ['keyName'],
  sorters: ['label'],
  // page: 0,
  // size: 5,
  // useCache: true
}); // https://state-adapt.github.io/adapters/core#createEntityAdapter

const errorAdapter = createAdapter<object | null>()({}); // https://state-adapt.github.io/docs/core#createadapter
// https://state-adapt.github.io/docs/core#createadapter
const activeObjectKeyIdAdapter = createAdapter<number | null>()({
  setNull: () => null,
});

// https://state-adapt.github.io/docs/core#joinadapters
export const adapter = joinAdapters<State>()({
  activeObjectKeyId: activeObjectKeyIdAdapter,
  isLoading: booleanAdapter,
  error: errorAdapter,
  objectKeys: objectKeysAdapter,
})({
  activeObjectKey: (s) => {
    if (s.activeObjectKeyId) return s.objectKeysEntities[s.activeObjectKeyId] ?? null;

    return null;
  },
  //earningsTotals: (s) => calculateObjectKeysGrossEarnings(s.objectKeysAll),
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
    activeObjectKeyId: activeObjectKeyIdAdapter.setNull,
    objectKeys: objectKeysAdapter.addOne,
  },
  updateObjectKey: {
    activeObjectKeyId: activeObjectKeyIdAdapter.setNull,
    objectKeys: objectKeysAdapter.updateOne,
  },
})();