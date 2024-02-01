// Axios Interceptop -> Send access_token all component

import axios from "axios";
import { Decrypt_Id_Name, DecryptedList, EncryptedList } from "../Components/Common/Utility";
import { useContext, useEffect } from "react";
import { AgencyContext } from "../Context/Agency/Index";

var url = window.location.origin;

if (url === 'https://rms1.arustu.com') {
    axios.defaults.baseURL = 'https://rmsapi1.arustu.com/api/';
} else if (url === 'https://rms2.arustu.com') {
    axios.defaults.baseURL = 'https://rmsapi2.arustu.com/api/';
} else if (url === 'https://rmsgoldline.com') {
    axios.defaults.baseURL = 'https://apigoldline.com:5002/api/';
} else if (url === 'http://localhost:3000') {
    axios.defaults.baseURL = 'https://rmsapi2.arustu.com/api/';
} else if (url === 'https://nibrs.arustu.com') {
    axios.defaults.baseURL = 'https://nibrsapi.arustu.com/api/';
} else { axios.defaults.baseURL = 'https://rmsapidev.newinblue.com/api/'; }

// NIBRSAPI.arustu.com
// NIBRS.arustu.com

// axios.defaults.baseURL = 'https://rmsapidev.newinblue.com/api/';

let refresh = false;

const AxiosCom = () => {

    const { tokenArray, setTokenArray, get_LocalStorageToken, localStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const param = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ refresh_token: "", access_token: "" }),
    };

    useEffect(() => {
        if (!tokenArray.refresh_token || !tokenArray.access_token) {
            get_LocalStorageToken(param);
        }
    }, [])

    axios.interceptors.request.use(async (request) => {
        // const access_token = sessionStorage.getItem('access_token');
        // console.log(tokenArray?.access_token)
        const access_token = tokenArray?.access_token;
        request.headers.Authorization = `Bearer ${access_token}`
        return request;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    axios.interceptors.response.use(resp => { return resp }, async error => {
        // if (error.response.status === 401 && !refresh) {
        //     refresh = true;
        //     const response = await axios.post('Account/GetToken', { refresh_token: localStorage.getItem('refresh_token'), grant_type: 'refresh_token' });
        //     if (response.status === 200) {
        //         // sessionStorage.setItem('access_token', response.data['access_token'])
        //         // localStorage.setItem('refresh_token', response.data['refresh_token'])
        //         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access_token']}`
        //         return axios(error.config);
        //     }
        // }
        // refresh = false;
        // return error;
        if (error.response.status === 401 && !refresh) {
            refresh = true;
            try {
                // const refresh_token = localStorage.getItem('refresh_token');
                // console.log(tokenArray?.refresh_token)
                const refresh_token = tokenArray?.refresh_token;
                const response = await axios.post('Account/GetToken', { refresh_token: refresh_token, grant_type: 'refresh_token' });
                console.log(response)
                if (response.status === 200) {
                    // Update the token in localStorage with the new token from the response
                    localStorage.setItem('api_response_token', response.data['access_token']);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access_token']}`;
                    // Retry the original request with the updated token
                    return axios(error.config);
                }
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
            } finally {
                refresh = false;
            }
        }
        return Promise.reject(error);
    });
    return <div></div>;
};

export default AxiosCom;

const getApiResponseToken = async () => {
    try {
        const param = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify({ refresh_token: "", access_token: "" }),
        };
        const values = EncryptedList(JSON.stringify(param));
        const data = {
            "Data": values
        };
        const res = await axios.post('LocalStorage/GetData_MultipleKeyLocalStorage', data);
        const decr = DecryptedList(res.data.data);
        const TextData = JSON.parse(decr);
        return TextData.Table[0]?.access_token;
    } catch (error) {
        console.error('Error getting API response token:', error);
        throw error;
    }
};


