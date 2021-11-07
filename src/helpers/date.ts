export function format(date: string): string {
  const hr = new Date(date).toUTCString().split(' ');
  return hr[1] + ' ' + hr[2] + ' ' + hr[3];
}
