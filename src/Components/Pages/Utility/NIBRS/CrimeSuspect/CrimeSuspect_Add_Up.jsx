import React from 'react'
import { useState,useCallback } from 'react'  
import { useEffect } from 'react'  
import Select from 'react-select'  
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

  
  
const CrimeSusp_Add_Up = (props) => {

    const { SuspectID, status, get_data_CrimeSuspect, CrimeSuspectData, modal, setModal, updStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [CrimeSusEditval, setCrimeSusEditval] = useState();
    const [value, setValue] = useState({
        'SuspectCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'SuspectID': '',
        'IsActive':'',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':'',
    });


    const reset = () => {
        setValue({
            ...value,
            'SuspectCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'SuspectID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'SuspectCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'SuspectCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (SuspectID) {
            GetSingleDataBias()
        }
    }, [SuspectID, updStatus])

    const GetSingleDataBias = () => {
        const val = { 'SuspectID': SuspectID }
        fetchPostData('CrimeSuspect/GetSingleData_CrimeSuspect', val)
            .then((res) => {

                if (res) setCrimeSusEditval(res)
                else setCrimeSusEditval()  
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "SuspectCode": CrimeSusEditval[0]?.SuspectCode,
                'AgencyID': CrimeSusEditval[0]?.AgencyID,
                "Description": CrimeSusEditval[0]?.Description,
                'AgencyCode': CrimeSusEditval[0]?.AgencyCode,
                'SuspectID': CrimeSusEditval[0]?.SuspectID,
                'Iseditable':CrimeSusEditval[0]?.Iseditable,
                'IsActive':CrimeSusEditval[0]?.IsActive,
                'MultiAgency_Name': CrimeSusEditval[0]?.MultiAgency_Name,
                'AgencyName': CrimeSusEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CrimeSusEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "SuspectCode": '','AgencyCode':'', "Description": '', 'SuspectID': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': ''
            })
        }
    }, [CrimeSusEditval])

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

    const Add_CrimeSuspect = (e) => {
        var result = CrimeSuspectData?.find(item => {
            if (item.SuspectCode === value.SuspectCode) {
                return true
            } else return false
        }  
        );
        var result1 = CrimeSuspectData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['SuspectCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeSuspect/InsertCrimeSuspect', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['SuspectCodeError']: '' })
                setModal(false)
                get_data_CrimeSuspect();
                reset();
            })

        }
    }

    const Add_Update_CrimeSus = () => {
        var result = CrimeSuspectData?.find(item => {
            if (item.SuspectID != SuspectID) {
                if (item.SuspectCode === value.SuspectCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CrimeSuspectData?.find(item => {
            if (item.SuspectID != value.SuspectID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['SuspectCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeSuspect/UpdateCrimeSuspect', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['SuspectCodeError']: '' })
                get_data_CrimeSuspect();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.SuspectCode)) {
            // console.log(value.SuspectCode);
            // console.log(RequiredField(value.SuspectCode));
            setErrors(prevValues => { return { ...prevValues, ['SuspectCodeError']: RequiredField(value.SuspectCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, SuspectCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && SuspectCodeError === 'true') {
            if (status) Add_Update_CrimeSus()
            else Add_CrimeSuspect()
        }
    }, [DescriptionError, SuspectCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CrimeSusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Crime Suspect</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='SuspectCode' onChange={handlChanges} value={value.SuspectCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.SuspectCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SuspectCodeError}</span>
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

export default CrimeSusp_Add_Up;


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