// An option group on a menu item, such as "Portion", and its choices (modules/menu-catalogue).

/** One choice, such as "1 kg" (+ price in whole shillings). */
export interface OptionChoice {
  key: string;
  name: string;
  priceDelta: number;
}

/** A group of choices; required ones must be picked, several ones allow more than one. */
export interface OptionGroup {
  key: string;
  name: string;
  required: boolean;
  multiple: boolean;
  choices: OptionChoice[];
}
