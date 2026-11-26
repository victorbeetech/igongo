// Money as people read it in Uganda: whole shillings with thousands
// separators, such as "UGX 38,000". Every page shows money through this.

/** [amount] whole shillings as text. */
export const ugx = (amount: number) => `UGX ${Math.round(amount).toLocaleString("en-UG")}`;
