import { UiType } from './ui-type.model';
import { createAdapter, joinAdapters } from '@state-adapt/core';
import {
  EntityState,
  booleanAdapter,
  createEntityAdapter,
} from '@state-adapt/core/adapters';

export interface State {
  activeUiTypeId: number | null;
  isLoading: boolean;
  error: object | null;
  uiTypes: EntityState<UiType>; // https://github.com/state-adapt/state-adapt/blob/main/libs/core/adapters/src/lib/create-entity-adapter.function.ts#LL17C1-L23C2
}

const uiTypeAdapter = joinAdapters<UiType, keyof UiType>()({})(); // https://state-adapt.github.io/docs/core#joinadapters
const uiTypesAdapter = createEntityAdapter<UiType>()(uiTypeAdapter); // https://state-adapt.github.io/adapters/core#createEntityAdapter

const errorAdapter = createAdapter<object | null>()({}); // https://state-adapt.github.io/docs/core#createadapter
// https://state-adapt.github.io/docs/core#createadapter
const activeUiTypeIdAdapter = createAdapter<number | null>()({
  setNull: () => null,
});

// https://state-adapt.github.io/docs/core#joinadapters
export const adapter = joinAdapters<State>()({
  activeUiTypeId: activeUiTypeIdAdapter,
  isLoading: booleanAdapter,
  error: errorAdapter,
  uiTypes: uiTypesAdapter,
})({
  activeUiType: (s) => {
    if (s.activeUiTypeId) return s.uiTypesEntities[s.activeUiTypeId] ?? null;

    return null;
  },
  //earningsTotals: (s) => calculateUiTypesGrossEarnings(s.uiTypesAll),
})({
  receiveUiTypes: {
    isLoading: booleanAdapter.setFalse,
    uiTypes: uiTypesAdapter.setAll,
  },
  receiveError: {
    isLoading: booleanAdapter.setFalse,
    error: errorAdapter.set,
  },
  addUiType: {
    activeUiTypeId: activeUiTypeIdAdapter.setNull,
    uiTypes: uiTypesAdapter.addOne,
  },
  updateUiType: {
    activeUiTypeId: activeUiTypeIdAdapter.setNull,
    uiTypes: uiTypesAdapter.updateOne,
  },
})();