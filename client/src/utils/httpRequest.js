import axios from 'axios';

// const httpBaseRequest = axios.create({
//     baseURL: process.env.REACT_APP_BASE_URL,
// });

export const get = async (path, options = {}) => {
    const response = await axios.get(path, options);
    return response.data;
};

export const post = async (path, options = {}) => {
    const response = await axios.post(path, options);
    return response.data;
};
