import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, EncryptedList, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../../Common/Utility';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import SelectBox from '../../../../Common/SelectBox';
import { useContext } from 'react';
import { changeArray, fourColArray, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { components } from "react-select";
import Location from '../../../../Location/Location';
import makeAnimated from "react-select/animated";
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Email_Field_Contact, PhoneFieldNotReq, RequiredField } from '../../../../Pages/Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';
import { SSN_Field } from '../../../../Pages/PersonnelCom/Validation/PersonnelValidation';
import MobileTab from '../../../MobileUtility/MobileTab';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import NameVerifyLocation from './NameVerifyLocation';

const Option = props => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <p className='ml-2 d-inline'>{props.label}</p>
            </components.Option>
        </div>
    );
};

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const animatedComponents = makeAnimated()

const NameHome = () => {

    const { updateCount, setUpdateCount, setChangesStatus } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const [modalStatus, setModalStatus] = useState(false);
    const [nameID, setNameID] = useState();
    const [masterNameID, setMasterNameID] = useState();
    const [nameTypeIdDrp, setNameTypeIdDrp] = useState([]);
    const [nameTypeCode, setNameTypeCode] = useState();
    const [suffixIdDrp, setsuffixIdDrp] = useState([]);
    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [verifyIdDrp, setverifyIdDrp] = useState([]);
    const [certifiedByIdDrp, setCertifiedIdDrp] = useState([]);
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
    const [phoneTypeCode, setPhoneTypeCode] = useState('');
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [DOBDate, setDOBDate] = useState();
    const [yearsVal, setYearsVal] = useState();
    const [juvinile, setJuvinile] = useState();
    const [Editval, setEditval] = useState([]);

    const [Selected, setSelected] = useState({
        optionSelected: null
    });

    // Verify Location 
    const [addVerifySingleData, setVerifySingleData] = useState([])

  
    const [value, setValue] = useState({
        'NameIDNumber': 'Auto Generated',
        // DropDown
        'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
        'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '', 'AgeUnitID': '',
        // checkbox
        'IsJuvenile': '',
        'IsVerify': true, 'IsUnListedPhNo': '',
        //textbox
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
        'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '',
        'Address': '', 'Contact': '',
        //Datepicker
        'DateOfBirth': '', 'CertifiedDtTm': '', 'AgeFrom': '',
        'AgeTo': '', 'Years': '',
        // extra
        'ModifiedByUserFK': '',
        'MasterNameID': '',
        'NameID': '',
        'CreatedByUserFK': '',
        'AgencyID':'',
        // 'AgencyName': Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName'),
        'ArrestID': "",
        'WarrantID': "",
        'TicketID': "",
        'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
        //--------------------verify Location-----------------
        'NameLocationID': '',
        'IncidentIDFRW': '',
        'Officer_Name':  '',
        'PINID':   '',
        // 'RMSIncidentID': sessionStorage.getItem('RMSIncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('RMSIncidentId'), 'RForRMSIncidentID') : '',
    });

    const [errors, setErrors] = useState({
        'NameTypeIDError': '',
        'LastNameError': '',
        'NameReasonCodeIDError': '',
        'CertifiedByIDError': '',
        'ContactError': 'true',
    })

    const check_Validation_Error = (e) => {
        if (RequiredField(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
        }
        if (RequiredFieldIncident(value.NameTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['NameTypeIDError']: RequiredFieldIncident(value.NameTypeID) } })
        }
        if (RequiredFieldIncident(value.CertifiedByID)) {
            setErrors(prevValues => { return { ...prevValues, ['CertifiedByIDError']: RequiredFieldIncident(value.CertifiedByID) } })
        }
        if (RequiredFieldIncident(value.NameReasonCodeID)) {
            setErrors(prevValues => { return { ...prevValues, ['NameReasonCodeIDError']: RequiredFieldIncident(value.NameReasonCodeID) } })
        }
        if (SSN_Field(value.SSN)) {
            setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
        }
        if (phoneTypeCode === 'E') {
            if (Email_Field_Contact(value.Contact)) {
                setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field_Contact(value.Contact) } })
            }
        } else if (phoneTypeCode) {
            if (PhoneFieldNotReq(value.Contact)) {
                setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(value.Contact) } })
            }
        }
    }

    // Check All Field Format is True Then Submit 
    const { LastNameError, NameTypeIDError, NameReasonCodeIDError, ContactError, SSN } = errors

    useEffect(() => {
        if (nameTypeCode === 'B') {
            if (LastNameError === 'true' && NameTypeIDError === 'true'  && NameReasonCodeIDError === 'true' && ContactError === 'true') {
                if (nameID) Update_Name();
                else InsertName();
            }
            else if (LastNameError === 'Required *' || NameTypeIDError === 'Required *' ||  NameReasonCodeIDError === 'Required *' || ContactError === 'Required *') toastifyError('Please Fill All Required Field')
        } else {
            if (LastNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && SSN === 'true') {
                if (nameID) Update_Name();
                else InsertName();
            }
            else if (LastNameError === 'Required *' || NameTypeIDError === 'Required *'|| NameReasonCodeIDError === 'Required *' || ContactError === 'Required *') toastifyError('Please Fill All Required Field')
        }
    }, [LastNameError, NameTypeIDError, NameReasonCodeIDError, ContactError, SSN])

    useEffect(() => {
        if (('NameID')) {
            // get_Name_FRW_SingleData(Decrypt_Id_Name(sessionStorage.getItem('NameID'), 'NForNameId'));
            // setNameID(Decrypt_Id_Name(sessionStorage.getItem('NameID'), 'NForNameId'));
        } else {
            setNameID('')
        }
    }, [updateCount]);

    const get_Name_FRW_SingleData = (Id) => {
        const val = {
            'NameID': Id,
        }
        fetchPostData('Name_FRW/GetSingleData_Name_FRW', val).then((res) => {
            if (res) {
                setEditval(res);
            }
            else {
                setEditval();
            }
        })
    }

    useEffect(() => {
        if (nameID) {
            if (Editval.length > 0) {
                console.log(Editval[0]);
                get_Name_MultiImage(Editval[0]?.NameID);
                setValue({
                    ...value,
                    'NameID': Editval[0]?.NameID,
                    'NameIDNumber': Editval[0]?.NameIDNumber ? Editval[0]?.NameIDNumber : 'Auto Generated',
                    // DropDown
                    'NameTypeID': Editval[0]?.NameTypeID, 'BusinessTypeID': Editval[0]?.BusinessTypeID, 'SuffixID': Editval[0]?.SuffixID, 'VerifyID': Editval[0]?.VerifyID,
                    'SexID': Editval[0]?.SexID, 'RaceID': Editval[0]?.RaceID, 'PhoneTypeID': Editval[0]?.PhoneTypeID, 'EthnicityID': Editval[0]?.EthnicityID, 'AgeUnitID': Editval[0]?.AgeUnitID,
                    'NameReasonCodeID': Editval[0]?.ReasonCode ? changeArray(Editval[0]?.ReasonCode, 'NameReasonCodeID') : '', 'CertifiedByID': Editval[0]?.CertifiedByID,
                    // checkbox
                    'IsJuvenile': Editval[0]?.IsJuvenile,
                    'IsVerify': Editval[0]?.IsVerify,
                    'IsUnListedPhNo': Editval[0]?.IsUnListedPhNo,
                    //textbox
                    'LastName': Editval[0]?.LastName, 'FirstName': Editval[0]?.FirstName, 'MiddleName': Editval[0]?.MiddleName,
                    'SSN': Editval[0]?.SSN, 'WeightFrom': Editval[0]?.WeightFrom, 'WeightTo': Editval[0]?.WeightTo,
                    'HeightFrom': Editval[0]?.HeightFrom, 'HeightTo': Editval[0]?.HeightTo, 'Address': Editval[0]?.Address,
                    'Contact': Editval[0]?.Contact, 'AgeFrom': Editval[0]?.AgeFrom ? Editval[0]?.AgeFrom : '', 'AgeTo': Editval[0]?.AgeTo ? Editval[0]?.AgeTo : '',
                    //Datepicker
                    'DateOfBirth': Editval[0]?.DateOfBirth ? getShowingWithOutTime(Editval[0]?.DateOfBirth) : '',
                    'CertifiedDtTm': Editval[0]?.CertifiedDtTm ? getShowingDateText(Editval[0]?.CertifiedDtTm) : '',
                    'Years': Editval[0]?.Years,
                    'NameLocationID': Editval[0]?.NameLocationID,
                    'ModifiedByUserFK': '',
                })
                GetReasonIdDrp(Editval[0]?.NameTypeID);
                setPhoneTypeCode(Get_PhoneType_Code(Editval, phoneTypeIdDrp));
                setDOBDate(Editval[0]?.DateOfBirth ? new Date(Editval[0]?.DateOfBirth) : '');
                setNameTypeCode(Editval[0]?.NameTypeCode);
                setSelected({
                    optionSelected: Editval[0]?.ReasonCode ? fourColArray(Editval[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                if (Editval[0]?.Years) {
                    var Years = Editval[0]?.Years.split(' ');
                    // console.log(Years)
                    setYearsVal(Years[1])
                }
            }
        }
        else {
            //   setShowOffender(false); setShowVictim(false);
            setValue({
                ...value,
                'NameID': '',
                'NameIDNumber': 'Auto Generated',
                // DropDown
                'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
                'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'AgeUnitID': '',
                // checkbox
                // 'IsJuvenile': '', 
                'IsVerify': '', 'IsUnListedPhNo': '',
                //textbox
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '',
                'HeightTo': '', 'Address': '', 'Contact': '',
                //Datepicker
                'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'AgeTo': '', 'Years': '', 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
            })
        }
    }, [Editval])

    useEffect(() => {
        if (nameTypeIdDrp.length === 0) GetNameTypeIdDrp();
        GetSuffixIDDrp(); getAgeUnitDrp(); GetSexIDDrp(); GetRaceIdDrp(); getEthinicityDrp(); GetVerifyIDDrp(); getcertifiedByIdDrp(); GetBusinessTypeDrp(); GetPhoneTypeIDDrp();
    }, [])

    useEffect(() => {
        GetReasonIdDrp(value.NameTypeID);
    }, [value.NameTypeID])

    const GetReasonIdDrp = (id) => {
        const val = {
            AgencyID:'',
            CategoryID: id,
        }
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
            if (data) {
                setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'))
            } else {
                setReasonIdDrp([]);
            }
        })
    }

    const GetPhoneTypeIDDrp = (IsEMail, IsPhone) => {
        const val = {
            AgencyID:'',
            IsEMail: IsEMail,
            IsPhone: IsPhone,
        }
        fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
            if (data) {
                // setContactType(Comman_changeArrayFormat(data, 'ContactTypeID', 'Description'))
                setPhoneTypeIdDrp(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
            } else {
                setPhoneTypeIdDrp([]);
            }
        })
    }

    const GetBusinessTypeDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
            if (data) {
                setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
            } else {
                setBusinessTypeDrp([]);
            }
        })
    };

    const getcertifiedByIdDrp = () => {
        const val = {
            AgencyID:''
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setCertifiedIdDrp(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setCertifiedIdDrp([])
            }
        })
    };

    const GetVerifyIDDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
            if (data) {
                setverifyIdDrp(Comman_changeArrayFormat(data, 'VerifyID', 'Description'))
            } else {
                setverifyIdDrp([]);
            }
        })
    };

    const getEthinicityDrp = () => {
        const val = {
            AgencyID:''
        }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            }
            else {
                setEthinicityDrpData([])
            }
        })
    };

    const GetRaceIdDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }

    const GetSexIDDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }

    const getAgeUnitDrp = () => {
        const val = {
            AgencyID:''
        }
        fetchPostData('/AgeUnit/GetDataDropDown_AgeUnit', val).then((data) => {
            if (data) {
                if (value.DateOfBirth) {
                    const id = data?.filter((val) => { if (val.AgeUnitCode === "Y") return val })
                    if (id.length > 0) {
                        setValue(prevValues => { return { ...prevValues, ['AgeUnitID']: id[0].AgeUnitID } })
                    }
                }
                setAgeUnitDrpData(Comman_changeArrayFormat(data, 'AgeUnitID', 'Description'));
            }
            else {
                setAgeUnitDrpData([])
            }
        })
    };

    const GetSuffixIDDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setsuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            } else {
                setsuffixIdDrp([]);
            }
        })
    };

    const GetNameTypeIdDrp = () => {
        const val = {
            AgencyID:'',
        }
        fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
            if (data) {
                const id = data?.filter((val) => { if (val.NameTypeCode === "I") return val })
                if (id.length > 0) {
                    setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].NameTypeID } })
                    setNameTypeCode(id[0].NameTypeCode)
                }
                setNameTypeIdDrp(threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode'))
            } else {
                setNameTypeIdDrp([]);
                // setValue({ ...value, ['NameTypeID']: ''});
            }
        })
    };
    console.log(nameTypeCode)
    //--------------------------Image------------------------------->
    const [nameMultiImg, setNameMultiImg] = useState([])
    const [imageid, setImageId] = useState('');

    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                // setImage(e.target.files[0]);
                upload_Image_File(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const upload_Image_File = (image) => {
        const val = {
            'NameID': nameID,
            'CreatedByUserFK': '',
        }
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("MasterNamephotopath", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('Name_FRW/MasterNameFRW_Photo', formdata)
            .then((res) => {
                if (res.success) {
                    get_Name_MultiImage(nameID)
                }
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            'PhotoID': imageid,
            'DeletedByUserFK': ''
        }
        AddDeleteUpadate('Name_FRW/Delete_Name_FRWPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data?.Message);
                get_Name_MultiImage(nameID);
                get_Name_FRW_SingleData(nameID);
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    const get_Name_MultiImage = (nameID) => {
        const val = {
            'NameID': nameID,
        }
        fetchPostData('Name_FRW/GetData_Name_FRWPhoto', val)
            .then((res) => {
                if (res) { setNameMultiImg(res); }
                else { setNameMultiImg(); }
            })
    }

    //-----------------------------OnChanges Fuction--------------------->
    const ChangeNameType = (e, name) => {
        if (e) {
            if (name === 'NameTypeID') {
                setNameTypeCode(e.id)
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
            else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            setValue({
                ...value,
                [name]: null
            }); setNameTypeCode(''); setPhoneTypeCode('')
        }
    }
    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            });
        }
    };

    const ChangePhoneType = (e, name) => {
        if (e) {
            if (name === 'PhoneTypeID') {
                setPhoneTypeCode(e.id)
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
            setValue({
                ...value,
                [name]: e.value
            })
        } else if (e === null) {
            if (name === 'PhoneTypeID') {
                setValue({
                    ...value,
                    ['PhoneTypeID']: "",
                    ['Contact']: "",
                })
            }
        } else {
            setValue({
                ...value,
                [name]: null
            }); setPhoneTypeCode('')
        }
    }

    const HandleChange = (e) => {
        // console.log(e)
        if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
            if (e.target.name === 'IsVerify') {
                setValue({
                    ...value,
                    ['Address']: null,
                    [e.target.name]: e.target.checked,
                })
                setChangesStatus(true)
                if (e.target.checked) {
                    setModalStatus(false);
                } else {
                    setModalStatus(true);
                }
            } else {
                setChangesStatus(true)
                setValue({ ...value, [e.target.name]: e.target.checked });
            }
        }
        else if (e.target.name === 'Contact') {
            if (phoneTypeCode === 'E') {
                setChangesStatus(true)
                setValue({ ...value, [e.target.name]: e.target.value });
            } else {
                var ele = e.target.value.replace(/\D/g, '');
                if (ele.length === 10) {
                    var cleaned = ('' + ele).replace(/\D/g, '');
                    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        setChangesStatus(true)
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                        })
                    }
                } else {
                    ele = e.target.value.split('-').join('').replace(/\D/g, '');
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    })
                }
            }
        }
        else if (e.target.name === 'SSN') {

            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                    //   getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, match[1] + '-' + match[2] + '-' + match[3])
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        }
        else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        } else if (e.target.name === 'HeightFrom') {
            var ele = e.target.value
            if (ele.length === 3) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{1})(\d{2})$/);

                if (parseInt(match[2]) < 12) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + "'" + match[2] + "'"
                    })
                } else {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + "'" + "11" + "'"
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'HeightTo') {
            var ele = e.target.value
            if (ele.length === 3) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var HeightFromVal = value?.HeightFrom.split("'").join('').replace(/\D/g, '');
                var match = cleaned.match(/^(\d{1})(\d{2})$/);
                if (parseInt(HeightFromVal) < parseInt(cleaned)) {
                    if (parseInt(match[2]) < 12) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + match[2] + "'"
                        })
                    } else {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + "11" + "'"
                        })
                    }
                }
            } else {
                console.log(e.target.value.split("'").join('').replace(/\D/g, ''))
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'AgeTo' || e.target.name === 'AgeFrom') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setDOBDate(''); setValue({ ...value, ['Years']: null, ['DateOfBirth']: null })
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else setValue({ ...value, [e.target.name]: e.target.value })
    };

    const OnChangeSelectedReason = (data, name) => {
        const newArray = [...data]
        if (value.checkOffender === 1 && value.checkVictem === 1) {
            Selected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setValue({
                ...value,
                [name]: finalValueList
            });
            setSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (value.checkOffender === 1) {
            Selected.optionSelected?.map(val => {
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (value.checkVictem === 1) {
            Selected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        } else {
            let finalValueList = newArray?.map((item) => item.value);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setSelected({
                optionSelected: newArray
            });
        }
    };

    const color = {
        base: (newstyle) => ({
            ...newstyle,
            // fontWeight:600,
            backgroundColor: "#fce9bf",
            fontSize: 18,
            padding: 20,

        })
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 36,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 36,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const colourStylesReason = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            fontSize: 18,
            // height: 20,
            // minHeight: 30,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const navigate = useNavigate();
    const { setShowPage } = useContext(AgencyContext);

    const columns = [
        {
            name: 'Last Name',
            selector: 'Last Name',
            sortable: true,
        },
        {
            name: 'First Name',
            selector: 'First Name',
            sortable: true,
        },
        {
            name: 'Middle Name',
            selector: 'Middle Name',
            sortable: true,
        },
        {
            name: 'DOB',
            selector: 'DOB',
            sortable: true,
        },
        {
            name: 'Gender',
            selector: 'Gender',
            sortable: true,
        },
        {
            name: 'Race Type',
            selector: 'Race Type',
            sortable: true,
        },
        {
            name: 'SSN',
            selector: 'SSN',
            sortable: true,
        },
        {
            // name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            // cell: row => <>
            //     <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
            //         <i className="fa fa-edit"></i>
            //     </Link>
            //     <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
            //         <i className="fa fa-trash"></i>
            //     </Link>
            // </>
        }
    ];

    const handleDOBChange = (date) => {
        if (date) {
            setValue(pre => { return { ...pre, ['AgeFrom']: '', ['AgeTo']: '' } })
            setDOBDate(date);
            const res = getShowingWithOutTime(date).split("/")
            let age = calculateAge(`${res[0]} ${res[1]} ${res[2]}`);
            console.log(age)
            setValue({ ...value, ['AgeFrom']: age, ['Years']: age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null })
        } else if (date === null) {
            setDOBDate(''); setValue({ ...value, ['AgeFrom']: '', ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
            calculateAge(null)
        }
        else {
            setDOBDate(''); setValue({ ...value, ['AgeFrom']: null, ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
            calculateAge(null)
        }
        // if (!nameID) getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, false)
    };

    function calculateAge(birthday) {
        //milliseconds in a year 1000*24*60*60*365.24 = 31556736000; 

        // console.log( new Date(sessionStorage.getItem('IncidentReportedDate') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentReportedDate'), 'IForIncidentReportedDate') : new Date()))
        let today = openPage === 'mastername' ? new Date() : new Date(sessionStorage.getItem('IncidentReportedDate') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentReportedDate'), 'IForIncidentReportedDate') : new Date()),
            // let today =   new Date(), //incident Reported Date in same format as new Date()
            //birthay has 'Dec 25 1998'
            dob = new Date(birthday),
            //difference in milliseconds
            diff = today.getTime() - dob.getTime(),
            //convert milliseconds into years
            years = Math.floor(diff / 31556736000),
            //1 day has 86400000 milliseconds
            days_diff = Math.floor((diff % 31556736000) / 86400000),
            //1 month has 30.4167 days      
            months = Math.floor(days_diff / 30.4167),
            days = Math.floor(days_diff % 30.4167);

        setYearsVal(years)
        // return `${years} years ${months} months ${days} days`;
        return ` ${years} `;
    };

    useEffect(() => {
        if (yearsVal < 18 || parseInt(value.AgeTo) < 18) {
            setJuvinile(true)
            setValue({
                ...value,
                ['IsJuvenile']: true
            })
        } else {
            setJuvinile(false)
            setValue({
                ...value,
                ['IsJuvenile']: false
            })
        }
        getAgeUnitDrp();
    }, [value.DateOfBirth, value.AgeTo]);

    //------------------------------Add-Del-Upt------------------------------
    const InsertName = () => {
        // console.log(value)
        AddDeleteUpadate('Name_FRW/Insert_Name_FRW', value)
            .then((res) => {
                // console.log(res)
                if (res.success) {
                    toastifySuccess(res.Message);
                    //  setErrors({ ['NameTypeIDError']: '', });
                    // sessionStorage.setItem("NameID", Encrypted_Id_Name(res.NameID, 'NForNameId'));
                    setUpdateCount(updateCount + 1);
                    // sessionStorage.setItem("MasterNameID", Encrypted_Id_Name(res.MasterNameID, 'MForMasterNameID'));
                    setErrors({ ...errors, ['ContactError']: '', })
                } else {
                    toastifyError(res.Message);
                    setErrors({ ...errors, ['NameTypeIDError']: '', });
                }
            })
    }

    const Update_Name = () => {
        // console.log(value)
        AddDeleteUpadate('Name_FRW/Update_Name_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setUpdateCount(updateCount + 1)
                setErrors({ ...errors, ['ContactError']: '', })
            } else {
                toastifyError(res.Message);
                setErrors({ ...errors, ['NameTypeIDError']: '', });

            }
        })
    }
    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
          startRef.current.setOpen(false);
          startRef1.current.setOpen(false);
        }
      };
    return (
        <>
            <div className=" ">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row ">
                                            <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                                                <MobileTab />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                       ("NameID") &&
                        <>
                            {/* <div data-toggle="modal" data-target="#nameModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px' }}>
                                <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                <span onClick={''}>Tabs</span>
                            </div> */}
                            <Link to='/name-tabs'>
                                <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('MobileAdditionalInfo')}>
                                    <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                    <span >Tabs</span>
                                </div>
                            </Link>
                        </>
                    }
                    <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', marginTop: '-15px',  }}>
                        <div className="card-body">
                            <div className="row">
                                <div className={`col-12 col-md-12 px-0`}>
                                    <div className="row" style={{ marginTop: '-14px' }}>
                                        <div class="col-6 col-md-6  col-lg-3  " style={{ marginTop: '-0px' }}>
                                            <div className="text-mobile">
                                                <Select
                                                    styles={color}
                                                    name='NameTypeID'
                                                    value={nameTypeIdDrp?.filter((obj) => obj.value === value?.NameTypeID)}
                                                    options={nameTypeIdDrp}
                                                    onChange={(e) => ChangeNameType(e, 'NameTypeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                    isDisabled={nameID ? true : false}
                                                />
                                                <label htmlFor='' className='pt-1'>Name Type</label>
                                                {errors.NameTypeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameTypeIDError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-3">
                                            <div class="text-mobile">
                                                <input type="text" className='readonlyColor' value={value?.NameIDNumber} name='nameid' required readOnly />
                                                <label className='pt-1'>Name ID</label>
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-3 pt-1 px-0">
                                            <div class="form-check ">
                                                {
                                                    value.DateOfBirth ?
                                                        <>
                                                            <input class="form-check-input" type="checkbox" name='IsJuvenile' value={value?.IsJuvenile} checked={juvinile} id="flexCheckDefault" disabled={nameTypeCode === "B" ? true : false} />
                                                        </>
                                                        :
                                                        <input class="form-check-input" type="checkbox" name='IsJuvenile' value={value?.IsJuvenile} checked={''} id="flexCheckDefault" disabled={nameTypeCode === "B" ? true : false} />
                                                }
                                                <label class="form-check-label  " for="flexCheckDefault">
                                                    Juvenile
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-5">
                                            <div class="text-mobile">
                                                <input type="text" name='AgencyName' className='readonlyColor' value={(('Agency_Name'), 'ANForAgencyName')} required readOnly />
                                                <label className='pt-1'>Agency Name</label>
                                            </div>
                                        </div>
                                        {
                                            nameTypeCode === "B" ?
                                                <>
                                                    <div className="col-12 col-md-12 col-lg-12">
                                                        <div className="row ">
                                                            <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1">
                                                                <div class="text-mobile">
                                                                    <input type="text" name='LastName' className={'requiredColor'} value={value?.LastName} onChange={HandleChange} required />
                                                                    <label>Business Name</label>
                                                                    {errors.LastNameError !== 'true' && nameTypeCode === 'B' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1">
                                                                <div className=" text-mobile">
                                                                    <Select
                                                                        name='BusinessTypeID'
                                                                        value={businessTypeDrp?.filter((obj) => obj.value === value?.BusinessTypeID)}
                                                                        options={businessTypeDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'BusinessTypeID')}
                                                                        styles={color}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor="">Business Type</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="col-6 col-md-4 col-lg-3 mt-2" >
                                                        <div class="text-mobile">
                                                            <input type="text" name='LastName' className={nameTypeCode === "B" ? 'readonlyColor' : 'requiredColor'} value={value?.LastName} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                                                            <label className='pt-1'>
                                                                Last Name
                                                                <span className='text-danger pl-1 '>
                                                                    *
                                                                </span>
                                                            </label>
                                                            {/* {errors.LastNameError !== 'true' && nameTypeCode !== 'B' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                                                            ) : null} */}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3 mt-2">
                                                        <div class="text-mobile">
                                                            <input type="text" name='FirstName' className={nameTypeCode === "B" ? 'readonlyColor' : ''} value={value?.FirstName} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                                                            <label className='pt-1'>First Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-4 col-lg-3 mt-2">
                                                        <div class="text-mobile">
                                                            <input type="text" name='MiddleName' value={value?.MiddleName} className={nameTypeCode === "B" ? 'readonlyColor' : ''} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                                                            <label className='pt-1'>Middle Name</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6  col-lg-2  " style={{ marginTop: '3px' }}>
                                                        <div className="text__dropdwon">
                                                            <Select
                                                                styles={color}
                                                                name='SuffixID'
                                                                value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                                                options={suffixIdDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                isDisabled={nameTypeCode === "B" ? true : false}
                                                            />
                                                            <label htmlFor='' className='pt-1 mt-1'>Suffix</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-1 mt-4   ">
                                                        <div class="form-check px-3">
                                                            <input class="form-check-input" type="checkbox" name='IsUnknown' id="flexCheckDefault1" />
                                                            <label class="form-check-label" for="flexCheckDefault1">
                                                                Unknown
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3  pt-1">
                                                        <div className="text__dropdwon">
                                                            <DatePicker
                                                                id='DateOfBirth'
                                                                name='DateOfBirth'
                                                                className='name-datepicker'
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { handleDOBChange(date); }}
                                                                dateFormat="MM/dd/yyyy"
                                                                isClearable={value.DateOfBirth ? true : false}
                                                                selected={DOBDate}
                                                                placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select...'}
                                                                peekNextMonth
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                autoComplete='Off'
                                                                maxDate={new Date()}
                                                                disabled={nameTypeCode === "B" ? true : false}
                                                            />
                                                            <label htmlFor="" className='pt-2 '>DOB</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-2 col-lg-2 pt-2 ">
                                                        <div class="text-mobile">
                                                            {/* <input type="text" name='AgeFrom' maxLength={3} className={value.DateOfBirth ? 'readonlyColor' : ''} value={value?.AgeFrom} onChange={HandleChange} required disabled={value.DateOfBirth ? true : false} readOnly={value.DateOfBirth ? true : false} />
                                                            <label>Age From</label> */}
                                                            <input type="text" name='AgeFrom' maxLength={3} className={value.DateOfBirth ? 'readonlyColor' : ''} value={value?.AgeFrom} onChange={HandleChange} required disabled={value.DateOfBirth ? true : false} readOnly={value.DateOfBirth ? true : false} />
                                                            <label className='pt-1'>Age</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-2 col-lg-1 pt-2 ">
                                                        <div class="text-mobile">
                                                            <input type="text" name='AgeTo' maxLength={3} value={value?.AgeTo} onChange={HandleChange} required className={value.DateOfBirth ? 'readonlyColor' : ''} disabled={value.DateOfBirth ? true : false} readOnly={value.DateOfBirth ? true : false} />
                                                            {/* <label>Age To</label> */}

                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 pt-1 " >
                                                        <div className="text__dropdwon">
                                                            <Select
                                                                name='AgeUnitID'
                                                                value={ageUnitDrpData?.filter((obj) => obj.value === value?.AgeUnitID)}
                                                                options={ageUnitDrpData}
                                                                onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                styles={customStylesWithOutColor}
                                                                isDisabled={value.DateOfBirth ? true : false}
                                                            />
                                                            <label htmlFor="" className='pt-2'>Age Unit</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-4 pt-2  d-flex">
                                                        <div class="text-mobile ">
                                                            <input type="text" name='WeightFrom' value={value?.WeightFrom} maxLength={3} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' />
                                                            <label className='pt-1'>Weight From</label>
                                                        </div>
                                                        <div class="text-mobile ml-3">
                                                            <input type="text" name='WeightTo' value={value?.WeightTo} maxLength={3} onChange={HandleChange} required className={nameTypeCode === "B" ? 'readonlyColor' : ''} disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' />
                                                            <label className='pt-1'>Weight To</label>
                                                        </div>
                                                        <div class="mt-3">
                                                            <label className='text-dark text-bold pl-2'>LBS.</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                                                        <div class="text-mobile">
                                                            <input type="text" name='HeightFrom' maxLength={3} value={value?.HeightFrom} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} />
                                                            <label className='pt-1'>Height From</label>
                                                        </div>
                                                        <div class="text-mobile ml-3">
                                                            <input type="text" name='HeightTo' maxLength={3} value={value?.HeightTo} onChange={HandleChange} required className={nameTypeCode === "B" ? 'readonlyColor' : ''} disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                                                            <label className='pt-1'>Height To</label>
                                                        </div>
                                                        <div class="mt-3">
                                                            <label className='text-dark text-bold pl-2'>FT.</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                                                        <div class="text-mobile">
                                                            <input type="text" maxLength={9} name='SSN' value={value?.SSN} onChange={HandleChange} required />
                                                            <label className='pt-1'>SSN</label>
                                                            {errors.SSN !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SSN}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                styles={customStylesWithOutColor}
                                                                name='SexID'
                                                                value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                                options={sexIdDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                isDisabled={nameTypeCode === "B" ? true : false}
                                                            />
                                                            <label htmlFor="" className='pt-2'>Gender</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='RaceID'
                                                                value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                                options={raceIdDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                isDisabled={nameTypeCode === "B" ? true : false}
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            <label htmlFor="" className='pt-2'>Race</label>
                                                        </div>
                                                    </div>
                                                </>
                                        }
                                    </div>
                                </div>
                                <div className={`col-12 col-md-10 px-0`}>
                                    <div className="row">
                                        {
                                            nameTypeCode === "B" ?
                                                <>
                                                </>
                                                :
                                                <>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-1 ">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='EthnicityID'
                                                                value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                                options={ethinicityDrpData}
                                                                onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            <label htmlFor="" className='pt-2'>Ethnicity</label>
                                                        </div>
                                                    </div>
                                                </>
                                        }
                                        <div className="col-4 col-md-4 col-lg-4 mt-1 ">
                                            <div className=" text__dropdwon">
                                                <Select
                                                    name='PhoneTypeID'
                                                    value={phoneTypeIdDrp?.filter((obj) => obj.value === value?.PhoneTypeID)}
                                                    options={phoneTypeIdDrp}
                                                    onChange={(e) => ChangePhoneType(e, 'PhoneTypeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                    disabled={phoneTypeCode ? false : true}
                                                    styles={customStylesWithOutColor}
                                                />
                                                <label htmlFor="" className='pt-1 mt-1'>Phone Type</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-3 pt-2">
                                            <div class="text-mobile">
                                                <input type="text" maxLength={phoneTypeCode !== 'E' ? 10 : ''} name='Contact' value={value?.Contact} onChange={HandleChange} required disabled={phoneTypeCode ? false : true} />
                                                <label className='pt-1'>Contact</label>
                                                {errors.ContactError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-4 pt-1 px-0">
                                            <div class="form-check ">
                                                <input class="form-check-input" type="checkbox" name='IsUnListedPhNo' id="flexCheckDefault2" />
                                                <label class="form-check-label  " for="flexCheckDefault2">
                                                    Unlisted
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12 ">
                                            <div className="row">
                                                <div className="col-3 col-md-4 col-lg-4 ">
                                                    <div className="text__dropdwon">
                                                        <Select
                                                            name='VerifyID'
                                                            value={verifyIdDrp?.filter((obj) => obj.value === value?.VerifyID)}
                                                            options={verifyIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                            menuPlacement='top'
                                                        />
                                                        <label htmlFor="" className='pt-2'>How Verify</label>
                                                    </div>
                                                </div>
                                                <div className="col-8  col-md-8 col-lg-7 mt-1 " >
                                                    <div class="text-mobile">
                                                        <Location {...{ value, setValue }} col='Address' check={false} />
                                                        <label htmlFor="" className='px-1 pt-1'>Address</label>
                                                    </div>
                                                </div>
                                                {/* <div className="col-3 col-md-2 col-lg-1 mt-4 pt-2 ">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify} id="flexCheckDefault3" />
                                                        <label class="form-check-label" for="flexCheckDefault3">
                                                            Verify
                                                        </label>
                                                    </div>
                                                </div> */}

                                                <div className="col-3 col-md-2 col-lg-1 mt-4 pt-2">
                                                    <div class="form-check ">
                                                        <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify || value?.NameLocationID === 0 && true} onChange={HandleChange} data-toggle="modal" data-target="#MobileNameVerifyModal" id="flexCheckDefault3" />
                                                        {/* <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault3" /> */}
                                                        <label class="form-check-label " for="flexCheckDefault3">
                                                            Verify
                                                        </label>
                                                        {
                                                            value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                                                <>
                                                                    <i className="fa fa-edit " onClick={() => {  setModalStatus(true); }} data-toggle="modal" data-target="#MobileNameVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-8  col-md-8 col-lg-7 mt-2 " >
                                            <div class="text-mobile">
                                                <textarea name='Location' id="" cols="30" rows='1'
                                                    className="form-control " ></textarea>
                                                <label htmlFor="" className='px-1 pt-1'>Address</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-2 col-lg-1 mt-4 pt-2 ">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify} id="flexCheckDefault3" />
                                                <label class="form-check-label" for="flexCheckDefault3">
                                                    Verify
                                                </label>
                                            </div>
                                        </div> */}

                                        <div className="col-12 col-md-12 col-lg-6 " style={{ marginTop: '2px' }}>
                                            <div className="text__dropdwon">
                                                <SelectBox
                                                    styles={colourStylesReason}
                                                    options={reasonIdDrp}
                                                    menuPlacement="top"
                                                    // maxMenuHeight={220}
                                                    className='custom-reason'
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    allowSelectAll={true}
                                                    value={Selected.optionSelected}
                                                    components={{ Option, MultiValue, animatedComponents }}
                                                    onChange={(e) => value.checkVictem === 1 || value.checkVictem === 0 && value.checkOffender === 1 || value.checkOffender === 0 ? OnChangeSelectedReason(e, 'NameReasonCodeID') : ''}
                                                />
                                                <label htmlFor="" className='pt-1 mt-1'>
                                                    Reason Code
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.NameReasonCodeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 " style={{ marginTop: '2px' }}>
                                            <div className="text__dropdwon">
                                                <Select
                                                    styles={colourStylesReason}
                                                    name='CertifiedByID'
                                                    menuPlacement='top'
                                                    value={certifiedByIdDrp?.filter((obj) => obj.value === value?.CertifiedByID)}
                                                    options={certifiedByIdDrp}
                                                    onChange={(e) => ChangeDropDown(e, 'CertifiedByID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                // styles={color}
                                                />
                                                <label htmlFor="" className='pt-1 mt-1'>Certified By
                                                    {/* <span className='text-danger pl-1'>
                                                        *
                                                    </span> */}
                                                </label>
                                                {/* {errors.CertifiedByIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CertifiedByIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 " style={{ marginTop: '2px' }}>
                                            <div className='text__dropdwon'>
                                                <DatePicker
                                                    id='CertifiedDtTm'
                                                    name='CertifiedDtTm'
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['CertifiedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className='name-datepicker'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    autoComplete="nope"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.CertifiedDtTm ? true : false}
                                                    selected={value?.CertifiedDtTm && new Date(value?.CertifiedDtTm)}
                                                    placeholderText={'Select...'}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    maxDate={new Date()}
                                                />
                                                <label htmlFor="" className='pt-1 mt-1'>Certified Date/Time</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-4 col-md-4 col-lg-2 pl-3" style={{ marginTop: '5px' }}>
                                    <div className="img-box" >
                                        <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                            {
                                                nameMultiImg.length > 0 ?
                                                    nameMultiImg?.map((item, index) => (
                                                        <div key={index}>
                                                            <img src={item.Photo} style={{ height: '150px' }} />
                                                            <div className='box' style={{ background: 'red' }}>
                                                                <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID) }} >
                                                                    <i className='fa fa-close' ></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))
                                                    :
                                                    <div key='test'>
                                                        <img src={defualtImage} style={{ height: '150px' }} />
                                                    </div>
                                            }
                                        </Carousel>
                                        <div className="row" style={{ marginTop: '-10px' }}>
                                            {
                                                nameID ?
                                                    <>
                                                        <div className="col-md-12 text-center " style={{marginTop:'10px'}}>
                                                            <label className='pers-img '> <i className='fa fa-upload'></i>
                                                                <input type="file" size="60" onChange={get_Image_File} />
                                                            </label>
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {/* <div className="row bb px-1" style={{ marginTop: '-25px' }}> */}
            <div className="row bb px-1">
                <div className="col-12 text-right  " style={{ marginBottom: '-1px', marginTop: '-11px' }}>
                    {/* <button type="button" className="btn btn-lg  btn-success new-button mr-3">New</button> */}
                    <button type="button" className="btn btn-md  btn-success new-button mr-3" onClick={() => { check_Validation_Error() }}>{nameID ? 'Update' : 'Save'}</button>
                    <Link to={'/name-main'}>
                        <button type="button" className="btn btn-md btn-success new-button" onClick={() => { ('NameID'); }}>Close</button>
                    </Link>
                </div>

            </div>
            <NameVerifyLocation {...{ modalStatus, setModalStatus, value, setValue, addVerifySingleData,  }}/>
            <DeletePopUpModal func={delete_Image_File} />
        </>
    )
}

export default NameHome

const Get_PhoneType_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.PhoneTypeID));
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
};