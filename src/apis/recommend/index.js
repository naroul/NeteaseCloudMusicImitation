import axios from 'axios';
import { Host, Types } from '../config.js';

export const getBanners = () => {
  const url = Host + '/banner';
  return axios.get(url, {
    params: {
      type: Types.pc,
    },
  });
};
