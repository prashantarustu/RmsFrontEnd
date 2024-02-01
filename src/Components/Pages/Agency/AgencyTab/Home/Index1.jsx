import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor'
import Select from 'react-select';
import { DecryptedID, Decrypt_Id_Name, EncryptedList } from '../../../../Common/Utility';
import { FaxField, MunicipalityCodeValidator, ORIValidator, PhoneField, RequiredField, RequiredFieldWithoutTrim } from '../../AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import uploadImage from '../../../../../img/uploadImage.png'

const Home = (props) => {

    // Hooks Initialization
    const { agencyData, getAgency, get_CountList, setStatus, status } = useContext(AgencyContext)
    const { setModalOpen, setShowCount, setAgencyId } = props

    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,)

    const navigate = useNavigate()
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [zipList, setZipList] = useState([])
    const [agencyEditVal, setAgencyEditVal] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [image, setImage] = useState('')

    const [errors, setErrors] = useState({
        'ORI': '',
        'MunicipalityCode': '',
        'Agency_Name': '',
        'ShortName': '',
        'Agency_Address1': '',
        'Agency_StateId': '',
        'Agency_CityId': '',
        'Agency_ZipId': '',
        'Agency_Phone': '',
        'Agency_Fax': '',
    })

    const [value, setValue] = useState({
        'ORI': '',
        'MunicipalityCode': '',
        'Agency_Name': '',
        'ShortName': '',
        'Agency_Address1': '',
        'Agency_StateId': '',
        'Agency_CityId': '',
        'Agency_ZipId': '',
        'Agency_Phone': '',
        'Agency_Fax': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'AgencyID': aId,
        'ZipName': '', 'StateName': '', 'CityName': ''
    })

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Agency form
        'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '',
    })
    // Onload Function
    useEffect(() => {
        getStateList();
    }, [])

    useEffect(() => {
        if (aId) {
            if (status) {
                get_Edit_Agency_Data(aId);
                setValue({ ...value, ['ZipName']: '', ['StateName']: '', ['CityName']: '' }); setErrors({
                    'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '',
                })
            }
        }
        if (!status) rest_Value()
    }, [aId, status])

    useEffect(() => {
        if (agencyEditVal[0]?.AgencyID) {
            getScreenPermision(agencyEditVal[0]?.AgencyID)
            get_Field_Permision_Agency(agencyEditVal[0]?.AgencyID)
            // setAgencyName(agencyEditVal[0]?.Agency_Name)
            setValue({
                ...value,
                'ORI': agencyEditVal[0]?.ORI,
                'MunicipalityCode': agencyEditVal[0]?.MunicipalityCode,
                'Agency_Name': agencyEditVal[0]?.Agency_Name,
                'ShortName': agencyEditVal[0]?.ShortName,
                'Agency_Address1': agencyEditVal[0]?.Agency_Address1,
                'Agency_StateId': agencyEditVal[0]?.Agency_StateId,
                'Agency_CityId': agencyEditVal[0]?.Agency_CityId,
                'Agency_ZipId': agencyEditVal[0]?.Agency_ZipId,
                'Agency_Phone': agencyEditVal[0]?.Agency_Phone,
                'Agency_Fax': agencyEditVal[0]?.Agency_Fax,
                'AgencyID': agencyEditVal[0]?.AgencyID,
                'ZipName': changeArrayFormat_WithFilter(agencyEditVal, 'zip'), 'StateName': changeArrayFormat_WithFilter(agencyEditVal, 'state'), 'CityName': changeArrayFormat_WithFilter(agencyEditVal, 'city'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
            setStatus(true)
            getCity(agencyEditVal[0]?.Agency_StateId)
            getZipCode(agencyEditVal[0]?.Agency_CityId)
        } else {
            setValue({
                ...value,
                'ORI': '',
                'MunicipalityCode': '',
                'Agency_Name': '',
                'ShortName': '',
                'Agency_Address1': '',
                'Agency_StateId': '',
                'Agency_CityId': '',
                'Agency_ZipId': '',
                'Agency_Phone': '',
                'Agency_Fax': '',
                'AgencyID': ''
            })
            setStatus(false)
        }
    }, [agencyEditVal])

    // Get Effective Field Permission
    const get_Field_Permision_Agency = (AgencyID) => {
        fieldPermision(AgencyID, 'A001').then(res => {
            if (res) {
                // Agency Field
                if (Agency_Field_Permistion_Filter(res, "Agency-ORI")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ORI']: Agency_Field_Permistion_Filter(res, "Agency-ORI") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-ShortName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ShortName']: Agency_Field_Permistion_Filter(res, "Agency-ShortName") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-AgencyName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_Name']: Agency_Field_Permistion_Filter(res, "Agency-AgencyName") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-Address")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_Address1']: Agency_Field_Permistion_Filter(res, "Agency-Address") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-State")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_StateId']: Agency_Field_Permistion_Filter(res, "Agency-State") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-City")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_CityId']: Agency_Field_Permistion_Filter(res, "Agency-City") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-Phone")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_Phone']: Agency_Field_Permistion_Filter(res, "Agency-Phone") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-Fax")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_Fax']: Agency_Field_Permistion_Filter(res, "Agency-Fax") } })
                }
                 if (Agency_Field_Permistion_Filter(res, "Agency-MunicipalityCode")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MunicipalityCode']: Agency_Field_Permistion_Filter(res, "Agency-MunicipalityCode") } })
                }
                 if (Agency_Field_Permistion_Filter(res, "Agency-Zip")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Agency_ZipId']: Agency_Field_Permistion_Filter(res, "Agency-Zip") } })
                }
            }

        });
    }

    // onChange Hooks Function
    function stateChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['Agency_StateId']: e.value
            })
            getCity(e.value)
        } else {
            setValue({
                ...value,
                ['Agency_StateId']: null, ['ZipName']: '',
            })
            setCityList()
            setZipList()
        }
    }

    function cityChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['Agency_CityId']: e.value
            })
            getZipCode(e.value)
        } else {
            setValue({
                ...value,
                ['Agency_CityId']: null, ['ZipName']: '',
            })
            setCityList()
            setZipList()
        }
    }

    function zipChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['Agency_ZipId']: e.value
            })
        } else {
            setValue({
                ...value,
                ['Agency_ZipId']: null
            })
        }

    }

    // Get Effective Screeen Permission
    const getScreenPermision = (agencyId) => {
        ScreenPermision("A001", agencyId).then(res => {
            if (res) { setEffectiveScreenPermission(res) }
            else setEffectiveScreenPermission()
        });
    }

    const handleChange = (e) => {
        if (e.target.name === 'Agency_Phone' || e.target.name === 'Agency_Fax') {
            var ele = e.target.value;
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'MunicipalityCode') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            // /[^a-zA-Z\s]/g
            setValue({
                ...value,
                [e.target.name]: checkNumber
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }

    }

    // Get List state, city and zip code 
    const get_Edit_Agency_Data = async (aId) => {
        const value = {
            AgencyID: aId
        }
        fetchPostData("Agency/GetData_SingleData", value).then((res) => {
            if (res) {
                setAgencyEditVal(res);
            } else setAgencyEditVal()
        })
    }

    const getStateList = async () => {
        await axios.get("State_City_ZipCode/GetData_State")
            .then(response => {
                const data = DecryptedID(response.data.data)
                const newState = JSON.parse(data)
                setStateList(changeArrayFormat(newState.Table, 'state'))
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getCity = async (stateID) => {
        const value = {
            StateID: stateID
        }
        const values = EncryptedList(JSON.stringify(value));
        const data = {
            "Data": values
        }
        const res = await axios.post('State_City_ZipCode/GetData_City', data)
        const city = DecryptedID(res.data.data)
        const newState = JSON.parse(city)
        setCityList(changeArrayFormat(newState.Table, 'city'))
    }

    const getZipCode = async (cityID) => {
        const value = {
            CityId: cityID
        }
        const values = EncryptedList(JSON.stringify(value));
        const data = {
            "Data": values
        }
        const res = await axios.post('State_City_ZipCode/GetData_ZipCode', data)
        const zipCode = DecryptedID(res.data.data)
        const newZip = JSON.parse(zipCode)
        setZipList(changeArrayFormat(newZip.Table, 'zip'))
    }

    // Check Validation
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (ORIValidator(value.ORI)) {
            setErrors(prevValues => { return { ...prevValues, ['ORI']: ORIValidator(value.ORI) } })
        }
        if (MunicipalityCodeValidator(value.MunicipalityCode)) {
            setErrors(prevValues => { return { ...prevValues, ['MunicipalityCode']: MunicipalityCodeValidator(value.MunicipalityCode) } })
        }
        if (RequiredField(value.Agency_Name)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_Name']: RequiredField(value.Agency_Name) } })
        }
        if (RequiredField(value.ShortName)) {
            setErrors(prevValues => { return { ...prevValues, ['ShortName']: RequiredField(value.ShortName) } })
        }
        if (RequiredField(value.Agency_Address1)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_Address1']: RequiredField(value.Agency_Address1) } })
        }
        if (RequiredFieldWithoutTrim(value.Agency_StateId)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_StateId']: RequiredFieldWithoutTrim(value.Agency_StateId) } })
        }
        if (RequiredFieldWithoutTrim(value.Agency_CityId)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_CityId']: RequiredFieldWithoutTrim(value.Agency_CityId) } })
        }
        if (PhoneField(value.Agency_Phone)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_Phone']: PhoneField(value.Agency_Phone) } })
        }
        if (FaxField(value.Agency_Fax)) {
            setErrors(prevValues => { return { ...prevValues, ['Agency_Fax']: FaxField(value.Agency_Fax) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ORI, MunicipalityCode, Agency_Name, ShortName, Agency_Address1, Agency_StateId, Agency_CityId, Agency_Phone, Agency_Fax } = errors

    useEffect(() => {
        if (ORI === 'true' && MunicipalityCode === 'true' && Agency_Name === 'true' && ShortName === 'true' && Agency_Address1 === 'true' && Agency_StateId === 'true' && Agency_CityId === 'true' && Agency_Phone === 'true' && Agency_Fax === 'true') {
            if (status) update_Agency()
            else agencySubmit()
        }
    }, [ORI, MunicipalityCode, Agency_Name, ShortName, Agency_Address1, Agency_StateId, Agency_CityId, Agency_Phone, Agency_Fax])

    // Save Agency
    const agencySubmit = () => {
        var result = agencyData?.find(item => {
            if (item.ORI === value.ORI) {
                return true
            } else return false
        }
        );
        if (result) {
            toastifyError('ORI Code Already Exists')
            setErrors({ ...errors, ['ORI']: '' })
        } else {

            const values = EncryptedList(JSON.stringify(value));
            const data = {
                "Data": values
            }
            axios.post('Agency/AgencyInsert', data)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data.Id.trim());
                        getAgency()
                        upload_Image_File(response.data.Id)
                        get_CountList(response.data.Id)
                        navigate(`/agencyTab?id=U2FsdGVkX1${response.data.Id.trim()}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`); setStatus(true)
                        toastifySuccess(response.data.Message)
                        setErrors({ ...errors, ['Agency_Name']: '' })
                    } else {
                        toastifyError(response.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    // Update Agency 
    const update_Agency = () => {
        var result = agencyData?.find(item => {
            if (item?.AgencyID != aId) {
                if (item.ORI === value.ORI) {
                    return true
                } else return false
            }
        }
        );
        if (result) {
            toastifyError('ORI Code Already Exists')
            setErrors({ ...errors, ['ORI']: '' })
        } else {
            const values = EncryptedList(JSON.stringify(value));
            const data = {
                "Data": values
            };
            axios.post('Agency/AgencyUpdate', data)
                .then(response => {
                    if (response.data.success) {
                        // setShowCount(true)
                        if (!agencyEditVal[0]?.Agency_Photo) {
                            if (image) {
                                upload_Image_File(aId)
                            }
                        }
                        toastifySuccess(response.data.Message)
                        setErrors({ ...errors, ['Agency_Name']: '' });
                        getAgency();
                    } else {
                        toastifyError(response.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    // Rest Value After Call Cencel Button
    const rest_Value = (e) => {
        // e.preventDefault()
        // setShowCount(false)
        // setStatus(false); setAgencyId()
        setValue({
            ...value,
            'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '', 'ZipName': '', 'CityName': '', 'StateName': ''
        }); setCityList(); setZipList()
    }

    const delete_Agency = (e, id) => {
        e.preventDefault()
        const value = {
            'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            'AgencyID': id
        }
        const values = EncryptedList(JSON.stringify(value));
        const data = {
            "Data": values
        }
        axios.post('Agency/AgencyDelete', data)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    toastifySuccess(response.data.Message)
                    getAgency()
                } else {
                    toastifyError(response.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: "#f5cfcf" }),
        option: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "#e0ebf3" : null,
                color: "#333333"
            };
        }
    };


    useEffect(() => {
        const inputFile = document.querySelector("#picture__input");
        const pictureImage = document.querySelector(".picture__image");
        const pictureImageTxt = "Choose an image";
        pictureImage.innerHTML = pictureImageTxt;

        const img = document.createElement("img");
        img.src = agencyEditVal[0]?.Agency_Photo && status? agencyEditVal[0]?.Agency_Photo : uploadImage;
        img.classList.add("picture__img");
        pictureImage.innerHTML = "";
        pictureImage.appendChild(img);
        inputFile.addEventListener("change", function (e) {
            const inputTarget = e.target;
            const file = inputTarget.files[0];

            if (file) {
                const reader = new FileReader();

                reader.addEventListener("load", function (e) {
                    const readerTarget = e.target;

                    const img = document.createElement("img");
                    img.src = readerTarget.result;
                    img.classList.add("picture__img");

                    pictureImage.innerHTML = "";
                    pictureImage.appendChild(img);
                });

                reader.readAsDataURL(file);
            } else {
                pictureImage.innerHTML = pictureImageTxt;
            }
        });
    }, [agencyEditVal, status])

    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                setImage(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Upload Agency Image 
    const upload_Image_File = (id) => {
        const val = {
            'AgencyID': id,
            'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("Agency_Path", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('Agency/AgencyPhoto', formdata)
            .then((res) => {
                if(res.success){
                    setImage('')
                } else setImage('')
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            AgencyID: aId,
            DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        AddDeleteUpadate('Agency/Delete_AgencyPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Edit_Agency_Data(aId)
            } else {
                toastifyError(data.Message)
            }
        });
    }
   
    return (
        <>
            <div className="row ">
                <div className="col-12 " id='display-not-form'>
                    <div className="col-12 col-md-12 pt-2 p-0" >
                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center fs">
                                Agency
                            </p>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-12 col-md-12 col-lg-10 pt-2 p-0" >
                            <div className="row">
                                <div className="col-6 col-md-6 col-lg-2 mt-1 pt-1">
                                    <div class="text-field">
                                        <input type="text" maxlength="9" name='ORI' style={{ textTransform: "uppercase" }}
                                            className={fieldPermisionAgency?.ORI ?
                                                fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 1 && agencyEditVal?.ORI === '' && status ? 'requiredColor' : fieldPermisionAgency?.ORI[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.ORI[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                            }
                                            onChange={fieldPermisionAgency?.ORI ?
                                                fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 1 && agencyEditVal?.ORI === '' && status ? handleChange : fieldPermisionAgency?.ORI[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.ORI[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                            value={value.ORI}
                                        />
                                        <label>ORI</label>
                                        <p><span className='hovertext' data-hover="ORI : Enter a 9 digit code starting with first two capital characters and ending with 00" ><i className='fa fa-exclamation-circle'></i></span></p>

                                        {errors.ORI !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ORI}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-2 mt-1 pt-1">
                                    <div class="text-field">
                                        <input type="text" style={{ textTransform: "uppercase" }}
                                            className={fieldPermisionAgency?.ShortName[0] ?
                                                fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && agencyEditVal?.ShortName === '' && status ? 'requiredColor' : fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.ShortName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                            }
                                            name='ShortName' value={value.ShortName}
                                            onChange={fieldPermisionAgency?.ShortName[0] ?
                                                fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && agencyEditVal?.ShortName === '' && status ? handleChange : fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.ShortName[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                            required />
                                        <label>Short Name</label>
                                        {errors.ShortName !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ShortName}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-6 mt-1 pt-1">
                                    <div class="text-field">
                                        <input type="text"
                                            className={fieldPermisionAgency?.Agency_Name[0] ?
                                                fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && agencyEditVal?.Agency_Name === '' && status ? 'requiredColor' : fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.Agency_Name[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                            } name='Agency_Name' value={value.Agency_Name}
                                            onChange={fieldPermisionAgency?.Agency_Name[0] ?
                                                fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && agencyEditVal?.Agency_Name === '' && status ? handleChange : fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.Agency_Name[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                            required
                                        />
                                        <label>Agency Name</label>

                                        {errors.Agency_Name !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_Name}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" maxlength="4"
                                            className={fieldPermisionAgency?.MunicipalityCode[0] ?
                                                fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && agencyEditVal?.MunicipalityCode === '' && status ? 'requiredColor' : fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                            } name='MunicipalityCode'
                                            value={value.MunicipalityCode}
                                            onChange={fieldPermisionAgency?.MunicipalityCode[0] ?
                                                fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && agencyEditVal?.MunicipalityCode === '' && status ? handleChange : fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                            required
                                        />
                                        <label>Municipality Code</label>
                                        <p ><span className='hovertext-small' data-hover="Enter a 4-digit Number" ><i className='fa fa-exclamation-circle'></i></span></p>

                                        {errors.MunicipalityCode !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MunicipalityCode}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-12 col-md-6 col-lg-4  mt-3">
                                            <div class="text-field">
                                                <textarea
                                                    className={fieldPermisionAgency?.Agency_Address1[0] ?
                                                        fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && agencyEditVal?.Agency_Address1 === '' && status ? 'requiredColor' : fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                    }
                                                    name='Agency_Address1' value={value.Agency_Address1}
                                                    onChange={fieldPermisionAgency?.Agency_Address1[0] ?
                                                        fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && agencyEditVal?.Agency_Address1 === '' && status ? handleChange : fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                    }
                                                    required cols="30" rows="1"></textarea>
                                                <label>Address</label>
                                                {errors.Agency_Address1 !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_Address1}</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="col-4 col-md-6 col-lg-3 mt-4 dropdown__box_req">
                                            {
                                                value?.StateName ?
                                                    <Select
                                                        styles={colourStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='Agency_StateId' menuPlacement="top"
                                                        options={stateList}
                                                        defaultValue={value.StateName}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.Agency_StateId[0] ?
                                                            fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && agencyEditVal?.Agency_StateId === '' ? stateChanges : fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                        }
                                                        isDisabled={fieldPermisionAgency?.Agency_StateId[0] ?
                                                            fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && agencyEditVal?.Agency_StateId === '' ? false : fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    /> : <>
                                                        <Select
                                                            styles={colourStyles}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='Agency_StateId' menuPlacement="top"
                                                            options={stateList}
                                                            isClearable
                                                            onChange={fieldPermisionAgency?.Agency_StateId[0] ?
                                                                fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && agencyEditVal?.Agency_StateId === '' ? stateChanges : fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                            }
                                                            isDisabled={fieldPermisionAgency?.Agency_StateId[0] ?
                                                                fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && agencyEditVal?.Agency_StateId === '' ? false : fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        /></>
                                            }
                                            <label htmlFor="">State</label>
                                            {errors.Agency_StateId !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_StateId}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-4 col-md-6 col-lg-3 mt-4 dropdown__box_req" >
                                            {
                                                value.CityName ?
                                                    <Select
                                                        styles={colourStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='Agency_CityId' menuPlacement="top"
                                                        options={cityList}
                                                        defaultValue={value.CityName}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.Agency_CityId[0] ?
                                                            fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && agencyEditVal?.Agency_CityId === '' ? cityChanges : fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && !status ? cityChanges : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 1 && status ? cityChanges : '' : cityChanges
                                                        }
                                                        isDisabled={fieldPermisionAgency?.Agency_CityId[0] ?
                                                            fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && agencyEditVal?.Agency_CityId === '' ? false : fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    : <>
                                                        <Select
                                                            styles={colourStyles}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='Agency_CityId' menuPlacement="top"
                                                            options={cityList}
                                                            isClearable
                                                            onChange={fieldPermisionAgency?.Agency_CityId[0] ?
                                                                fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && agencyEditVal?.Agency_CityId === '' ? cityChanges : fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && !status ? cityChanges : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 1 && status ? cityChanges : '' : cityChanges
                                                            }
                                                            isDisabled={fieldPermisionAgency?.Agency_CityId[0] ?
                                                                fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && agencyEditVal?.Agency_CityId === '' ? false : fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        />
                                                    </>
                                            }

                                            <label htmlFor="">City</label>
                                            {errors.Agency_CityId !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_CityId}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-4 col-md-6 col-lg-2 mt-4 dropdown__box">
                                            {
                                                value.ZipName ?
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='Agency_ZipId' menuPlacement="top"
                                                        options={zipList}
                                                        defaultValue={value.ZipName}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.Agency_ZipId[0] ?
                                                            fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && agencyEditVal?.Agency_ZipId === '' ? zipChanges : fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && !status ? zipChanges : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 1 && status ? zipChanges : '' : zipChanges
                                                        }
                                                        isDisabled={fieldPermisionAgency?.Agency_ZipId[0] ?
                                                            fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && agencyEditVal?.Agency_ZipId === '' ? false : fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    :
                                                    <><Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='Agency_ZipId' menuPlacement="top"
                                                        options={zipList}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.Agency_ZipId[0] ?
                                                            fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 0 ? '' : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && agencyEditVal?.Agency_ZipId === '' ? zipChanges : fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && !status ? zipChanges : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 1 && status ? zipChanges : '' : zipChanges
                                                        }
                                                        isDisabled={fieldPermisionAgency?.Agency_ZipId[0] ?
                                                            fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 0 ? true : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && agencyEditVal?.Agency_ZipId === '' ? false : fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    /></>
                                            }
                                            <label htmlFor="">Zip</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-4 pt-1 pl-2 px-0   dropdown__box " >
                                    <select name="" id="" className="form-control requiredColor" style={{ height: '31px' }}>
                                        <option value="">+1</option>
                                    </select>
                                    <label className='pt-1'>Phone</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-2 mt-3 px-0 pr-1  ">
                                    <div class="text-field">
                                        <input type="text" maxlength={10}
                                            className={fieldPermisionAgency?.Agency_Phone[0] ?
                                                fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && agencyEditVal?.Agency_Phone === '' && status ? 'requiredColor' : fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                            }
                                            name='Agency_Phone' value={value.Agency_Phone}
                                            onChange={fieldPermisionAgency?.Agency_Phone[0] ?
                                                fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && agencyEditVal?.Agency_Phone === '' && status ? handleChange : fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                            required
                                        />
                                        <p><span className='hovertext-small' data-hover="Enter your 10 digit phone number" ><i className='fa fa-exclamation-circle'></i></span></p>

                                        {/* {/ <label>Phone</label> /} */}
                                        {errors.Agency_Phone !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_Phone}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-5 col-md-6 col-lg-2 mt-3">
                                    <div class="text-field">
                                        <p><span className='hovertext-small' data-hover="Enter a 10 digit Number " ><i className='fa fa-exclamation-circle'></i></span></p>
                                        <input type="text" maxlength="10"
                                            name='Agency_Fax' value={value.Agency_Fax}
                                            className={fieldPermisionAgency?.Agency_Fax[0] ?
                                                fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && agencyEditVal?.Agency_Fax === '' && status ? '' : fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                            }
                                            onChange={fieldPermisionAgency?.Agency_Fax[0] ?
                                                fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && agencyEditVal?.Agency_Fax === '' && status ? handleChange : fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                            }
                                        />
                                        <label>Fax</label>
                                        {errors.Agency_Fax !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Agency_Fax}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-12 col-lg-12 mt-2 text-right">
                                    {
                                        status ?
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.Changeok ?
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                                                        {/* <button type="button" className="btn btn-sm btn-success" onClick={() => setModalOpen(false)}>Close</button> */}
                                                        {/* <button type="button" className="btn btn-sm btn-success ml-1" onClick={rest_Value}>New</button> */}
                                                    </>
                                                    : <></> :
                                                <>
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                                                    {/* <button type="button" className="btn btn-sm btn-success" onClick={() => setModalOpen(false)}>Close</button> */}
                                                    {/* <button type="button" className="btn btn-sm btn-success ml-1" onClick={rest_Value}>New</button> */}
                                                </>
                                            :
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.AddOK ?
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                                        {/* <button type="button" className="btn btn-sm btn-success" onClick={() => setModalOpen(false)}>Close</button> */}

                                                    </>
                                                    : <></>
                                                : <>
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                                    {/* <button type="button" className="btn btn-sm btn-success" onClick={() => setModalOpen(false)}>Close</button> */}
                                                </>
                                    }
                                </div>
                            </div>
                            <IdentifyFieldColor />
                        </div>
                        <div className="col-md-2 pt-4">
                            <div className="img-box" >
                                <label className="picture" style={{ cursor: agencyEditVal[0]?.Agency_Photo && status ? 'not-allowed' : '' }} for={agencyEditVal[0]?.Agency_Photo && status ? "" : 'picture__input'} tabIndex="0">
                                    <span className="picture__image"></span>
                                </label>
                                <input type="file" name="picture__input" onChange={get_Image_File} id="picture__input" />
                            </div>
                            {
                                agencyEditVal[0]?.Agency_Photo ?
                                    <button type="button" data-toggle="modal" data-target="#DeleteModal" className="btn btn-sm btn-success ml-5">Delete</button>
                                    : <></>
                            }
                        </div>
                    </div>
                    {
                        Decrypt_Id_Name(localStorage.getItem('IsAllowmultipleLogin'), 'IsForAllowmultipleLogin') === '0' && !status ?

                            <div className="overlay-form">
                                <p>You don't have permision to Add Agency this data</p>
                            </div>
                            : <></>
                    }
                </div>
            </div>
            <DeletePopUpModal func={delete_Image_File} />
        </>
    )
}

export default Home

export const changeArrayFormat = (data, type) => {
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'zip') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_ZipId, label: sponsor.Zipcode })
        )
        return result[0]
    }
    if (type === 'state') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_StateId, label: sponsor.StateName })
        )
        return result[0]
    }
    if (type === 'city') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_CityId, label: sponsor.CityName })
        )
        return result[0]
    }
}