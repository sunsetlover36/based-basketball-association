import { api } from '../api';
import { userUrls } from './urls';

export const getUser = async () => {
  const data = await api.get(userUrls.USER).json();
  return data;
};
