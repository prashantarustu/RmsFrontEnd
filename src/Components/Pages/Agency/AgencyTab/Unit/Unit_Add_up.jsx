// Import Component
import React, { useState, memo } from 'react'
import { useEffect } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData, fieldPermision } from '../../../../hooks/Api';
import moment from 'moment'
import { RequiredField } from '../../AgencyValidation/validators';
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import DatePicker from "react-datepicker";
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';


function Unit_Add_Up(props) {
    // Hooks Initialization
    const { aId, pinId, unitEditData, status, get_Unit_List, unitList, modal, setModal, countUpd } = props
    const [associatedShiftList, setAssociatedShiftList] = useState([])
    const [divisionList, setDivisionList] = useState([])
    const { get_CountList } = useContext(AgencyContext)
    const [serviceDate, setServiceDate] = useState()

    const [value, setValue] = useState({
        "UnitCode": "",
        "AgencyID": aId,
        "DivisionId": "",
        "UnitName": "",
        "ServiceDate": "",
        "AssociatedShiftID": false,
        "AllowMobileLogin": "",
        "CreatedByUserFK": pinId,
        "ModifiedByUserFK": "",
        "UnitId": "",
        "AssociatedShiftName": '', 'DivisionName': ''
        // 'AllowMobileLogin':false
    });

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Unit Field
        "UnitCode": "", "DivisionId": "", "UnitName": "", "ServiceDate": "", "AssociatedShiftID": "",
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'UnitCodeError': '',
        'UnitNameError': '',
        'DivisionIdError': ''
    })

    // Onload Function
    useEffect(() => {
        if (aId) {
            get_AssociatedShift(aId)
            get_Division(aId);
            get_Field_Permision_Unit(aId, pinId)
        }
    }, [aId, pinId])

    // useEffect(() => {
    //     if (aId && pinId) get_Field_Permision_Unit(aId, pinId)
    // }, [aId, pinId])

    // useEffect (() => {
    //     if(!status) {
    //         console.log('ddd');
    //         setValue({
    //             ...value,
    //             ['AssociatedShiftName']: { value: '', label: '' }, ['DivisionName']: { value: '', label: '' }
    //         })
    //     }
    // }, [status])

    const get_AssociatedShift = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('MasterPersonnel/GetData_Shift', value)
            .then(res => {
                if (res) setAssociatedShiftList(changeArrayFormat(res, 'shift'))
                else setAssociatedShiftList()
            })
    }

    const get_Division = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('Division/GetData_Division', value)
            .then(res => {
                if (res) {
                    setDivisionList(changeArrayFormat(res, 'division'))
                }
                else setDivisionList([]);
            })
    }

    useEffect(() => {
        if (unitEditData?.UnitId) {
            setServiceDate(getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : new Date(unitEditData?.ServiceDate))
            // console.log();
            setValue({
                ...value,
                'AgencyID': unitEditData?.AgencyID,
                "UnitCode": unitEditData?.UnitCode, "DivisionId": unitEditData?.DivisionId, "UnitName": unitEditData?.UnitName,
                "ServiceDate": getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : getShowingWithOutTime(unitEditData?.ServiceDate), "AssociatedShiftID": unitEditData?.AssociatedShiftID, "AllowMobileLogin": unitEditData?.AllowMobileLogin,
                "UnitId": unitEditData?.UnitId,  "AssociatedShiftName": unitEditData?.AssociatedShiftID != null ? changeArrayFormat_WithFilter([unitEditData], 'shift') : '',
                'DivisionName': unitEditData?.DivisionId != null ? changeArrayFormat_WithFilter([unitEditData], 'division', divisionList) : '',
                //  "ModifiedByUserFK": Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                "ModifiedByUserFK": pinId,
            });
        } else {
            setValue({
                ...value,
                "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '',  "ModifiedByUserFK": '', "UnitId": '', 'AllowMobileLogin': false, "DivisionName": '', 'AssociatedShiftName': ''
            });
        }
    }, [unitEditData, countUpd])

    // Get Effective Field Permission
    const get_Field_Permision_Unit = (aId, pinId) => {
        fieldPermision(aId, 'A005', pinId).then(res => {
            // console.log(res)
            if (res) {
                // Unit Field 
                if (Agency_Field_Permistion_Filter(res, "Agency-UnitCode")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['UnitCode']: Agency_Field_Permistion_Filter(res, "Agency-UnitCode") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-Division")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['DivisionId']: Agency_Field_Permistion_Filter(res, "Agency-Division") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-UnitName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['UnitName']: Agency_Field_Permistion_Filter(res, "Agency-UnitName") } })
                }
                // console.log(Agency_Field_Permistion_Filter(res, "Agency-ServiceDate"))
                if (Agency_Field_Permistion_Filter(res, "Agency-ServiceDate")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ServiceDate']: Agency_Field_Permistion_Filter(res, "Agency-ServiceDate") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Agency-AssociatedShift")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['AssociatedShiftID']: Agency_Field_Permistion_Filter(res, "Agency-AssociatedShift") } })
                }
            }
        });
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        if (e.target.name === 'AllowMobileLogin') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    };

    const dateChange = (date) => {
        // if (date != null) {
        setServiceDate(date);
        setValue({ ...value, ['ServiceDate']: date })
        // } 
    }

    // Set value 
    const divisionChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['DivisionId']: e.value
            })
        } else {
            setValue({
                ...value,
                ['DivisionId']: null
            })
        }
    }

    const AssociatedShiftChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['AssociatedShiftID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['AssociatedShiftID']: null
            })
        }
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.UnitCode)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitCodeError']: RequiredField(value.UnitCode) } })
        }
        if (RequiredField(value.UnitName)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitNameError']: RequiredField(value.UnitName) } })
        }
        if (RequiredField(value.DivisionId)) {
            setErrors(prevValues => { return { ...prevValues, ['DivisionIdError']: RequiredField(value.DivisionId) } })
        }
    }

    const reset_Value = () => {
        setValue({
            ...value,
            "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "AllowMobileLogin": '', "ModifiedByUserFK": '', 'AssociatedShiftName': '', 'DivisionName': ''
        });
        setServiceDate()
    }

    const reset_call_Close = () => {
        setValue({
            ...value,
            "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "AllowMobileLogin": '', "ModifiedByUserFK": '', ['AssociatedShiftName']: { value: '', label: '' }, ['DivisionName']: { value: '', label: '' }
        });
        setServiceDate()
    }

    const closeModalReset = () => {
        setErrors({
            ...errors,
            'UnitCodeError': '', 'UnitNameError': '', 'DivisionIdError': ''
        });
        reset_Value()
    }

    // Check All Field Format is True Then Submit 
    const { UnitCodeError, UnitNameError, DivisionIdError } = errors

    useEffect(() => {
        if (UnitCodeError === 'true' && UnitNameError === 'true' && DivisionIdError === 'true') {
            if (status) unit_Update()
            else unit_Add()
        }
    }, [UnitCodeError, UnitNameError, DivisionIdError])

    // New Unit Create
    const unit_Add = async () => {
        var result = unitList?.find(item => {
            if (item.UnitCode === value.UnitCode) {
                return true
            } else return false
        }
        );
        var result1 = unitList?.find(item => {
            if (item.UnitName === value.UnitName) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            AddDeleteUpadate('Unit/UnitInsert', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.data); setErrors({ ...errors, ['UnitCodeError']: '' }); get_Unit_List(aId); get_CountList(aId); setModal(false); reset_Value()
                    }
                })
        }
    }

    // Unit Values Update
    const unit_Update = async () => {
        // console.log(value);
        var result = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitCode === value.UnitCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitName === value.UnitName) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            AddDeleteUpadate('Unit/UnitUpdate', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.data); reset_Value()
                        setErrors({ ...errors, ['UnitCodeError']: '' });
                        get_Unit_List(aId)
                        setModal(false)
                    }
                })
        }
    }
    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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

    // tab date change
    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="UnitModal" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class=" modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body ">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Unit</legend>
                                            {/* Praveen */}
                                            <div className="row pt-1 " rounded>
                                                <div className="col-4 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text"
                                                            value={value.UnitCode}
                                                            className={fieldPermisionAgency?.UnitCode[0] ?
                                                                fieldPermisionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermisionAgency?.UnitCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermisionAgency?.UnitCode[0]?.AddOK === 1 && unitEditData?.UnitCode === '' && status ? 'requiredColor' : fieldPermisionAgency?.UnitCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.UnitCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.UnitCode[0] ?
                                                                fieldPermisionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermisionAgency?.UnitCode[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermisionAgency?.UnitCode[0]?.AddOK === 1 && unitEditData?.UnitCode === '' && status ? handleInput : fieldPermisionAgency?.UnitCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.UnitCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            name='UnitCode' required />
                                                        <label>Unit Code </label>
                                                        {errors.UnitCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <div class="text-field ">
                                                        <input type="text"
                                                            className={fieldPermisionAgency?.UnitName[0] ?
                                                                fieldPermisionAgency?.UnitName[0]?.Changeok === 0 && fieldPermisionAgency?.UnitName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.UnitName[0]?.Changeok === 0 && fieldPermisionAgency?.UnitName[0]?.AddOK === 1 && unitEditData?.UnitName === '' && status ? 'requiredColor' : fieldPermisionAgency?.UnitName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.UnitName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.UnitName[0] ?
                                                                fieldPermisionAgency?.UnitName[0]?.Changeok === 0 && fieldPermisionAgency?.UnitName[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.UnitName[0]?.Changeok === 0 && fieldPermisionAgency?.UnitName[0]?.AddOK === 1 && unitEditData?.UnitName === '' && status ? handleInput : fieldPermisionAgency?.UnitName[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.UnitName[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            value={value.UnitName}
                                                            name='UnitName' required />
                                                        <label>Unit Name</label>
                                                        {errors.UnitNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                            </div>
                                            {/* <br /> */}
                                            <div className="row pt-2">
                                                <div className="col-4  dropdown__box_req">
                                                    {/* {
                                                        value?.DivisionName ?
                                                            <Select
                                                                styles={colourStyles}
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                defaultValue={value?.DivisionName}
                                                                options={divisionList}
                                                                isClearable
                                                                onChange={fieldPermisionAgency?.DivisionId[0] ?
                                                                    fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? divisionChanges : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !status ? divisionChanges : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && status ? divisionChanges : '' : divisionChanges
                                                                }
                                                                isDisabled={fieldPermisionAgency?.DivisionId[0] ?
                                                                    fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? false : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && status ? false : true : false
                                                                }
                                                                name='DivisionId'
                                                            />
                                                            : <> */}
                                                    <Select
                                                        styles={colourStyles}
                                                        value={divisionList?.filter((obj) => obj.value === value?.DivisionId)}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        options={divisionList}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.DivisionId[0] ?
                                                            fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? divisionChanges : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !status ? divisionChanges : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && status ? divisionChanges : '' : divisionChanges
                                                        }
                                                        isDisabled={fieldPermisionAgency?.DivisionId[0] ?
                                                            fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? false : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        name='DivisionId'
                                                    />
                                                    {/* </>
                                                    } */}

                                                    <label htmlFor="">Division</label>
                                                    {errors.DivisionIdError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionIdError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-4  ">
                                                    <div class="text-field mt-2 date__box ">
                                                        <DatePicker
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            autoComplete='Off'
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            name='ServiceDate'
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            isClearable={true}
                                                            // onChange={date => fieldPermisionAgency?.ServiceDate[0] ?
                                                            //     fieldPermisionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermisionAgency?.ServiceDate[0]?.AddOK === 0 && status ?
                                                            //         '' :
                                                            //         fieldPermisionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermisionAgency?.ServiceDate[0]?.AddOK === 1 && unitEditData?.ServiceDate === '' && status ?
                                                            //             dateChange(date) : fieldPermisionAgency?.ServiceDate[0]?.AddOK === 1 && !status ? dateChange(date) : fieldPermisionAgency?.ServiceDate[0]?.Changeok === 1 && status ?
                                                            //                 dateChange(date) :
                                                            //                 '' :
                                                            //     dateChange(date)
                                                            // }
                                                            onChange={date => fieldPermisionAgency?.ServiceDate[0] ? fieldPermisionAgency?.ServiceDate[0]?.Changeok === 0 ? '' : dateChange(date) : ''
                                                            }
                                                            disabled={fieldPermisionAgency?.ServiceDate[0] ?
                                                                fieldPermisionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermisionAgency?.ServiceDate[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermisionAgency?.ServiceDate[0]?.AddOK === 1 && unitEditData?.ServiceDate === '' && status ? false : fieldPermisionAgency?.ServiceDate[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.ServiceDate[0]?.Changeok === 1 && status ? false : true : false
                                                            }
                                                            selected={serviceDate}
                                                            placeholderText={value.ServiceDate ? value.ServiceDate : 'Select ..'}
                                                        />
                                                        <label>Service Date</label>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div class="form-group mt-3 dropdown__box">
                                                        {/* {
                                                            value?.AssociatedShiftName ?
                                                                <Select
                                                                    styles={customStylesWithOutColor}
                                                                    className="basic-single"
                                                                    classNamePrefix="select"
                                                                    name='AssociatedShiftID'
                                                                    defaultValue={value?.AssociatedShiftName}
                                                                    options={associatedShiftList}
                                                                    isClearable
                                                                    onChange={fieldPermisionAgency?.AssociatedShiftID[0] ?
                                                                        fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? AssociatedShiftChanges : fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? AssociatedShiftChanges : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? AssociatedShiftChanges : '' : AssociatedShiftChanges
                                                                    }
                                                                    isDisabled={fieldPermisionAgency?.AssociatedShiftID[0] ?
                                                                        fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? false : fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? false : true : false
                                                                    }
                                                                />
                                                                : <> */}
                                                        <Select
                                                            styles={customStylesWithOutColor}
                                                            value={associatedShiftList?.filter((obj) => obj.value === value?.AssociatedShiftID)}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='AssociatedShiftID'
                                                            options={associatedShiftList}
                                                            isClearable
                                                            onChange={fieldPermisionAgency?.AssociatedShiftID[0] ?
                                                                fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? AssociatedShiftChanges : fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? AssociatedShiftChanges : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? AssociatedShiftChanges : '' : AssociatedShiftChanges
                                                            }
                                                            isDisabled={fieldPermisionAgency?.AssociatedShiftID[0] ?
                                                                fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? false : fieldPermisionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? false : true : false
                                                            }
                                                        />
                                                        {/* </>
                                                        } */}
                                                        <label htmlFor="">Associated Shift</label>
                                                    </div>
                                                </div>
                                                {/* <div className="col-4 mt-2 ">
                                            <label className='mr-10' htmlFor="isAdmin">Allow Mobile Login</label>
                                            <input type="checkbox" checked={value.AllowMobileLogin} value={value.AllowMobileLogin} name="AllowMobileLogin" onChange={handleInput} id="isAdmin" />
                                        </div> */}
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* <div className="col">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                <>
                                                    <button type="button" onClick={check_Validation_Error} class="btn btn-sm btn-success mr-1" >Update</button>
                                                    <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => {
                                                        closeModalReset()
                                                    }}>Close</button>
                                                </>
                                                    :
                                                    <>
                                                    <button type="button" onClick={check_Validation_Error} class="btn btn-sm btn-success mr-1" >Save</button>
                                                    <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => {
                                                        reset_call_Close()
                                                    }}>Close</button>
                                                    </>

                                            }
                                            
                                        </div>
                                    </div> */}
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                    :
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                            }
                                            <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModalReset()}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

        </>
    )
}

export default memo(Unit_Add_Up);

export const changeArrayFormat = (data, type) => {
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        //  console.log(result);
        return result
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.DivisionCode })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        //  console.log(result);
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, dropDownData) => {
    if (type === 'shift') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        console.log(result[0]);
        return result[0]
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            (sponsor.DivisionId)
        )
        const result2 = dropDownData?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        console.log(val[0]);
        return val[0]
    }
}