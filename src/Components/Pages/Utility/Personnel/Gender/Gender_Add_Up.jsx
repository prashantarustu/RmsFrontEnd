import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
// import { Select } from 'semantic-ui-react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';


const Gender_Add_Up = (props) => {

    const { SexCodeID, status, get_data_Gender, genderData, modal, setModal, GenderupdStatus } = props
    const [agencyData, setAgencyData] = useState([])

    const [value, setValue] = useState({
        'SexCode': '',
        'Description': '',
        'SexCodeID': '',
        'IsActive': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'DeletedByUserFK': '',
        'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '','AgencyCode':''
    });
    const [genderEditval, setGenderEditval] = useState();

    const reset = () => {
        setValue({
            ...value,
            'SexCode': '',
            'Description': '',
            'SexCodeID': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '','AgencyCode':'',
        })
        setErrors({
            'SexCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'SexCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (SexCodeID) {
            GetSingleData_Gender()
        }
    }, [SexCodeID, GenderupdStatus])

    const GetSingleData_Gender = () => {
        const val = { 'SexCodeID': SexCodeID }
        fetchPostData('TableManagement/GetSingleData_SexType', val)
            .then((res) => {
                if (res) setGenderEditval(res)
                else setGenderEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "SexCode": genderEditval[0]?.SexCode,
                'AgencyCode':genderEditval[0]?.AgencyCode,
                "Description": genderEditval[0]?.Description,
                'SexCodeID': genderEditval[0]?.SexCodeID, 'MultiAgency_Name': genderEditval[0]?.MultiAgency_Name,
                'AgencyId': genderEditval[0]?.AgencyID, 'AgencyName': genderEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(genderEditval[0]?.MultipleAgency) : '', 'IsActive': genderEditval[0]?.IsActive,
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
        }
        else {
            setValue({
                ...value,
                "SexCode": '',
                "Description": '',
                'SexCodeID': '', 'IsActive': '', 'ModifiedByUserFK':'',
                'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '','AgencyCode':'',
            })
        }
    }, [genderEditval])

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
    }

    useEffect(() => {
        if(modal) getAgency();
    }, [modal])

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

    const Add_gender = (e) => {
        var result = genderData?.find(item => {
            if (item.SexCode === value.SexCode) {
                return true
            } else return false
        }
        );
        var result1 = genderData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['SexCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }

        } else {
            AddDeleteUpadate('TableManagement/InsertSexType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['GenderError']: '' })
                setModal(false)
                get_data_Gender();
                reset();
                //   console.log("this is addResponse",res)
            })

        }
    }

    const update_Gender = () => {
        var result = genderData?.find(item => {
            if (item.SexCodeID != value.SexCodeID) {
                if (item.SexCode === value.SexCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = genderData?.find(item => {
            if (item.SexCodeID != value.SexCodeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Gender Code Already Exists')
                setErrors({ ...errors, ['SexCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/UpdateSexType', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_Gender();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.SexCode)) {
            console.log(value.SexCode);
            console.log(RequiredField(value.SexCode));
            setErrors(prevValues => { return { ...prevValues, ['SexCodeError']: RequiredField(value.SexCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, SexCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && SexCodeError === 'true') {
            if (status) update_Gender()
            else Add_gender()
        }
    }, [DescriptionError, SexCodeError])


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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="GenderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Gender</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='SexCode' maxLength={10} onChange={handlChanges} value={value.SexCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.SexCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SexCodeError}</span>
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
                                                        <textarea className='requiredColor' name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
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
                                                                defaultValue={value?.AgencyName}
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

export default Gender_Add_Up


export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}