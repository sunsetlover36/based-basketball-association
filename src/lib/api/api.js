import ky from 'ky';

export const api = ky.extend({
  prefixUrl: `${import.meta.env.VITE_API_URL}/v1`,
  timeout: 120000,
  credentials: 'include',
});