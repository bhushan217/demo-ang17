import { Injectable, inject } from '@angular/core';
import { ObjectKeysPageActions } from './object-key-page.actions';
import { ObjectKey } from './object-key.model';
import { ObjectKeysService } from './object-key.service';
import { adapt } from '@state-adapt/angular';
import { getAction } from '@state-adapt/core';
import { createEntityState } from '@state-adapt/core/adapters';
import { Source, getRequestSources, splitSources, toSource } from '@state-adapt/rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { State, adapter } from './object-key.adapter';

export const initialState: State = {
  activeObjectKeyId: null,
  // search: [],
  isLoading: true,
  error: null,
  objectKeys: createEntityState(),
};
export const featureKey = 'objectKeys';

@Injectable({ providedIn: 'root' })
export class ObjectKeyStateService {
  store = adapt(initialState, {
    adapter,
    sources: () => {
      const service = inject(ObjectKeysService);
      // const { success$, error$ } = getRequestSources(featureKey+'Page', service.fetchAll([],[]) );
      // const {} = splitSources(objectKeysRequestPageSources, {})

      // https://state-adapt.github.io/docs/rxjs#getrequestsources
      const objectKeysRequestSources = getRequestSources(featureKey, service.fetchAll([],[]) );

      const objectKeyCreated$ = ObjectKeysPageActions.saveObjectKey$.pipe(
        filter(({ payload }) => (  (<ObjectKey>payload).id < 1)),
        concatMap(({ payload }) => service.create(payload)),
        // https://state-adapt.github.io/docs/rxjs#tosource
        toSource('objectKeyCreated$')
      );

      const objectKeyUpdated$ = ObjectKeysPageActions.saveObjectKey$.pipe(
        filter(ObjectKeysPageActions.isObjectKeyAction),
        filter(({ payload }) => (  (<ObjectKey>payload).id > 0)) ,
        concatMap(
          ({ payload }) =>
            service
              .update(payload.id, payload)
              .pipe(map((objectKey) => getAction('objectKeyUpdated$', [objectKey.id, objectKey]))) // https://state-adapt.github.io/docs/core#getaction
        )
      );

      const objectKeyDeleted$ = ObjectKeysPageActions.deleteObjectKey$.pipe(
        concatMap(({ payload }) =>
          service
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
    path: featureKey,
  });
}