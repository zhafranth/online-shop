export interface SizeRow {
  size: string;
  dada: string;
  pinggang: string;
  panggul: string;
  tinggi: string;
  order: number;
}

export const SIZE_GUIDE_COLUMNS: {
  key: Exclude<keyof SizeRow, "order" | "size">;
  label: string;
}[] = [
  { key: "dada", label: "Dada" },
  { key: "pinggang", label: "Pinggang" },
  { key: "panggul", label: "Panggul" },
  { key: "tinggi", label: "Tinggi" },
];
