export interface ObjectKey {
  id: number;
  keyName: string;
  uiTypeId: number;
}
export type ObjectKeyRequiredProps = Pick<ObjectKey, 'keyName' | 'uiTypeId'>;
export function isObjectKey(obj: any): obj is ObjectKey {
  return obj && obj.id && obj.keyName;
}
export interface Page<T> {
  content: T[]
}