import axios from 'axios';
import { Host } from '../config';

/**
 * 搜索
 */
export const search = ({ keywords }) => {
	const url = Host + "/search";

	return axios.get(url, {
		params: {
			keywords,
			type: 1018,
		}
	})
}