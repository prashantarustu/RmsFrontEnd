import React, { useCallback, useState } from 'react'
import { useEffect } from 'react';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';

const PoliceForce_Add_Up = (props) => {

    const { ArrsetPoliceForceID, status, setStatus, modal, setModal, get_Data_PoliceForce, updateStatus, LoginPinID, ArrestID, LoginAgencyID, } = props

    const [HeadOfAgency, setHeadOfAgency] = useState([]);
    const [policeForceDrp, setPoliceForceDrp] = useState([])
    const [Editval, setEditval] = useState();

    const [value, setValue] = useState({
        'ArrestID': ArrestID,
        'ArrPoliceForceID': '',
        'OfficerID': '',
        'CreatedByUserFK': LoginPinID,
        'ModifiedByUserFK': '',
    })

    useEffect(() => {
        if (ArrestID) setValue(pre => { return { ...pre, 'ArrestID': ArrestID, 'CreatedByUserFK': LoginPinID, } })
    }, [ArrestID, updateStatus]);


    const [errors, setErrors] = useState({
        'ArrPoliceForceIDErrors': '',
        'OfficerIDErrors': '',
    })
    const reset = (e) => {
        setValue({
            ...value,
            'OfficerID': '', 'ArrPoliceForceID': '',

        });
        setErrors({
            'ArrPoliceForceIDErrors': '', 'OfficerIDErrors': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ArrPoliceForceID)) {
            setErrors(prevValues => { return { ...prevValues, ['ArrPoliceForceIDErrors']: RequiredFieldIncident(value.ArrPoliceForceID) } })
        }
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDErrors']: RequiredFieldIncident(value.OfficerID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ArrPoliceForceIDErrors, OfficerIDErrors } = errors
    useEffect(() => {
        if (ArrPoliceForceIDErrors === 'true' && OfficerIDErrors === 'true') {
            if (status) Update_PoliceForce()
            else Add_PoliceForce()
        }
    }, [ArrPoliceForceIDErrors, OfficerIDErrors])

    useEffect(() => {
        if (ArrsetPoliceForceID) {
            GetSingleData()
        }
    }, [ArrsetPoliceForceID, updateStatus])

    const GetSingleData = () => {
        const val = { 'ArrsetPoliceForceID': ArrsetPoliceForceID, }
        fetchPostData('ArrsetPoliceForce/GetSingleData_ArrsetPoliceForce', val)
            .then((res) => {
                // console.log(res)
                if (res) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            // console.log(Editval)
            setValue({
                ...value,
                'ArrsetPoliceForceID': ArrsetPoliceForceID,
                'ArrPoliceForceID': Editval[0]?.ArrPoliceForceID,
                'OfficerID': Editval[0]?.OfficerID,
                'ModifiedByUserFK': LoginPinID,
            })
        }
        else {
            setValue({
                ...value,
                'ArrPoliceForceID': '',
                'OfficerID': '',
            })
        }
    }, [Editval])

    useEffect(() => {
        get_Head_Of_Agency(LoginAgencyID); get_Polic_Force(LoginAgencyID);
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

    const get_Polic_Force = () => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('PoliceForce/GetDataDropDown_PoliceForce', val).then((data) => {
            if (data) {
                setPoliceForceDrp(Comman_changeArrayFormat(data, 'PoliceForceID', 'Description'));
            }
            else {
                setPoliceForceDrp([])
            }
        })
    };

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const Add_PoliceForce = () => {
        AddDeleteUpadate('ArrsetPoliceForce/Insert_ArrsetPoliceForce', value).then((res) => {
            get_Data_PoliceForce(ArrestID);
            setModal(false);
            setStatus(false)
            reset()
            toastifySuccess(res.Message)
        })
    }

    const Update_PoliceForce = () => {
        AddDeleteUpadate('ArrsetPoliceForce/Update_ArrsetPoliceForce', value).then((res) => {
            get_Data_PoliceForce(ArrestID);
            setModal(false);
            setStatus(false)
            toastifySuccess(res.Message)
            reset();
        })
    }
    const closeModal = () => {
        reset();
        setModal(false);
    }
    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);
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

    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PoliceForceModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 ">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Police Force</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-12 col-md-6  col-lg-6  dropdown__box">
                                                                <Select
                                                                    name='OfficerID'
                                                                    value={HeadOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                    options={HeadOfAgency}
                                                                    styles={colourStyles}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    onChange={(e) => { ChangeDropDown(e, 'OfficerID') }}
                                                                />
                                                                <label htmlFor='' >Officer</label>
                                                                {errors.OfficerIDErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDErrors}</span>
                                                                ) : null}
                                                            </div>
                                                            <div class="col-12 col-md-6 mb-1 col-lg-6  dropdown__box">
                                                                <Select
                                                                    name='ArrPoliceForceID'
                                                                    value={policeForceDrp?.filter((obj) => obj.value === value?.ArrPoliceForceID)}
                                                                    styles={colourStyles}
                                                                    options={policeForceDrp}
                                                                    isClearable
                                                                    onChange={(e) => { ChangeDropDown(e, 'ArrPoliceForceID') }}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' >Description</label>
                                                                {errors.ArrPoliceForceIDErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrPoliceForceIDErrors}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        {
                                            status ?
                                                <>
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => check_Validation_Error()}>Update</button>
                                                </>
                                                :
                                                <>
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => check_Validation_Error()}>Save</button>
                                                </>
                                        }
                                        <button type="button" data-dismiss="modal" onClick={() => { closeModal(); }} class="btn btn-sm btn-success mr-1">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </>
    )
}

export default PoliceForce_Add_Up