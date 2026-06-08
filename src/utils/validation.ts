export function isValidCargoCode(code: string) {
  if (!code) return false;
  return /^[A-Z0-9-]{5,}$/.test(code.trim().toUpperCase());
}

export default isValidCargoCode;
