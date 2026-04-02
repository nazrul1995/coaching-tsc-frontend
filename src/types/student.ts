export type Group = "science" | "commerce" | "arts";
export interface Student {
  name: string;
  email: string;
  phone: string;
  className: string;
  batch?: string;
  group?: Group | "";
  photo?: File | null;
}