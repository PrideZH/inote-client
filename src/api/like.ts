import axios from 'axios';

export interface LikeData {
  targetId: number;
  type: number;
}


const likeApi = {
  like (likeData: LikeData) {
    return axios.post('/api/like', likeData);
  },
};

export default likeApi;
