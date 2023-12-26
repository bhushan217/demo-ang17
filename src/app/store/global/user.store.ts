import { adapt } from '@state-adapt/angular';
import { Source } from '@state-adapt/rxjs';
import { tap } from 'rxjs';

import {UserService, SignInReq, SignInRes } from 'app/services/global/user.service';
import { getItem, removeItem, setItem } from 'app/store/utils/storage';

import { UserInfo, UserToken } from 'app/store/types/entity';
import { StorageEnum } from 'app/store/types/enum';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

type State = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
};
const initialState: State = {
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
};

export const userSuccess$ = new Source<State>('userSuccess$');
export const userReset$ = new Source<void>('userReset$');
const signin$ = new Source<SignInReq>('signin$');

export const userStore = adapt(initialState, {
  sources: {
    set: userSuccess$.pipe(
      tap(({ payload }) => {
        setItem(StorageEnum.User, payload.userInfo);
        setItem(StorageEnum.Token, payload.userToken);
      }),
    ),
    reset: userReset$.pipe(
      tap(() => {
        removeItem(StorageEnum.User);
        removeItem(StorageEnum.Token);
      }),
    ),
  },
});
const userStoreState$ = userStore.state$

export class UserStore {
  userService = inject( UserService);
  notification = inject( NzMessageService);
  // const { notification, message } = App.useApp();

  // const signInMutation = signin$.next(this.userService.signin);
  singIn(data: SignInReq){
    signin$.next(data);
  }
  signSuccess = (data: SignInRes) => {
    try {
      //  userSuccess$.next
      const { user, accessToken, refreshToken } = data;
      userSuccess$.next({ userInfo: user, userToken: { accessToken, refreshToken } });
      // navigatge('/dashboard', { replace: true });

      this.notification.success(('sys.login.loginSuccessTitle'), {
        
        // content: ('sys.login.loginSuccessTitle'),
        // description: `${('sys.login.loginSuccessDesc')}: ${data.username}`,
        nzDuration: 3,
      });
    } catch (err:any) {
      this.notification.warning(err.message,{
        // content: err.message,
        nzDuration: 3,
      });
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // return useCallback(signIn, []);
}