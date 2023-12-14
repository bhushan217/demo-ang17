export interface UiType {
  id: number;
  name: string;
  pattern?: string;
}
export type UiTypeRequiredProps = Pick<UiType, 'name' | 'pattern'>;
export function isUiType(obj: any): obj is UiType {
  return obj && obj.id && obj.keyName;
}
