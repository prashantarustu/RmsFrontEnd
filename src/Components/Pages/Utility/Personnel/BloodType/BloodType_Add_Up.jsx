import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';
  

const BloodType_Add_Up = (props) => {

    const { BloodTypeID, status, get_data_Blood_Type, BloodTypeData, modal, setModal, BloodTypeupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [BloodTypeEditval, setBloodTypeEditval] = useState();
    //  console.log("thi si editval",BloodTypeEditval)
    const [value, setValue] = useState({
        'BloodTypeCode': '',
        'BloodtypeDescription': '',
        'AgencyId:': '',
        'Iseditable': '0',
        'BloodTypeID:': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'DeletedByUserFK': '', 'MultiAgency_Name':'','AgencyCode':'',
        'AgencyName': ''

    });

    const reset = () => {
        setValue({
            ...value,
            'BloodTypeCode': '',
            'BloodtypeDescription': '',
            'BloodTypeID': '',
            'IsActive': '',
            'ModifiedByUserFK': '',
            'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name':'','AgencyCode':'',
        })
        setErrors({
            'BloodtypecodeError': '',
            'BloodtypedescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'BloodtypecodeError': '',
        'BloodtypedescriptionError': '',
    })

    useEffect(() => {
        if (BloodTypeID) {
            GetSingleData_Gender()
        }
    }, [BloodTypeID, BloodTypeupdStatus])

    const GetSingleData_Gender = () => {
        const val = { 'BloodTypeID': BloodTypeID }
        fetchPostData('TableManagement/GetSingleData_BloodType', val)
            .then((res) => {
                if (res) setBloodTypeEditval(res)
                else setBloodTypeEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "BloodTypeCode": BloodTypeEditval[0]?.BloodTypeCode,
                "BloodtypeDescription": BloodTypeEditval[0]?.BloodtypeDescription,
                "AgencyCode": BloodTypeEditval[0]?.AgencyCode,
                'BloodTypeID': BloodTypeEditval[0]?.BloodTypeID, 'MultiAgency_Name':BloodTypeEditval[0]?.MultiAgency_Name,
                'AgencyId': BloodTypeEditval[0]?.AgencyID, 'ModifiedByUserFK':Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'AgencyName': BloodTypeEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(BloodTypeEditval[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
        }
        else {
            setValue({
                ...value,
                "BloodTypeCode": '',
                "BloodtypeDescription": '',
                'BloodTypeID': '',
                'AgencyId:': '', 'AgencyName': '', 'MultiAgency_Name':'', 'ModifiedByUserFK':''
            })
        }
    }, [BloodTypeEditval])

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




    useEffect(() => {
        if(modal) getAgency();
    }, [modal])

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
        // console.log("this is value",value)
    }

    const Agencychange = (e) => {
        var id = []
        var name = []
        if (e) {
            e.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyId']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
        // console.log("this is value",value)
    }

    const getAgency = async () => {
        const value = {
            AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
            PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }


    const Add_Blood_Type = (e) => {
        var result = BloodTypeData?.find(item => {
            if (item.BloodTypeCode === value.BloodTypeCode) {
                return true
            } else return false
        }
        );
        var result1 = BloodTypeData?.find(item => {
            if (item.BloodtypeDescription === value.BloodtypeDescription) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['BloodtypecodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['BloodtypedescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/Insert_BloodType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['BloodTypeError']: '' })
                setModal(false)
                get_data_Blood_Type();
                reset();
                //   console.log("this is addResponse",res)
            })
        }
    }

    const update_Blood_Type = () => {
        var result = BloodTypeData?.find(item => {
            if (item.BloodTypeID != BloodTypeID) {
                if (item.BloodTypeCode === value.BloodTypeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = BloodTypeData?.find(item => {
            if (item.BloodTypeID != BloodTypeID) {
                if (item.BloodtypeDescription === value.BloodtypeDescription) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Gender Code Already Exists')
                setErrors({ ...errors, ['BloodtypecodeError']: '' })
            }   
            if (result1) {   
                toastifyError('Bloodtypedescription Already Exists')
                setErrors({ ...errors, ['BloodtypedescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/Update_BloodType', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['BloodtypedescriptionError']: '' })
                get_data_Blood_Type();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.BloodTypeCode)) {
            console.log(value.BloodTypeCode);
            console.log(RequiredField(value.BloodTypeCode));
            setErrors(prevValues => { return { ...prevValues, ['BloodtypecodeError']: RequiredField(value.BloodTypeCode) } })
        }
        if (RequiredField(value.BloodtypeDescription)) {
            setErrors(prevValues => { return { ...prevValues, ['BloodtypedescriptionError']: RequiredField(value.BloodtypeDescription) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { BloodtypedescriptionError, BloodtypecodeError } = errors

    useEffect(() => {
        if (BloodtypedescriptionError === 'true' && BloodtypecodeError === 'true') {
            if (status) update_Blood_Type()
            else Add_Blood_Type()
        }
    }, [BloodtypedescriptionError, BloodtypecodeError])

    const closeModal = () => {
        reset();
        setModal(false);
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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BloodTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Blood Type</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='BloodTypeCode' maxLength={10} onChange={handlChanges} value={value.BloodTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.BloodtypecodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BloodtypecodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text"  name='AgencyCode' onChange={handlChanges} value={value.AgencyCode}  />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' name='BloodtypeDescription' onChange={handlChanges} value={value.BloodtypeDescription} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.BloodtypedescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BloodtypedescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div> 
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                {
                                                        value?.AgencyName ?
                                                            <Select
                                                                isMulti
                                                                name='Agencyid'
                                                                isClearable
                                                                defaultValue={value.AgencyName}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            /> : <><Select
                                                                isMulti
                                                                name='Agencyid'
                                                                isClearable
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            />
                                                            </>
                                                    }
                                                    <label>Agency</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Save</button>
                                        }
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModal()}>Close</button>
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

export default BloodType_Add_Up;

export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}