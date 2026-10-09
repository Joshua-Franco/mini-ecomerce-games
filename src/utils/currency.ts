// Formatea importes en soles peruanos con dos decimales.
export function formatSoles(value: number) {
  return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
