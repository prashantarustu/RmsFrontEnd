import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

   
const CrimeLeftScene_Add_Up = (props) => {

    const { LeftSceneId, status, get_data_PropertyDescription, PropertyDescriptionData, modal, setModal, PropertyDescriptionStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [PropertyDescriptionEditVal, setPropertyDescriptionEditVal] = useState();

    const [value, setValue] = useState({
        'LeftSceneCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'LeftSceneId': '',
        'IsActive':'1',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':'',
    });


    const reset = () => {
        setValue({
            ...value,
            'LeftSceneCode': '',
            'Description': '',
            'AgencyID': '',
            'LeftSceneId': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',

        })
        setErrors({
            'LeftSceneCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'LeftSceneCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (LeftSceneId) {
            GetSingledataPropertyDescription()
        }
    }, [LeftSceneId, PropertyDescriptionStatus])
    // GetSingledataPropertyDescription

    const GetSingledataPropertyDescription = () => {
        const val = { 'LeftSceneId': LeftSceneId }
        fetchPostData('CrimeLeftScene/GetSingleData_CrimeLeftScene', val)
            .then((res) => {
                if (res) setPropertyDescriptionEditVal(res)
                else setPropertyDescriptionEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "LeftSceneCode": PropertyDescriptionEditVal[0]?.LeftSceneCode,
                // "DeletedByUserFK": PropertyDescriptionEditVal[0]?.DeletedByUserFK,
                'AgencyID': PropertyDescriptionEditVal[0]?.AgencyID,
                'AgencyCode':PropertyDescriptionEditVal[0]?.AgencyCode,
                "Description": PropertyDescriptionEditVal[0]?.Description,
                'LeftSceneId': PropertyDescriptionEditVal[0]?.LeftSceneId,
                'IsActive': PropertyDescriptionEditVal[0]?.IsActive,
                'MultiAgency_Name': PropertyDescriptionEditVal[0]?.MultiAgency_Name,
                'AgencyName': PropertyDescriptionEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(PropertyDescriptionEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 
                "LeftSceneCode": '',
                 "Description": '', 
                 'AgencyID': '', 
                 'ModifiedByUserFK':'',
                 'MultiAgency_Name': ''
            })
        }
    }, [PropertyDescriptionEditVal])

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

    const Add_PropertyDescription = (e) => {
        var result = PropertyDescriptionData?.find(item => {
            if (item.LeftSceneCode === value.LeftSceneCode) {
                return true
            } else return false
        }
        );
        var result1 = PropertyDescriptionData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['LeftSceneCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
          
            AddDeleteUpadate('CrimeLeftScene/InsertCrimeLeftScene', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LeftSceneCodeError']: '' })
                setModal(false)
                get_data_PropertyDescription();
                reset();
             
            })

        }
    }

    const Update_PropertyDescription = () => {
        var result = PropertyDescriptionData?.find(item => {
            if (item.LeftSceneId != LeftSceneId) {
                if (item.LeftSceneCode === value.LeftSceneCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = PropertyDescriptionData?.find(item => {
            if (item.LeftSceneId != value.LeftSceneId) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['LeftSceneCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
           
            AddDeleteUpadate('CrimeLeftScene/UpdateCrimeLeftScene', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LeftSceneCodeError']: '' })
                get_data_PropertyDescription();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.LeftSceneCode)) {
            // console.log(value.LeftSceneCode);
            // console.log(RequiredField(value.LeftSceneCode));
            setErrors(prevValues => { return { ...prevValues, ['LeftSceneCodeError']: RequiredField(value.LeftSceneCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, LeftSceneCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && LeftSceneCodeError === 'true') {
            if (status) Update_PropertyDescription()
            else Add_PropertyDescription()
        }
    }, [DescriptionError, LeftSceneCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CrimeLeftScene" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Crime Left Scene</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='LeftSceneCode' maxLength={10} onChange={handlChanges} value={value.LeftSceneCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.LeftSceneCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LeftSceneCodeError}</span>
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

export default CrimeLeftScene_Add_Up


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