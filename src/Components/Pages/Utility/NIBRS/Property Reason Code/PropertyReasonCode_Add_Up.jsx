import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const PropertyReasonCode_Add_Up = (props) => {

    const { PropertyReasonCodeID, status, get_data_PropertyReasonCode, PropertyReasonCodeData, modal, setModal, PropertyReasonCodeStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [PropertyReasonCodeEditVal, setPropertyReasonCodeEditVal] = useState();

    const [value, setValue] = useState({
        'PropertyReasonsCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'PropertyReasonCodeID': '',
        'IsActive': '1',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'IsOtherReason': '',
        'IsSecurityReason': '',
        'IsGunReason': '',
        'IsBoatReason': '',
        'IsArticleReason': '',
        'PropRectype': '',
        'AgencyCode':'',
    });


    const reset = () => {
        setValue({
            ...value,
            'PropertyReasonsCode': '',
            'PropRectype': '',
            'Description': '',
            'AgencyID': '',
            'PropertyReasonCodeID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'IsArticleReason': '',
            'IsBoatReason': '',
            'IsSecurityReason': '',
            'IsOtherReason': '',
            'IsGunReason': '',
            'AgencyCode':'',
        })
        setErrors({
            'PropertyReasonsCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'PropertyReasonsCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (PropertyReasonCodeID) {
            GetSingledataPropertyReasonCode()
        }
    }, [PropertyReasonCodeID, PropertyReasonCodeStatus])
    // GetSingledataPropertyReasonCode

    const GetSingledataPropertyReasonCode = () => {
        const val = { 'PropertyReasonCodeID': PropertyReasonCodeID }
        fetchPostData('PropertyReasonCode/GetSingleData_PropertyReasonCode', val)
            // console.log('this',val)
            .then((res) => {
                if (res) setPropertyReasonCodeEditVal(res)
                else setPropertyReasonCodeEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "PropertyReasonsCode": PropertyReasonCodeEditVal[0]?.PropertyReasonsCode,
                // "DeletedByUserFK": PropertyReasonCodeEditVal[0]?.DeletedByUserFK,
                'AgencyID': PropertyReasonCodeEditVal[0]?.AgencyID,
                'AgencyCode':PropertyReasonCodeEditVal[0]?.AgencyCode,
                "Description": PropertyReasonCodeEditVal[0]?.Description,
                'PropertyReasonCodeID': PropertyReasonCodeEditVal[0]?.PropertyReasonCodeID,
                'IsActive': PropertyReasonCodeEditVal[0]?.IsActive,
                'MultiAgency_Name': PropertyReasonCodeEditVal[0]?.MultiAgency_Name,

                'IsOtherReason': PropertyReasonCodeEditVal[0]?.IsOtherReason,
                'IsSecurityReason': PropertyReasonCodeEditVal[0]?.IsSecurityReason,
                'IsGunReason': PropertyReasonCodeEditVal[0]?.IsGunReason,
                'IsBoatReason': PropertyReasonCodeEditVal[0]?.IsBoatReason,
                'IsBoatReason': PropertyReasonCodeEditVal[0]?.IsBoatReason,
                'IsArticleReason': PropertyReasonCodeEditVal[0]?.IsArticleReason,
                'PropRectype': PropertyReasonCodeEditVal[0]?.PropRectype,

                'AgencyName': PropertyReasonCodeEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(PropertyReasonCodeEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "PropertyReasonsCode": '',
                "Description": '',
                'AgencyID': '',
                'ModifiedByUserFK': '',
                'MultiAgency_Name': '',
                'IsGunReason': '',
                'IsArticleReason': '',
                'IsBoatReason': '',
                'IsSecurityReason': '',
                'IsOtherReason': '',
                'PropRectype': '',
                'AgencyCode':'',
            })
        }
    }, [PropertyReasonCodeEditVal])

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


    // const handlChanges = (e) => {
    //     setValue({
    //         ...value,
    //         [e.target.name]: e.target.value
    //     })
    // }
    const handlChanges = (e) => {
        
            if (e.target.name === 'IsOtherReason' || e.target.name === 'IsSecurityReason' || e.target.name === 'IsGunReason' || e.target.name === 'IsBoatReason' || e.target.name === 'IsArticleReason') {

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

    const Add_PropertyReasonCode = (e) => {
        var result = PropertyReasonCodeData?.find(item => {
            if (item.PropertyReasonsCode === value.PropertyReasonsCode) {
                return true
            } else return false
        }
        );
        var result1 = PropertyReasonCodeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['PropertyReasonsCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PropertyReasonCode/InsertPropertyReasonCode', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['PropertyReasonsCodeError']: '' })
                setModal(false)
                get_data_PropertyReasonCode();
                reset();
            })

        }
    }

    const Update_PropertyReasonCode = () => {
        var result = PropertyReasonCodeData?.find(item => {
            if (item.PropertyReasonCodeID != PropertyReasonCodeID) {
                if (item.PropertyReasonsCode === value.PropertyReasonsCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = PropertyReasonCodeData?.find(item => {
            if (item.PropertyReasonCodeID != value.PropertyReasonCodeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['PropertyReasonsCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log('dfdf', value)
            AddDeleteUpadate('PropertyReasonCode/UpdatePropertyReasonCode', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['PropertyReasonsCodeError']: '' })
                get_data_PropertyReasonCode();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.PropertyReasonsCode)) {
            setErrors(prevValues => { return { ...prevValues, ['PropertyReasonsCodeError']: RequiredField(value.PropertyReasonsCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, PropertyReasonsCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && PropertyReasonsCodeError === 'true') {
            if (status) Update_PropertyReasonCode()
            else Add_PropertyReasonCode()
        }
    }, [DescriptionError, PropertyReasonsCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PropertyReasonCodeCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Property Reason Code</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='PropertyReasonsCode' maxLength={10} onChange={handlChanges} value={value.PropertyReasonsCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.PropertyReasonsCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyReasonsCodeError}</span>
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
                                                        {/* //---------------------dd--------------------------// */}
                                                        {/* <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsArticleReason" checked={value.IsArticleReason} value={value.IsArticleReason}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsArticleReason" />
                                                            <label className='ml-2' htmlFor="IsArticleReason">Is ArticleReason</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsBoatReason" checked={value.IsBoatReason} value={value.IsBoatReason}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsBoatReason" />
                                                            <label className='ml-2' htmlFor="IsBoatReason">Is BoatReason</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsGunReason" checked={value.IsGunReason} value={value.IsGunReason}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsGunReason" />
                                                            <label className='ml-2' htmlFor="IsGunReason">Is GunReason</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsSecurityReason" checked={value.IsSecurityReason} value={value.IsSecurityReason}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsSecurityReason" />
                                                            <label className='ml-2' htmlFor="IsSecurityReason">Is SecurityReason</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsOtherReason" checked={value.IsOtherReason} value={value.IsOtherReason}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsOtherReason" />
                                                            <label className='ml-2' htmlFor="IsOtherReason">Is OtherReason</label>
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

export default PropertyReasonCode_Add_Up


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