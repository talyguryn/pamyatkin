export function getPrice(withCurrencySymbol = false): string {
  const price = process.env.NEXT_PUBLIC_PRICE
    ? parseFloat(process.env.NEXT_PUBLIC_PRICE)
    : 99;

  return withCurrencySymbol ? `${price} ₽` : `${price}`;
}
