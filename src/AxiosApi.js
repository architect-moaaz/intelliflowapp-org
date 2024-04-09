import axios from "axios";

const API_URL = process.env.REACT_APP_MODELLER_API_ENDPOINT
const Token = `Bearer ${localStorage.getItem("Token")}`

const Axios = axios.create({
    baseURL: API_URL,
});

export const setAuthHeader = (token) => {
    Axios.defaults.headers.common.Authorization =
        token || Token;
};

Axios.defaults.headers.common.Authorization = Token

//if a 401 happens, the user will be logged out
Axios.interceptors.response.use(
    
    function (response) {
        // console.log("Axios interceptor")
        return response;
    },
    function (error) {
        if (error && error.response && error.response.status === 401) {
            localStorage.removeItem("Token");
        }
        return Promise.reject(error);
    }
);


// Set the initial header from storage or something (should surround with try catch in actual app)
setAuthHeader(Token);


export default Axios;
