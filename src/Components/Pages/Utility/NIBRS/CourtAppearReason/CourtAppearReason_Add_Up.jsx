import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'



const CourtAppearReason_Add_Up = (props) => {

    const { CourtAppearReasonID, status, get_data_CourtAppearReason, CourtAppearReasonData, modal, setModal, CourtAppearReasonupdStatus } = props
    // const { CourtAppearReasonID, status, get_data_CourtAppearReason, CourtAppearReasonData, modal, setModal, CourtAppearReasonupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [CourtAppearReasonEditval, setCourtAppearReasonEditval] = useState();
    const [value, setValue] = useState({
        'CourtAppearReasonCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'CourtAppearReasonID': '',
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
            'CourtAppearReasonCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'CourtAppearReasonID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode': '',

        })
        setErrors({
            'CourtAppearReasonCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CourtAppearReasonCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (CourtAppearReasonID) {
            GetSingleDataBias()
        }
    }, [CourtAppearReasonID, CourtAppearReasonupdStatus])

    const GetSingleDataBias = () => {
        const val = { 'CourtAppearReasonID': CourtAppearReasonID }
        fetchPostData('CourtAppearReason/GetSingleData_CourtAppearReason', val)
            .then((res) => {


                if (res) setCourtAppearReasonEditval(res)
                else setCourtAppearReasonEditval()
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "CourtAppearReasonCode": CourtAppearReasonEditval[0]?.CourtAppearReasonCode,
                'AgencyID': CourtAppearReasonEditval[0]?.AgencyID,
                'AgencyCode': CourtAppearReasonEditval[0]?.AgencyCode,
                "Description": CourtAppearReasonEditval[0]?.Description,
                'CourtAppearReasonID': CourtAppearReasonEditval[0]?.CourtAppearReasonID,
                'Iseditable': CourtAppearReasonEditval[0]?.Iseditable,
                'IsActive': CourtAppearReasonEditval[0]?.IsActive,
                'MultiAgency_Name': CourtAppearReasonEditval[0]?.MultiAgency_Name,
                'AgencyName': CourtAppearReasonEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CourtAppearReasonEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "CourtAppearReasonCode": '',
                "Description": '',
                'CourtAppearReasonID': '',
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
    }, [CourtAppearReasonEditval])

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

    const Add_CourtAppearReason = (e) => {
        var result = CourtAppearReasonData?.find(item => {
            if (item.CourtAppearReasonCode === value.CourtAppearReasonCode) {
                return true
            } else return false
        }
        );
        var result1 = CourtAppearReasonData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtAppearReasonCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CourtAppearReason/InsertCourtAppearReason', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtAppearReasonCodeError']: '' })
                setModal(false)
                get_data_CourtAppearReason();
                reset();
            })

        }
    }

    const Update_CourtAppearReason = () => {
        var result = CourtAppearReasonData?.find(item => {
            if (item.CourtAppearReasonID != CourtAppearReasonID) {
                if (item.CourtAppearReasonCode === value.CourtAppearReasonCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CourtAppearReasonData?.find(item => {
            if (item.CourtAppearReasonID != value.CourtAppearReasonID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtAppearReasonCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('CourtAppearReason/UpdateCourtAppearReason', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtAppearReasonCodeError']: '' })
                get_data_CourtAppearReason();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.CourtAppearReasonCode)) {
            // console.log(value.CourtAppearReasonCode);
            // console.log(RequiredField(value.CourtAppearReasonCode));
            setErrors(prevValues => { return { ...prevValues, ['CourtAppearReasonCodeError']: RequiredField(value.CourtAppearReasonCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CourtAppearReasonCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CourtAppearReasonCodeError === 'true') {
            if (status) Update_CourtAppearReason()
            else Add_CourtAppearReason()
        }
    }, [DescriptionError, CourtAppearReasonCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CourtAppearReasonModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Court Appear Reason</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='CourtAppearReasonCode' onChange={handlChanges} value={value.CourtAppearReasonCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CourtAppearReasonCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtAppearReasonCodeError}</span>
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

export default CourtAppearReason_Add_Up;


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