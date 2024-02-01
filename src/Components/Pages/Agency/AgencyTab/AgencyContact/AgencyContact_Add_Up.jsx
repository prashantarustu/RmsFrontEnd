import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { Email_Field, PhoneField, PhoneFieldNotReq, RequiredField } from '../../AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const AgencyContactAddUpp = (props) => {

    const { get_CountList } = useContext(AgencyContext)

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const { aId, pinId, get_Agency_Contact_data, agencyContactEditData, relationUpdStatus, updateID, modal, setModal, agencyContactData, status, setStatus } = props
    // console.log("this is agency contact editdata", agencyContactData)
    const [updValue, setUpdValue] = useState({})

    const [value, setValue] = useState({
        'FirstName': '',
        'MiddleName': '',
        'LastName': '',
        'AgencyID': aId,
        'Phone1': '',
        'Phone2': '',
        'Fax': '',
        'Cell': '',
        'Email': '',
        'CreatedByUserFK': pinId,
        'AgencyEmergencyID': '',
    })

    useEffect(() => {
        if (agencyContactEditData?.AgencyEmergencyID) {
            setValue({
                'FirstName': agencyContactEditData?.FirstName,
                'MiddleName': agencyContactEditData?.MiddleName,
                'LastName': agencyContactEditData?.LastName,
                'AgencyID': agencyContactEditData?.AgencyID,
                'Phone1': agencyContactEditData?.Phone1,
                'Phone2': agencyContactEditData?.Phone2,
                'Fax': agencyContactEditData?.Fax,
                'Cell': agencyContactEditData?.Cell,
                'Email': agencyContactEditData?.Email,
                'CreatedByUserFK': agencyContactEditData?.CreatedByUserFK,
                'AgencyEmergencyID': agencyContactEditData?.AgencyEmergencyID,
            })
        } else {
            setValue({
                'FirstName': '',
                'MiddleName': '',
                'LastName': '',
                'AgencyID': '',
                'Phone1': '',
                'Phone2': '',
                'Fax': '',
                'Cell': '',
                'Email': '',
                'CreatedByUserFK': '',
                'AgencyEmergencyID': '',
            })
        }
    }, [agencyContactEditData, relationUpdStatus])


    // initialization Error Hooks
    const [errors, setErrors] = useState({
        'FirstNameError': '', 'LastNameError': '', 'Phone1Error': '', 'Phone2Error': '', 'CellError': '', 'FaxError': '', 'EmailError': ''
    })

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.FirstName)) {
            setErrors(prevValues => { return { ...prevValues, ['FirstNameError']: RequiredField(value.FirstName) } })
        }
        if (RequiredField(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
        }
        //  if (PhoneFieldNotReq(value.Phone1)) {
        //     setErrors(prevValues => { return { ...prevValues, ['Phone1Error']: PhoneFieldNotReq(value.Phone1) } })
        // } if (PhoneFieldNotReq(value.Phone2)) {
        //     setErrors(prevValues => { return { ...prevValues, ['Phone2Error']: PhoneFieldNotReq(value.Phone2) } })
        // } if (PhoneFieldNotReq(value.Cell)) {
        //     setErrors(prevValues => { return { ...prevValues, ['CellError']: PhoneFieldNotReq(value.Cell) } })
        // } if (Email_Field(value.Email)) {
        //     setErrors(prevValues => { return { ...prevValues, ['EmailError']: Email_Field(value.Email) } })
        // } if (PhoneFieldNotReq(value.Fax)) {
        //     setErrors(prevValues => { return { ...prevValues, ['FaxError']: PhoneFieldNotReq(value.Fax) } })
        // }
    }

    // Check All Field Format is True Then Submit 
    const { FirstNameError, LastNameError, } = errors

    useEffect(() => {
        if (FirstNameError === 'true' && LastNameError === 'true') {
            if (status) Update_Agency_Contact()
            else Add_Agency_contact()
        }
    }, [FirstNameError, LastNameError,])

    useEffect(() => {
        if (updateID) {
            get_AgencyCont_Single_Data(updateID)
        }
    }, [updateID])

    const reset = () => {
        setValue({
            'FirstName': '',
            'MiddleName': '',
            'LastName': '',
            'AgencyID': '',
            'Phone1': '',
            'Phone2': '',
            'Fax': '',
            'Cell': '',
            'Email': '',
            'CreatedByUserFK': '',
            'AgencyEmergencyID': '',
            'FirstNameError': '',
            'LastNameError': '',
        })
        setErrors({
            'FirstNameError': '',
            'LastNameError': '',
        })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'Phone1' || e.target.name === 'Phone2' || e.target.name === 'Cell' || e.target.name === 'Fax') {
            var ele = e.target.value.replace(/\D/g, '');
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
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
        // console.log("the value is ", value)
    }

    const Add_Agency_contact = (e) => {
        var result = agencyContactData?.find(item => {
            if (item.FirstName === value.FirstName) {
                return true
            } else return false
        }
        );
        var result1 = agencyContactData?.find(item => {
            if (item.LastName === value.LastName) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            const { FirstName, MiddleName, LastName, AgencyID, Phone1, Phone2, Fax, Cell, Email, CreatedByUserFK } = value;

            const val = {
                'FirstName': FirstName, 'MiddleName': MiddleName, 'LastName': LastName, 'AgencyID': aId, 'Phone1': Phone1, 'Phone2': Phone2,
                'Fax': Fax, 'Cell': Cell, 'Email': Email,
                'CreatedByUserFK': pinId,
            }
            // console.log("thi sis val",val)
            AddDeleteUpadate('AgencyEmergencyContact/InsertAgency_EmergencyContact', val).then((res) => {
                if (res) {
                    toastifySuccess(res.Message)
                    setErrors({ ...errors, ['LastNameError']: '' })
                    get_Agency_Contact_data(aId);
                    reset()
                    get_CountList(aId);
                    setModal(false)
                }
            })
        }
    }

    const get_AgencyCont_Single_Data = (updateID) => {
        const val = {
            AgencyEmergencyID: updateID
        }
        fetchPostData('AgencyEmergencyContact/GetSingleData_AgencyEmergencyContact', val)
            .then((res) => {
                if (res) setUpdValue(res)
            })
    }

    const Update_Agency_Contact = (e) => {

        var result = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.FirstName === value.FirstName) {
                    return true
                } else return false
            }
        }
        );
        var result1 = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.LastName === value.LastName) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            const { FirstName, MiddleName, LastName, AgencyID, Phone1, Phone2, Fax, Cell, Email, CreatedByUserFK } = value;
            // console.log("this is valueupdate", value)
            AddDeleteUpadate('AgencyEmergencyContact/UpdateAgency_EmergencyContact', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message);
                        get_Agency_Contact_data(aId);
                        reset()
                        setModal(false)
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const closeModal = () => {
        reset();
        setModal(false)
        // setRelationDescErr('');
        // setRelationTypeCodeErr('')
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="AgencyContact" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class=" modal-dialog modal-lg modal-dialog-centered " role="document">
                            <div class="modal-content">
                                <div class="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Agency Contact</legend>
                                            <div className="row " >
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" className='requiredColor' id="FirstName" name='FirstName' value={value.FirstName} onChange={handlChanges} required />
                                                        <label>First Name</label>
                                                        {errors.FirstNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id="MiddleName" name='MiddleName' value={value.MiddleName} onChange={handlChanges} required />
                                                        <label>Middle Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" className='requiredColor' id="LastName" name='LastName' value={value.LastName} onChange={handlChanges} required />
                                                        <label>Last Name</label>
                                                        {errors.LastNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">

                                                        <input type="text" maxLength={10} id="Phone1" name='Phone1' value={value.Phone1} onChange={handlChanges} required />
                                                        <label>Phone1</label>
                                                        {/* {errors.Phone1Error !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone1Error}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} id="Phone2" name='Phone2' value={value.Phone2} onChange={handlChanges} required />
                                                        <label>Phone2</label>
                                                        {/* {errors.Phone2Error !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone2Error}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} id="Fax" name='Fax' value={value.Fax} onChange={handlChanges} required />
                                                        <label>Fax</label>
                                                        {/* {errors.FaxError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FaxError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="Phone" maxLength={10} id="Cell" name='Cell' value={value.Cell} onChange={handlChanges} required />
                                                        <label>Cell</label>
                                                        {/* {errors.CellError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CellError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="Email" name='Email' value={value.Email} onChange={handlChanges} required />
                                                        <label>Email</label>
                                                        {/* {errors.EmailError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EmailError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                                                    :
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                            }
                                            <button type="button" class="btn btn-sm btn-success mr-1" data-dismiss="modal" onClick={() => closeModal()} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <> </>
            }
        </>
    )
}

export default AgencyContactAddUpp