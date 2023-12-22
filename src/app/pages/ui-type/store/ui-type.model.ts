export interface UiType {
  id: number;
  name?: string;
  description?: string;
  pattern?: string;
}
export type UiTypeRequiredProps = Pick<UiType, 'name' | 'description' | 'pattern'>;
export function isUiType(obj: any): obj is UiType {
  return obj && obj.id && obj.name;
}
