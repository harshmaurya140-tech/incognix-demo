export function isIP(input) {
  if (typeof input !== "string") return 0;
  // IPv4 check
  const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (ipv4.test(input)) return 4;
  // IPv6 check
  if (input.includes(":")) {
    try {
      new URL(`http://[${input}]`);
      return 6;
    } catch {
      return 0;
    }
  }
  return 0;
}
export default { isIP };
