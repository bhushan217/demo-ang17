import { Injectable, inject } from '@angular/core';
import { adapt } from '@state-adapt/angular';
import { getAction } from '@state-adapt/core';
import { createEntityState } from '@state-adapt/core/adapters';
import { Source, getRequestSources, toSource } from '@state-adapt/rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { UiType } from './ui-type.model';
import { State, adapter } from './ui-type.adapter';
import { UiTypesPageActions } from './ui-type-page.actions';
import { UiTypesService } from './ui-type.service';

export const initialState: State = {
  activeUiTypeId: null,
  isLoading: true,
  error: null,
  uiTypes: createEntityState(),
};

@Injectable({ providedIn: 'root' })
export class UiTypeStateService {
  store = adapt(initialState, {
    adapter,
    sources: () => {
      const uiTypesService = inject(UiTypesService);

      // https://state-adapt.github.io/docs/rxjs#getrequestsources
      const uiTypesRequestSources = getRequestSources(
        'uiTypes',
        uiTypesService.fetchAll()
      );

      const uiTypeCreated$ = UiTypesPageActions.saveUiType$.pipe(
        filter(({ payload }) => !('id' in payload)),
        concatMap(({ payload }) => uiTypesService.create(payload)),
        // https://state-adapt.github.io/docs/rxjs#tosource
        toSource('uiTypeCreated$')
      );

      const uiTypeUpdated$ = UiTypesPageActions.saveUiType$.pipe(
        filter(UiTypesPageActions.isUiTypeAction),
        concatMap(
          ({ payload }) =>
            uiTypesService
              .update(payload.id, payload)
              .pipe(map((uiType) => getAction('uiTypeUpdated$', [uiType.id, uiType]))) // https://state-adapt.github.io/docs/core#getaction
        )
      );

      const uiTypeDeleted$ = UiTypesPageActions.deleteUiType$.pipe(
        concatMap(({ payload }) =>
          uiTypesService
            .delete(payload)
            // https://state-adapt.github.io/docs/core#getaction
            .pipe(map(() => getAction('uiTypeDeleted$', payload)))
        )
      );

      return {
        receiveUiTypes: uiTypesRequestSources.success$,
        receiveError: uiTypesRequestSources.error$,
        addUiType: uiTypeCreated$,
        updateUiType: uiTypeUpdated$ as Source<[number, UiType]>, // https://state-adapt.github.io/docs/rxjs#source
        removeUiTypesOne: uiTypeDeleted$,
      };
    },
    path: 'uiTypes',
  });
}