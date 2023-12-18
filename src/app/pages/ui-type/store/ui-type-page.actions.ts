import {
    UiType,
    UiTypeRequiredProps,
    isUiType,
  } from './ui-type.model';
  import { Action } from '@state-adapt/core';
  import { Source } from '@state-adapt/rxjs';
  
  // https://state-adapt.github.io/docs/rxjs#source
  const saveUiType$ = new Source<UiTypeRequiredProps | UiType>('saveUiType$');
  const deleteUiType$ = new Source<number>('deleteUiType$');
  
  // https://state-adapt.github.io/docs/core#action
  function isUiTypeAction(action: any): action is Action<UiType> {
    return isUiType(action.payload);
  }
 const UiTypesPageActions = {saveUiType$, deleteUiType$, isUiTypeAction }
  export { UiTypesPageActions } 