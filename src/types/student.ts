export type Group = "science" | "commerce" | "arts";

export interface Student {
  name: string;
  email: string;
  guradianName: string;
  phone: string;
  className: string;
  admissionDate: Date;
  institution: string;
  batch?: string;
  group?: Group;
  photo: string;
  monthlyFee?: number;
}
