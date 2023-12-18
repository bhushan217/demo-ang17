import { createAdapter } from '@state-adapt/core';

export interface Filters {
  under1: boolean;
  between1and2: boolean;
  between2and3: boolean;
  above3: boolean;
}
export const filterAdapter = createAdapter<Filters>()({
  toggleFilter: (state, key: keyof Filters) => ({
    ...state,
    [key]: !state[key],
  }),
});

export type FilterFunctions = {
  [P in keyof Filters]: (price: number) => boolean;
};

export const filterFunctions: FilterFunctions = {
  under1: price => price <= 1,
  between1and2: price => price >= 1 && price <= 2,
  between2and3: price => price >= 2 && price <= 3,
  above3: price => price >= 3,
};