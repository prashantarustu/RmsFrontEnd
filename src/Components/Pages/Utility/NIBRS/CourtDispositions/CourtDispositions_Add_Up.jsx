import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'



const CourtDispositions_Add_Up = (props) => {

    const { CourtDispositionID, status, get_data_CourtDispositions, CourtDispositionsData, modal, setModal, CourtDispositionsupdStatus } = props
    // const { CourtDispositionID, status, get_data_CourtDispositions, CourtDispositionsData, modal, setModal, CourtDispositionsupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [CourtDispositionsEditval, setCourtDispositionsEditval] = useState();
    const [value, setValue] = useState({
        'CourtDispositionCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'CourtDispositionID': '',
        'IsActive': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode': '',
    });


    const reset = () => {
        setValue({
            ...value,
            'CourtDispositionCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'CourtDispositionID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode': '',

        })
        setErrors({
            'CourtDispositionCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CourtDispositionCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (CourtDispositionID) {
            GetSingleDataBias()
        }
    }, [CourtDispositionID, CourtDispositionsupdStatus])

    const GetSingleDataBias = () => {
        const val = { 'CourtDispositionID': CourtDispositionID }
        fetchPostData('CourtDispositions/GetSingleData_CourtDispositions', val)
            .then((res) => {


                if (res) setCourtDispositionsEditval(res)
                else setCourtDispositionsEditval()
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "CourtDispositionCode": CourtDispositionsEditval[0]?.CourtDispositionCode,
                'AgencyID': CourtDispositionsEditval[0]?.AgencyID,
                'AgencyCode': CourtDispositionsEditval[0]?.AgencyCode,
                "Description": CourtDispositionsEditval[0]?.Description,
                'CourtDispositionID': CourtDispositionsEditval[0]?.CourtDispositionID,
                'Iseditable': CourtDispositionsEditval[0]?.Iseditable,
                'IsActive': CourtDispositionsEditval[0]?.IsActive,
                'MultiAgency_Name': CourtDispositionsEditval[0]?.MultiAgency_Name,
                'AgencyName': CourtDispositionsEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CourtDispositionsEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "CourtDispositionCode": '',
                "Description": '',
                'CourtDispositionID': '',
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
    }, [CourtDispositionsEditval])

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
        if (modal) getAgency();
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

    const Add_CourtDispositions = (e) => {
        var result = CourtDispositionsData?.find(item => {
            if (item.CourtDispositionCode === value.CourtDispositionCode) {
                return true
            } else return false
        }
        );
        var result1 = CourtDispositionsData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtDispositionCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CourtDispositions/InsertCourtDispositions', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtDispositionCodeError']: '' })
                setModal(false)
                get_data_CourtDispositions();
                reset();
            })

        }
    }

    const Update_CourtDispositions = () => {
        var result = CourtDispositionsData?.find(item => {
            if (item.CourtDispositionID != CourtDispositionID) {
                if (item.CourtDispositionCode === value.CourtDispositionCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CourtDispositionsData?.find(item => {
            if (item.CourtDispositionID != value.CourtDispositionID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtDispositionCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CourtDispositions/UpdateCourtDispositions', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtDispositionCodeError']: '' })
                get_data_CourtDispositions();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.CourtDispositionCode)) {
            // console.log(value.CourtDispositionCode);
            // console.log(RequiredField(value.CourtDispositionCode));
            setErrors(prevValues => { return { ...prevValues, ['CourtDispositionCodeError']: RequiredField(value.CourtDispositionCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CourtDispositionCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CourtDispositionCodeError === 'true') {
            if (status) Update_CourtDispositions()
            else Add_CourtDispositions()
        }
    }, [DescriptionError, CourtDispositionCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CourtDispositionsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Court Dispositions</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='CourtDispositionCode' onChange={handlChanges} value={value.CourtDispositionCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CourtDispositionCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDispositionCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
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

export default CourtDispositions_Add_Up;


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