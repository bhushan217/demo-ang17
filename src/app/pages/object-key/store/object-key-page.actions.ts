import {
    ObjectKey,
    ObjectKeyRequiredProps,
    isObjectKey,
  } from './object-key.model';
  import { Action } from '@state-adapt/core';
  import { Source } from '@state-adapt/rxjs';
  
  // https://state-adapt.github.io/docs/rxjs#source
  const saveObjectKey$ = new Source<ObjectKeyRequiredProps | ObjectKey>('saveObjectKey$');
  const deleteObjectKey$ = new Source<number>('deleteObjectKey$');
  
  // https://state-adapt.github.io/docs/core#action
  function isObjectKeyAction(action: any): action is Action<ObjectKey> {
    return isObjectKey(action.payload);
  }
 const ObjectKeysPageActions = {saveObjectKey$, deleteObjectKey$, isObjectKeyAction }
  export { ObjectKeysPageActions } 