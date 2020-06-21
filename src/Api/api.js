import Url from "../url";

const caller = require('axios').default;

export function addInterceptor() {
    caller.interceptors.request.use(
        addAuthTokenInHeader,
        (error) =>{
            Promise.reject(error)
        }
    );
    caller.interceptors.response.use(
        function (response) {
            return response.data ? response.data : response;
        },
        function (error) {
            if (error.data && +error.data.status_code === 401) {
                window.logout();
                window.location.href = window.location.host + Url.Login;
            }
        });
}
export async function get(uri){
    return await caller.get(uri);
}

export async function post(uri, data){
    return await caller.post(uri, data);
}

function addAuthTokenInHeader(config) {
    const token = window.getToken();
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
}
