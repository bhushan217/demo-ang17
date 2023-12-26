import { Injectable } from '@angular/core';
import { defaultUserState, User } from './ok.state';
import { UsersService } from './ok.service';
import { adapt } from '@state-adapt/angular';
import { Source, toSource } from '@state-adapt/rxjs';
import { map, Subject } from 'rxjs';
import { userAdpater } from './ok.adapter';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  usersReceived$ = this.users.get().pipe(
    map((res) => res.users),
    toSource('[User] usersReceived$')
  );
  userAdded$ = new Source<User>('[User] userAdded$');
  userUpdate$ = new Source<User>('[User] userUpdate$');
  friendAdded$ = new Subject<User>();
  friendAddedSource$ = this.friendAdded$.pipe(
    map((user) => ({ user, friend: { id: `random-friend-${Math.random()}` } })),
    toSource('[User] friendAdded$')
  );
  friendRemoved$ = new Source<User>('[User] friendRemoved$');
  userRemoved$ = new Source<User>('[User] userRemoved$');
  featureKey = 'users';
  store = adapt(defaultUserState, {
    adapter: userAdpater,
    sources: () => ({
      loadUsers: this.usersReceived$,
      addUser: this.userAdded$,
      updateUser: this.userUpdate$,
      addFriend: this.friendAddedSource$,
      removeFriend: this.friendRemoved$,
      removeUser: this.userRemoved$,
    }),
    path: this.featureKey,
  });

  users$ = this.store.users$;
  loading$ = this.store.loading$;

  constructor(private users: UsersService) {}
}
