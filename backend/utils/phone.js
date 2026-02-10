export const normalizePhilippineMobile = (value) => {
  if (value === undefined || value === null) return null;

  let raw = String(value).trim();
  if (!raw) return null;

  raw = raw.replace(/[()\-\s]/g, '');

  if (raw.startsWith('+')) {
    if (!raw.startsWith('+63')) return null;
    raw = `0${raw.slice(3)}`;
  } else if (raw.startsWith('63')) {
    raw = `0${raw.slice(2)}`;
  } else if (raw.startsWith('9')) {
    raw = `0${raw}`;
  }

  if (!/^09\d{9}$/.test(raw)) return null;

  return raw;
};
