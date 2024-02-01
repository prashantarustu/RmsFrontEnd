import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'
    

   
const CrimeBias_Add_Up = (props) => {

    const { BiasID, status, get_data_CrimeBias, CrimeBiasData, modal, setModal, CrimeBiasupdStatus } = props
    // const { BiasID, status, get_data_CrimeBias, CrimeBiasData, modal, setModal, CrimeBiasupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [CrimeBiasEditval, setCrimeBiasEditval] = useState();
    const [value, setValue] = useState({
        'BiasCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'BiasID': '',
        'IsActive': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':'',
    });


    const reset = () => {
        setValue({
            ...value,
            'BiasCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'BiasID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',

        })
        setErrors({
            'BiasCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'BiasCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (BiasID) {
            GetSingleDataBias()
        }
    }, [BiasID, CrimeBiasupdStatus])

    const GetSingleDataBias = () => {
        const val = { 'BiasID': BiasID }
        fetchPostData('CrimeBias/GetSingleData_CrimeBias', val)
            .then((res) => {


                if (res) setCrimeBiasEditval(res)
                else setCrimeBiasEditval()
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "BiasCode": CrimeBiasEditval[0]?.BiasCode,
                'AgencyID': CrimeBiasEditval[0]?.AgencyID,
                'AgencyCode': CrimeBiasEditval[0]?.AgencyCode,
                "Description": CrimeBiasEditval[0]?.Description,
                'BiasID': CrimeBiasEditval[0]?.BiasID,
                'Iseditable': CrimeBiasEditval[0]?.Iseditable,
                'IsActive': CrimeBiasEditval[0]?.IsActive,
                'MultiAgency_Name': CrimeBiasEditval[0]?.MultiAgency_Name,
                'AgencyName': CrimeBiasEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CrimeBiasEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "BiasCode": '',
                "Description": '',
                'BiasID': '',
                'AgencyName': '',
                'ModifiedByUserFK': '',
                'MultiAgency_Name': ''

                // "ContactTypeCode": '',
                // "Description": '', 
                // 'AgencyID': '', 
                // 'ModifiedByUserFK':'',
                // 'MultiAgency_Name': ''
            })
        }
    }, [CrimeBiasEditval])

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

    const Add_CrimeBias = (e) => {
        var result = CrimeBiasData?.find(item => {
            if (item.BiasCode === value.BiasCode) {
                return true
            } else return false
        }
        );
        var result1 = CrimeBiasData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['BiasCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CrimeBias/InsertCrimeBias', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['BiasCodeError']: '' })
                setModal(false)
                get_data_CrimeBias();
                reset();
            })

        }
    }

    const Update_CrimeBias = () => {
        var result = CrimeBiasData?.find(item => {
            if (item.BiasID != BiasID) {
                if (item.BiasCode === value.BiasCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CrimeBiasData?.find(item => {
            if (item.BiasID != value.BiasID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['BiasCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CrimeBias/UpdateCrimeBias', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['BiasCodeError']: '' })
                get_data_CrimeBias();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.BiasCode)) {
            // console.log(value.BiasCode);
            // console.log(RequiredField(value.BiasCode));
            setErrors(prevValues => { return { ...prevValues, ['BiasCodeError']: RequiredField(value.BiasCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, BiasCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && BiasCodeError === 'true') {
            if (status) Update_CrimeBias()
            else Add_CrimeBias()
        }
    }, [DescriptionError, BiasCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CrimeBiasModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Bias Motivation</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='BiasCode' onChange={handlChanges} value={value.BiasCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.BiasCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BiasCodeError}</span>
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

export default CrimeBias_Add_Up;


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