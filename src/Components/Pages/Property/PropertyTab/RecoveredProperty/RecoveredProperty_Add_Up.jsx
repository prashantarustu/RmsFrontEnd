import React, { useCallback, useContext } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingMonthDateYear } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { ArrChargeListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const RecoveredProperty_Add_Up = (props) => {

    const { get_Property_Count } = useContext(AgencyContext)

    const { masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, setModal, recoveredPropertyID, setRecoveredPropertyID, updateStatus, get_property_Data, propertyData, status, setStatus, } = props

    const [recoverDate, setDecoverDate] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [RecoveryTypeDrpData, setRecoveryTypeDrpData] = useState([]);
    const [UCRRecoveredDrpData, setUCRRecoveredDrpData] = useState([]);
    const [DispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [recoverTypeCode, setRecoverTypeCode] = useState('');
    const [remainBalance, setRemainBalance] = useState(0);

    const [Editval, setEditval] = useState();

    const [value, setValue] = useState({
        'MasterPropertyID': '',
        'PropertyID': '',
        'RecoveredPropertyID': '',
        'RecoveredIDNumber': '',
        'RecoveredDateTime': '',
        'OfficerPFID': '',
        'RecoveryTypeID': '',
        'RecoveredValue': '',
        'Comments': '',
        'Balance': '',
        'DispositionID': '',
        'UCRRecoveredID': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '', 'RecoverTypeCode': '',
    })

    useEffect(() => {
        setValue({ ...value, 'PropertyID': propertyID, 'CreatedByUserFK': LoginPinID, 'MasterPropertyID': masterPropertyID, })
    }, [propertyID, updateStatus]);

    useEffect(() => {
        if (sessionStorage.getItem('propertyStolenValue')) {
            if (propertyData) {
                var remainBal = Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue');
                var newArr = propertyData.map((val) => { return val.RecoveredValue });
                for (var i = 0; i < newArr.length; i++) {
                    // console.log(newArr[i])
                    remainBal = parseFloat(remainBal) - parseFloat(newArr[i]);
                }
                // console.log(remainBal)
                remainBal = parseFloat(remainBal)?.toFixed(2)
                setRemainBalance(remainBal);
                setValue({
                    ...value,
                    ['Balance']: remainBal
                })
            } else {
                setValue({
                    ...value,
                    ['Balance']: parseInt(Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue'))
                });
                setRemainBalance(parseFloat(Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue')));
            }
        } else {
            setRemainBalance(0)
        }
    }, [updateStatus, modal])

    // useEffect(() => {
    //     if (!recoveredPropertyID) {
    //         Sum();
    //     }
    // }, [value?.RecoveredValue])

    const Sum = () => {
        console.log("Calllll")
        var total = 0;
        var RecoveredValue = value?.RecoveredValue ? value?.RecoveredValue : 0
        total = parseFloat(remainBalance) - parseFloat(RecoveredValue)
        total = total?.toFixed()
        // console.log(total)
        setValue({
            ...value,
            ['Balance']: total
        })
    }

    useEffect(() => {
        if (recoveredPropertyID) {
            GetSingleData(recoveredPropertyID)
        } else {
            reset()
        }
    }, [recoveredPropertyID, updateStatus])

    const GetSingleData = () => {
        const val = {
            'RecoveredPropertyID': recoveredPropertyID
        }
        fetchPostData('RecoveredProperty/GetSingleData_RecoveredProperty', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (recoveredPropertyID) {
            setValue({
                ...value,
                'MasterPropertyID': Editval[0]?.MasterPropertyID,
                'PropertyID': Editval[0]?.PropertyID, 'DispositionID': Editval[0]?.DispositionID, 'UCRRecoveredID': Editval[0]?.UCRRecoveredID,
                'RecoveredPropertyID': Editval[0]?.RecoveredPropertyID, 'RecoveredIDNumber': Editval[0]?.RecoveredIDNumber, 'RecoveredDateTime': Editval[0]?.RecoveredDateTime,
                'OfficerPFID': Editval[0]?.OfficerPFID, 'RecoveredValue': Editval[0]?.RecoveredValue, 'RecoveryTypeID': Editval[0]?.RecoveryTypeID, 'Comments': Editval[0]?.Comments,
                'Balance': Editval[0]?.Balance, 'ModifiedByUserFK': LoginPinID,
            })
            setDecoverDate(Editval[0]?.RecoveredDateTime ? new Date(Editval[0]?.RecoveredDateTime) : '');
            setRecoverTypeCode(Get_Property_Code(Editval, RecoveryTypeDrpData));
        } else {
            setValue({
                ...value,
                'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': '', 'RecoveryTypeID': '', 'RecoveredValue': '', 'Comments': '', 'DispositionID': '', 'UCRRecoveredID': '',
            })
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionIDError']: RequiredFieldIncident(value.DispositionID) } })
        }
        if (RequiredFieldIncident(value.OfficerPFID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerPFIDError']: RequiredFieldIncident(value.OfficerPFID) } })
        }
        if (RequiredFieldIncident(value.RecoveredDateTime)) {
            setErrors(prevValues => { return { ...prevValues, ['RecoveredDateTimeError']: RequiredFieldIncident(value.RecoveredDateTime) } })
        }
        if (RequiredFieldIncident(value.RecoveryTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RecoveryTypeIDError']: RequiredFieldIncident(value.RecoveryTypeID) } })
        }
        if (RequiredFieldSpaceNotAllow(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['Comments']: RequiredFieldSpaceNotAllow(value.Comments) } })
        }
        if (recoverTypeCode === 'P') {
            if (RequiredFieldOnConditon(value.RecoveredValue)) {
                setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(value.RecoveredValue) }));
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(null) }));
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError } = errors


    useEffect(() => {
        // console.log(lossCode)
        if (recoverTypeCode === 'P') {
            // setVehicleRecovered(true);
        } else {
            // setVehicleRecovered(false);
        }
    }, [recoverTypeCode]);


    useEffect(() => {
        if (DispositionIDError === 'true' && OfficerPFIDError === 'true' && RecoveredDateTimeError === 'true' && RecoveryTypeIDError === 'true' && Comments === 'true' && ContactError === 'true') {
            if (recoveredPropertyID) Update_RecoveredProperty()
            else Add_RecoveredProperty()
        }
    }, [DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError])

    useEffect(() => {
        if (LoginAgencyID) {
            get_Head_Of_Agency(LoginAgencyID); get_RecoveryType(LoginAgencyID); get_UCRRecovered(); get_Dispositions();
        }
    }, [LoginAgencyID])

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const get_RecoveryType = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('RecoveryType/GetDataDropDown_RecoveryType', val).then((data) => {
            if (data) {
                setRecoveryTypeDrpData(threeColArray(data, 'RecoveryTypeID', 'Description', 'RecoveryTypeCode'));
            }
            else {
                setRecoveryTypeDrpData([])
            }
        })
    };

    const get_UCRRecovered = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('UCRRecovered/GetDataDropDown_UCRRecovered', val).then((data) => {
            if (data) {
                setUCRRecoveredDrpData(Comman_changeArrayFormat(data, 'UCRRecoveredID', 'Description'));
            }
            else {
                setUCRRecoveredDrpData([])
            }
        })
    };

    const get_Dispositions = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else {
                setDispositionsDrpData([])
            }
        })
    };

    const HandleChanges = (e) => {
        if (e.target.name === 'RecoveredValue') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    var total = 0
                    total = parseFloat(remainBalance) - parseFloat(e.target.value)
                    total = total?.toFixed(2)
                    setValue(pre => {
                        return {
                            ...pre,
                            ['Balance']: total,
                            // ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value),
                            [e.target.name]: ele
                        }
                    });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            var total = 0
                            total = parseFloat(remainBalance) - parseFloat(e.target.value)
                            total = total?.toFixed(2)
                            // console.log(total?.substring(0, total.indexOf('.') + 3))
                            setValue(pre => {
                                return {
                                    ...pre,
                                    ['Balance']: total,
                                    // ['Balance']: total?.substring(0, total?.indexOf('.') + 3),
                                    [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2)
                                }
                            });
                        } else {

                        }
                    } else {
                        var total = 0
                        total = parseFloat(remainBalance) - parseFloat(e.target.value)
                        total = total.toFixed(2)
                        setValue(pre => {
                            return {
                                ...pre,
                                ['Balance']: total,
                                // ['Balance']: total?.substring(0, total?.indexOf('.') + 3),
                                [e.target.name]: ele
                            }
                        });
                    }
                }
            } else {
                if (ele.length === 16) {
                    var total = 0;
                    total = parseFloat(remainBalance) - parseFloat(ele)
                    total = total?.toFixed(2)
                    // console.log(total)
                    setValue({ ...value, ['Balance']: total ? total : remainBalance, [e.target.name]: ele });
                } else {
                    // console.log(parseFloat(remainBalance) - parseFloat(ele))
                    var total = 0;
                    total = parseFloat(remainBalance) - parseFloat(ele ? ele : 0)
                    total = total?.toFixed(2)
                    // console.log(total)
                    setValue({ ...value, ['Balance']: total ? total : remainBalance, [e.target.name]: ele });

                }
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    // const RecoveredValueOnChange = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;
    //     if (e) {
    //         if (name === 'RecoveredValue') {
    //             var ele = e.target.value.replace(/[^0-9\.]/g, "")
    //             // console.log(ele.includes('.'))
    //             if (ele.includes('.')) {
    //                 const newValues = {
    //                     ...value,
    //                     [name]: value
    //                 }
    //                 // setValue(newValues);
    //                 calcSum(remainBalance)
    //             } else {
    //                 const newValues = {
    //                     ['RecoveredValue']: value
    //                 }
    //                 console.log(newValues)
    //                 setValue(newValues);
    //                 calcSum(remainBalance, newValues)
    //             }
    //         }
    //     } else {
    //         setValue({
    //             ...value,
    //             [name]: ""
    //         })
    //     }
    // }

    // const calcSum = (remainBalance, newValues) => {

    //     const { RecoveredValue } = newValues;
    //     console.log(RecoveredValue);

    //     var total = 0
    //     total = parseFloat(remainBalance) - parseFloat(RecoveredValue)
    //     total = total?.toFixed(2)
    //     // console.log(total)
    //     setRemainBalance(total);
    //     // setValue({ ...value, ['Balance']: total, })

    // }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'RecoveryTypeID') {
                setValue({
                    ...value,
                    ['RecoveryTypeID']: e.value
                })
                setRecoverTypeCode(e.id)
                if (e.id === 'FU' || e.id === 'F') {
                    if (propertyData) {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: remainBalance } })
                    } else {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: sessionStorage.getItem('propertyStolenValue') ? Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue') : '', } })
                    }
                } else if (e.id === 'P' || e.id !== 'FU' || e.id !== 'F') {
                    setValue(pre => { return { ...pre, ['RecoveredValue']: '' } })
                }
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })

            }
        } else {
            setValue({
                ...value,
                [name]: null
            });
        }
    }

    const Add_RecoveredProperty = (e) => {
        if (value.RecoveredValue != 0) {
            if (parseFloat(value.RecoveredValue) <= parseFloat(remainBalance)) {
                if (remainBalance !== 0) {
                    AddDeleteUpadate('RecoveredProperty/Insert_RecoveredProperty', value)
                        .then((res) => {
                            toastifySuccess(res.Message);
                            get_property_Data(propertyID);
                            get_Property_Count(propertyID);
                            setModal(false);
                            setStatus(false);
                            reset();
                        })
                } else {
                    toastifyError("Remaining Balance is Zero")
                }
            } else {
                toastifyError("Recovered value should not be greater than Remaining Value")
            }
        } else {
            toastifyError("The recovered value must be greater than zero")
        }
    }

    const Update_RecoveredProperty = () => {
        AddDeleteUpadate('RecoveredProperty/Update_RecoveredProperty', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            setStatus(false);
            reset();
            get_property_Data(propertyID);
        })
    }

    const OnClose = () => {
        setModal(false)
        reset();
        setRecoveredPropertyID(); setRecoverTypeCode()
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const reset = () => {
        setValue(pre => {
            return {
                ...pre,
                'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': '', 'RecoveryTypeID': '', 'RecoveredValue': '', 'Comments': '', 'Balance': '', 'DispositionID': '', 'UCRRecoveredID': '',
            }
        });
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '','ContactError':'',
        });
        setDecoverDate("");
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
            setModal(false)
            // reset();
            setRecoveredPropertyID(); setRecoverTypeCode()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);


    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RecoveredPropertyModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Recovered Property</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row bb">
                                                            <div className="col-6 col-md-6 col-lg-4 mt-1">
                                                                <div class="text-field">
                                                                    <input type="text" className="readonlyColor" value={value?.RecoveredIDNumber} name="recoverid" required readOnly />
                                                                    <label>Recovered Id</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-4 pt-1 ">
                                                                <div class="dropdown__box">
                                                                    <Select
                                                                        name='OfficerPFID'
                                                                        id='OfficerPFID'
                                                                        value={headOfAgency?.filter((obj) => obj.value === value?.OfficerPFID)}
                                                                        options={headOfAgency}
                                                                        onChange={(e) => ChangeDropDown(e, 'OfficerPFID')}
                                                                        styles={colourStyles}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' >Officer Pf</label>
                                                                    {errors.OfficerPFIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerPFIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-4  ">
                                                                <div className="dropdown__box ">
                                                                    <DatePicker
                                                                        id='RecoveredDateTime'
                                                                        name='RecoveredDateTime'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setDecoverDate(date); setValue({ ...value, ['RecoveredDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        timeInputLabel
                                                                        isClearable={value?.RecoveredDateTime ? true : false}
                                                                        selected={recoverDate}
                                                                        placeholderText={value?.RecoveredDateTime ? value.RecoveredDateTime : 'Select...'}
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        className='requiredColor'
                                                                        autoComplete='Off'
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        peekNextMonth
                                                                        dropdownMode="select"
                                                                        maxDate={new Date(sessionStorage.getItem('OccurredFromDate') ? Decrypt_Id_Name(sessionStorage.getItem('OccurredFromDate'), 'OForOccurredFromDate') : null)}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Recovered Date/Time</label>
                                                                    {errors.RecoveredDateTimeError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveredDateTimeError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-4  mt-2">
                                                                <div class="dropdown__box">
                                                                    <Select
                                                                        name='RecoveryTypeID'
                                                                        value={RecoveryTypeDrpData?.filter((obj) => obj.value === value?.RecoveryTypeID)}
                                                                        options={RecoveryTypeDrpData}
                                                                        onChange={(e) => ChangeDropDown(e, 'RecoveryTypeID')}
                                                                        styles={colourStyles}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' >Recovery Type</label>
                                                                    {errors.RecoveryTypeIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveryTypeIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-4" style={{ marginTop: '10px' }}>
                                                                <div class="text-field">
                                                                    <input type="text" name="RecoveredValue" value={value?.RecoveredValue} onChange={HandleChanges} className={`${recoverTypeCode === 'P' ? " " : "readonlyColor"} requiredColor`} required readOnly={recoverTypeCode === 'P' ? false : true}
                                                                    />
                                                                    <label >Recovered Value</label>
                                                                </div>
                                                                {errors.ContactError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-12  col-md-12 col-lg-12 mt-1 mb-2" >
                                                                <div className="dropdown__box">
                                                                    <textarea name='Comments' value={value?.Comments} onChange={HandleChanges} id="Comments" cols="30" rows='2' className="form-control pt-2 pb-2  requiredColor" ></textarea>
                                                                    <label htmlFor="" >Comments</label>
                                                                </div>
                                                                {errors.Comments !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Comments}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col-6 col-md-6 col-lg-6" style={{ marginTop: '2px' }}>
                                                                <div class="text-field">
                                                                    <input type="text" name="Balance" value={value?.Balance < 0 ? 0 : value?.Balance} onChange={HandleChanges} className="readonlyColor" required readOnly />
                                                                    <label>Balance</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-6  dropdown__box">
                                                                <Select
                                                                    name='DispositionID'
                                                                    value={DispositionsDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                                                                    options={DispositionsDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                                    styles={colourStyles}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' >Disposition</label>
                                                                {errors.DispositionIDError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</span>
                                                                ) : null}
                                                            </div>
                                                            {/* <div class="col-6 col-md-6  col-lg-4  dropdown__box">
                                                                <Select
                                                                    name='UCRRecoveredID'
                                                                    value={UCRRecoveredDrpData?.filter((obj) => obj.value === value?.UCRRecoveredID)}
                                                                    options={UCRRecoveredDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'UCRRecoveredID')}
                                                                    styles={customStylesWithOutColor}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' >UCR Recovered</label>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        {
                                            recoveredPropertyID ?
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={OnClose} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default RecoveredProperty_Add_Up

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.RecoveryTypeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}
