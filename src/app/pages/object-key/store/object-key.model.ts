export interface ObjectKey {
  id: number;
  keyName: string | null;
  label: string | null;
  description: string | null;
  uiTypeId: number | null;
  uiTypeName?: string
}
export type ObjectKeyRequiredProps = Pick<ObjectKey, 'keyName' | 'label' | 'description' | 'uiTypeId'>;
export function isObjectKey(obj: any): obj is ObjectKey {
  return obj && obj.id && obj.keyName;
}
export interface Page<T> {
  content: T[]
}