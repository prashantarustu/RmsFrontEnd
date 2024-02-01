import axios from "axios";
import { DecryptedList, Decrypt_Id_Name, EncryptedList } from "../Common/Utility";

// ------get API Request
export const fetchData = async (url) => {
    try {
        const res = await axios.get(url);
        const decr = DecryptedList(res.data.data)
        const TextData = JSON.parse(decr)
        return TextData.Table
    } catch (err) {
        console.log(err);
    }
};

// -------get DATA API With Post Request
export const fetchPostData = async (url, postData) => {
    const values = EncryptedList(JSON.stringify(postData));
    const data = {
        "Data": values
    }
    try {
        const res = await axios.post(url, data);

        const decr = DecryptedList(res.data.data)
        const TextData = JSON.parse(decr)
        return TextData.Table
    } catch (error) {
        return []
    }
};

export const fetch_Post_Data = async (url, postData) => {
    var Data
    var Permision
    const values = EncryptedList(JSON.stringify(postData));
    const data = {
        "Data": values
    }
    try {
        const res = await axios.post(url, data);
        const decr = DecryptedList(res.data.data)
        const TextData = JSON.parse(decr)
        Permision = TextData.Table1
        Data = TextData.Table
        return { Data, Permision }

    } catch (error) {
        console.log(error);
    }
};

// --------ADD Update Delete Data  With API Post Request
export const AddDeleteUpadate = async (url, postData) => {
    const values = EncryptedList(JSON.stringify(postData));
    const data = {
        "Data": values
    }
    const res = await axios.post(url, data);
    if (res.code === 'ERR_BAD_REQUEST') {
        return res
    } else {
        return res.data;
    }
}

// ---------->ADD Update Delete Doc Data With API Post Request<--------------

export const AddDeleteUpadate_FormData = async (url, postData) => {
    const res = await axios.post(url, postData);
    if (res.code === 'ERR_BAD_REQUEST') {
        return res
    } else {
        return res.data;
    }
}

// Agency Permision
export const ScreenPermision = async (code, agencyId, PinID) => {
    const val = {
        PINID: PinID,
        ApplicationID: '1',
        code: code,
        AgencyID: agencyId
    }
    const values = EncryptedList(JSON.stringify(val));
    const data = {
        "Data": values
    }
    const res = await axios.post("EffectivePermission/GetData_EffectiveScreenPermission", data);
    const decr = DecryptedList(res.data.data)
    const TextData = JSON.parse(decr)
    return TextData.Table
}

// Utility Personnel Screen Permision
export const UtilityPersonnelScreenPermision = async (code, tableId) => {
    const val = {
        AgencyId: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
        PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        TableCode: code,
        TableId: tableId
    }
    const values = EncryptedList(JSON.stringify(val));
    const data = {
        "Data": values
    }
    const res = await axios.post("TablePermission/GetData_SingleGroupTablePermission", data);
    const decr = DecryptedList(res?.data?.data)
    const TextData = JSON.parse(decr)
    return TextData.Table
}

export const fieldPermision = async (AgencyID, ScreenCode, pinId) => {
    const val = {
        AgencyID: AgencyID,
        ScreenCode: ScreenCode,
        PINID: pinId,
    }
    const values = EncryptedList(JSON.stringify(val));
    const data = {
        "Data": values
    }
    const res = await axios.post("EffectivePermission/GetData_EffectiveFieldPermission_Validate", data);
    const decr = DecryptedList(res.data.data)
    const TextData = JSON.parse(decr)
    return TextData.Table
}

export const fetchProgresData = async (url, postData) => {
    const values = EncryptedList(JSON.stringify(postData));
    const data = {
        "Data": values
    }
    try {
        const res = await axios.post(url, data);
        const decr = DecryptedList(res.data.data)
        return res.data

    } catch (error) {
        console.log(error);
    }
};

export const getPromisLoginAccessOrRefreshToken = async () => {
    const param = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ refresh_token: "", access_token: "", }),
    }
    const values = EncryptedList(JSON.stringify(param));
    const data = {
        "Data": values
    }
    try {
        const res = await axios.post('LocalStorage/GetData_MultipleKeyLocalStorage', data);
        const decr = DecryptedList(res.data.data)
        const TextData = JSON.parse(decr)
        return TextData.Table[0]

    } catch (error) {
        return []
        console.log(error);
    }
};

export const fetchDataAccess = async () => {
    try {
        const result = await getPromisLoginAccessOrRefreshToken();
        console.log(result);
        return result
    } catch (error) {
        console.error(error);
    }
};



