export function format(date: string): string {
  const hr = new Date(date).toISOString().split("T");
  return hr[0];
}
