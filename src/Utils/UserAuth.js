export const USER_AUTH = {
    set : ({ token, userInfo }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    remove : () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    },
    get : () => ({
        token: localStorage.getItem('token'),
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
    })
};