export const slowMs = 500;
export const fastMs = 75;
export const defaultMs = process.env.CI ? slowMs : fastMs;