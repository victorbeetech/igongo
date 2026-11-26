// Quantities in words, such as "12.5 kg".

export const qtyText = (qty: number, unit: string) => `${Math.round(qty * 1000) / 1000} ${unit}`;
