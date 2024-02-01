import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
// import { Select } from 'semantic-ui-react'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'



const Resident_Add_Up = (props) => {

    const {  ResidentID, status, get_data_Resident, ResidentData, modal, setModal, ResidentupdStatus  } = props

    const [agencyData, setAgencyData] = useState([])
    const [ResidentEditval, setResidentEditval] = useState();
    const [value, setValue] = useState({
        'ResidentCode': '', 'AgencyCode':'','Description': '', 'AgencyID:': '', 'Iseditable': '0', 'ResidentID:': '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': '', 'IsArrest': '', 'IsVictim': '', 'AgencyName': '', 'MultiAgency_Name': '','ArrestResidentCode':'','IsActive':'',
    });

    const reset = () => {
        setModal(false);
        setValue({
            ...value,
            'ResidentCode': '',
            'Description': '',
            'AgencyID:': '',
            'Iseditable': '',
            'ResidentID:': '',
            'Iseditable': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'IsArrest': '',
            'IsVictim': '',
            'AgencyName':'',
            'MultiAgency_Name':'',
            'ArrestResidentCode':'',
            'IsActive':'',
            'AgencyCode':'',

        })
        setErrors({
            'ResidentCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ResidentCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (ResidentID) {
            GetSingleData_Color()
        }
    }, [ResidentID, ResidentupdStatus])

    const GetSingleData_Color = () => {
        const val = { 'ResidentID': ResidentID }
        fetchPostData('Resident/GetSingleData_Resident', val)
            .then((res) => {
                if (res) setResidentEditval(res)
                else setResidentEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'AgencyID': ResidentEditval[0]?.AgencyID,
                'AgencyCode':ResidentEditval[0]?.AgencyCode,
                'IsActive':ResidentEditval[0]?.IsActive,
                "ResidentCode": ResidentEditval[0]?.ResidentCode,
                "Description": ResidentEditval[0]?.Description,
                'ResidentID': ResidentEditval[0]?.ResidentID,
                'IsArrest': ResidentEditval[0]?.IsArrest,
                'IsVictim': ResidentEditval[0]?.IsVictim,
                'ArrestResidentCode':ResidentEditval[0]?.ArrestResidentCode,
                 'MultiAgency_Name': ResidentEditval[0]?.MultiAgency_Name,
                 'AgencyName': ResidentEditval[0]?.MultipleAgency? changeArrayFormat_WithFilter(ResidentEditval[0]?.MultipleAgency
                ) : '',
                 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                  'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "ResidentCode": '', 'AgencyCode':'',"Description": '', 'ResidentID': '', 'IsArrest': '', 'IsVictim': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name':''
            })
        }
    }, [ResidentEditval])

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
        if (e.target.name === 'IsVictim' || e.target.name === 'IsArrest') {
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
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
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

    const Add_Relation = (e) => {
        var result = ResidentData?.find(item => {
            if (item.ResidentCode === value.ResidentCode) {
                return true
            } else return false
        }
        );
        var result1 = ResidentData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['ResidentCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('Resident/InsertResident', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ColorError']: '' })
                setModal(false)
                get_data_Resident();
                reset();
            })

        }
    }

    const update_Relation_Type = () => {
        var result = ResidentData?.find(item => {
            if (item.ResidentID != ResidentID) {
                if (item.ResidentCode === value.ResidentCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = ResidentData?.find(item => {
            if (item.ResidentID != ResidentID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['ResidentCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('Resident/UpdateResident', value).then((res) => {
                toastifySuccess(res.Message);
                get_data_Resident();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ResidentCode)) {
            setErrors(prevValues => { return { ...prevValues, ['ResidentCodeError']: RequiredField(value.ResidentCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, ResidentCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && ResidentCodeError === 'true') {
            if (status) update_Relation_Type()
            else Add_Relation()
        }
    }, [DescriptionError, ResidentCodeError])

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ResidentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Resident</legend>

                                            <div className="row ">
                                                    {/* <div class="text-field col-12 col-md-2 col-lg-2 mt-2">
                                                        <input type="text" name='ResidentCode' onChange={handlChanges} value={value.ResidentCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ResidentCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ResidentCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                    <div class="text-field col-4">
                                                        <input type="text" name='ArrestResidentCode' onChange={handlChanges} value={value.ArrestResidentCode} className='requiredColor' />
                                                        <label>Arrest Code</label>
                                                    </div>
                                                    <div className="col-4 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text"  name='AgencyCode' onChange={handlChanges} value={value.AgencyCode}  />
                                                        <label>Agency Code</label>
                                                    </div> */}
                                                    <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='ResidentCode' onChange={handlChanges} value={value.ResidentCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ResidentCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ResidentCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text"  name='AgencyCode' onChange={handlChanges} value={value.AgencyCode}  />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='ArrestResidentCode' onChange={handlChanges} value={value.ArrestResidentCode} className='requiredColor' />
                                                        <label>Arrest Code</label>
                                                       
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                                {/* </div> */}
                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row pt-2">
                                                        <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                            {
                                                                value?.AgencyName ?
                                                                    <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        defaultValue={value?.AgencyName}
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    /> : <><Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    />
                                                                    </>
                                                            }
                                                            <label>Agency</label>
                                                        </div>
                                                        {/* <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsArrest" checked={value.IsArrest} value={value.IsArrest}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsArrest" />
                                                            <label className='ml-2' htmlFor="IsArrest">IsArrest</label>
                                                        </div>
                                                        <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsVictim" checked={value.IsVictim} value={value.IsVictim}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsVictim" />
                                                            <label className='ml-2' htmlFor="IsVictim">IsVictim</label>
                                                        </div> */}

                                                    </div>
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
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => reset()}>Close</button>
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

export default Resident_Add_Up;

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