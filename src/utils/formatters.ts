/**
 * Ofusca un número de cuenta dejando visibles solo los primeros 4 y los últimos 4 dígitos.
 * @param account Número de cuenta a ofuscar
 * @returns Número de cuenta ofuscado (ej: "0114*****************8219")
 */
export const maskAccountNumber = (account?: string | null): string => {
  if (!account) return '';
  const str = String(account).trim();
  if (str.length <= 8) return str;

  const first4 = str.slice(0, 4);
  const last4 = str.slice(-4);
  const middleMask = '*'.repeat(str.length - 8);

  return `${first4}${middleMask}${last4}`;
};
