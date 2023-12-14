import { Injectable, inject } from '@angular/core';
import { ObjectKeysPageActions } from './object-key-page.actions';
import { ObjectKey } from './object-key.model';
import { ObjectKeysService } from './object-key.service';
import { adapt } from '@state-adapt/angular';
import { getAction } from '@state-adapt/core';
import { createEntityState } from '@state-adapt/core/adapters';
import { Source, getRequestSources, toSource } from '@state-adapt/rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { State, adapter } from './object-key.adapter';

export const initialState: State = {
  activeObjectKeyId: null,
  isLoading: true,
  error: null,
  objectKeys: createEntityState(),
};

@Injectable({ providedIn: 'root' })
export class ObjectKeyStateService {
  store = adapt(initialState, {
    adapter,
    sources: () => {
      const objectKeysService = inject(ObjectKeysService);

      // https://state-adapt.github.io/docs/rxjs#getrequestsources
      const objectKeysRequestSources = getRequestSources(
        'objectKeys',
        objectKeysService.fetchAll()
      );

      const objectKeyCreated$ = ObjectKeysPageActions.saveObjectKey$.pipe(
        filter(({ payload }) => !('id' in payload)),
        concatMap(({ payload }) => objectKeysService.create(payload)),
        // https://state-adapt.github.io/docs/rxjs#tosource
        toSource('objectKeyCreated$')
      );

      const objectKeyUpdated$ = ObjectKeysPageActions.saveObjectKey$.pipe(
        filter(ObjectKeysPageActions.isObjectKeyAction),
        concatMap(
          ({ payload }) =>
            objectKeysService
              .update(payload.id, payload)
              .pipe(map((objectKey) => getAction('objectKeyUpdated$', [objectKey.id, objectKey]))) // https://state-adapt.github.io/docs/core#getaction
        )
      );

      const objectKeyDeleted$ = ObjectKeysPageActions.deleteObjectKey$.pipe(
        concatMap(({ payload }) =>
          objectKeysService
            .delete(payload)
            // https://state-adapt.github.io/docs/core#getaction
            .pipe(map(() => getAction('objectKeyDeleted$', payload)))
        )
      );

      return {
        receiveObjectKeys: objectKeysRequestSources.success$,
        receiveError: objectKeysRequestSources.error$,
        addObjectKey: objectKeyCreated$,
        updateObjectKey: objectKeyUpdated$ as Source<[number, ObjectKey]>, // https://state-adapt.github.io/docs/rxjs#source
        removeObjectKeysOne: objectKeyDeleted$,
      };
    },
    path: 'objectKeys',
  });
}