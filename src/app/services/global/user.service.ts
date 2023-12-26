import { HttpClient } from '@angular/common/http';

import { UserInfo, UserToken } from 'app/store/types/entity';

export interface SignInReq {
  username: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}


export class UserService { 
  constructor(private http: HttpClient) {}
 signin = (data: SignInReq) => this.http.post<SignInRes>( UserApi.SignIn, data );
 signup = (data: SignUpReq) => this.http.post<SignInRes>( UserApi.SignUp, data );
 logout = () => this.http.get( UserApi.Logout );
 findById = (id: string) => this.http.get<UserInfo[]>( `${UserApi.User}/${id}` );
};