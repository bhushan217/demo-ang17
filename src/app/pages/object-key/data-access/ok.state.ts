export interface UserState {
  loading: boolean;
  users: User[];
}
export interface User {
  userId: string;
  firstname: string;
  lastname: string;
  friends: Friend[];
}

export interface Friend {
  id: string;
}
export interface UserRequest {
  users: User[];
  total: string;
}

export const defaultUserState: UserState = { loading: true, users: [] };