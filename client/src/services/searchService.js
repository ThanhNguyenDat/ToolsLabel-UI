import * as httpBaseRequest from '~/utils/httpBaseRequest';

export const search = async (q, type = 'less') => {
    try {
        const res = await httpBaseRequest.get('users/search', {
            params: {
                q,
                type,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
