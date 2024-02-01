import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

  

const Offender_Add_Up = (props) => {

    // const { OffenderUseID, status, get_data_Offender_Use, OffenderUseData, modal, setModal, OffenderupdStatus } = props
    const {OffenderUseID, status, get_data_Offender_Use, OffenderUseData, modal, setModal, OffenderupdStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [OffenderUseEditval, setOffenderUseEditval] = useState();
    //  console.log("thi si editval",OffenderUseEditval)
    const [value, setValue] = useState({
        'OffenderUseCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'OffenderUseID': '',
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
            'OffenderUseCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'OffenderUseID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'OffenderUseCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'OffenderUseCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (OffenderUseID) {
            SingleDataOffenderUse()
        }
    }, [OffenderUseID, OffenderupdStatus])

    const SingleDataOffenderUse = () => {
        const val = { 'OffenderUseID': OffenderUseID }
        fetchPostData('CrimeOffenderUse/GetSingleData_CrimeOffenderUse', val)
            .then((res) => {
                if (res) setOffenderUseEditval(res)
                else setOffenderUseEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "OffenderUseCode": OffenderUseEditval[0]?.OffenderUseCode,
                'AgencyID': OffenderUseEditval[0]?.AgencyID,
                'AgencyCode':OffenderUseEditval[0]?.AgencyCode,
                "Description": OffenderUseEditval[0]?.Description,
                'OffenderUseID': OffenderUseEditval[0]?.OffenderUseID,
                'Iseditable':OffenderUseEditval[0]?.Iseditable,
                'IsActive':OffenderUseEditval[0]?.IsActive,
                'MultiAgency_Name': OffenderUseEditval[0]?.MultiAgency_Name,
                'AgencyName': OffenderUseEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(OffenderUseEditval[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "OffenderUseCode": '','AgencyCode':'', "Description": '', 'OffenderUseID': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': ''
            })
        }
    }, [OffenderUseEditval])

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
            // console.log(e);
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


    const Add_Offender = (e) => {
        var result = OffenderUseData?.find(item => {
            if (item.OffenderUseCode === value.OffenderUseCode) {
                return true
            } else return false
        }
        );
        var result1 = OffenderUseData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['OffenderUseCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeOffenderUse/InsertCrimeOffenderUse', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['OffenderUseCodeError']: '' })
                setModal(false)
                get_data_Offender_Use();
                reset();
            })

        }
    }

    const Update_CrimeBias = () => {
        var result = OffenderUseData?.find(item => {
            if (item.OffenderUseID != OffenderUseID) {
                if (item.OffenderUseCode === value.OffenderUseCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = OffenderUseData?.find(item => {
            if (item.OffenderUseID != value.OffenderUseID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['OffenderUseCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeOffenderUse/UpdateCrimeOffenderUse', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['OffenderUseCodeError']: '' })
                get_data_Offender_Use();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.OffenderUseCode)) {
            // console.log(value.OffenderUseCode);
            // console.log(RequiredField(value.OffenderUseCode));
            setErrors(prevValues => { return { ...prevValues, ['OffenderUseCodeError']: RequiredField(value.OffenderUseCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, OffenderUseCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && OffenderUseCodeError === 'true') {
            if (status) Update_CrimeBias()
            else Add_Offender()
        }
    }, [DescriptionError, OffenderUseCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="OffenderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Offender Suspected of Using</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='OffenderUseCode' onChange={handlChanges} value={value.OffenderUseCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.OffenderUseCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OffenderUseCodeError}</span>
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

export default Offender_Add_Up;


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