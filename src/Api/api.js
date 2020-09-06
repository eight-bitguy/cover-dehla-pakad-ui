import Url from "../JS/url";

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
            if (!error || !error.response || error.response.status === 401) {
                window.logout();
            }
            return error.data ? error.data : error;
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
