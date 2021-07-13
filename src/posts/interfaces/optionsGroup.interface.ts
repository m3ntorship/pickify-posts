export interface Option {
  id: string;
}

export interface OptionsGroup {
  id: string;
  options: Option[];
}

export interface OptionsGroups {
  groups: OptionsGroup[];
}
