export function formatPrice(cents) {
  return (cents / 100).toLocaleString('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  })
}
