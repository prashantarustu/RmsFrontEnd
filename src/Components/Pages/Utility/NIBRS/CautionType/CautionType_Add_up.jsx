import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const CautionType_Add_Up = (props) => {

    const { CautionTypeId, status, get_data_CautionType, CautionTypeData, modal, setModal, CautionTypeStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [CautionTypeEditVal, setCautionTypeEditVal] = useState();

    const [value, setValue] = useState({
        'CautionTypeCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'CautionTypeId': '',
        'IsActive':'1',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':''
    });


    const reset = () => {
        setValue({
            ...value,
            'CautionTypeCode': '',
            'Description': '',
            'AgencyID': '',
            'CautionTypeId': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':''
        })
        setErrors({
            'CautionTypeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CautionTypeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (CautionTypeId) {
            GetSingledataCautionType()
        }
    }, [CautionTypeId, CautionTypeStatus])
    // GetSingledataCautionType

    const GetSingledataCautionType = () => {
        const val = { 'CautionTypeId': CautionTypeId }
        fetchPostData('CautionType/GetSingleData_CautionType', val)
            .then((res) => {
                console.log("GetSingledataCautionType", res);
                if (res) setCautionTypeEditVal(res)
                else setCautionTypeEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "CautionTypeCode": CautionTypeEditVal[0]?.CautionTypeCode,
                // "DeletedByUserFK": CautionTypeEditVal[0]?.DeletedByUserFK,
                'AgencyID': CautionTypeEditVal[0]?.AgencyID,
                'AgencyCode':CautionTypeEditVal[0]?.AgencyCode,
                "Description": CautionTypeEditVal[0]?.Description,
                'CautionTypeId': CautionTypeEditVal[0]?.CautionTypeId,
                'IsActive': CautionTypeEditVal[0]?.IsActive,
                'MultiAgency_Name': CautionTypeEditVal[0]?.MultiAgency_Name,
                'AgencyName': CautionTypeEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CautionTypeEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 
                "CautionTypeCode": '',
                 "Description": '', 
                 'AgencyID': '', 
                 'ModifiedByUserFK':'',
                 'MultiAgency_Name': ''
            })
        }
    }, [CautionTypeEditVal])
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
            console.log(e);
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

    const Add_CautionType = (e) => {
        var result = CautionTypeData?.find(item => {
            if (item.CautionTypeCode === value.CautionTypeCode) {
                return true
            } else return false
        }
        );
        var result1 = CautionTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CautionTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log("this is val", value)
            AddDeleteUpadate('CautionType/InsertCautionType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CautionTypeCodeError']: '' })
                setModal(false)
                get_data_CautionType();
                reset();
                  console.log("this is addResponse",res)
            })

        }
    }

    const Update_CautionType = () => {
        var result = CautionTypeData?.find(item => {
            if (item.CautionTypeId != CautionTypeId) {
                if (item.CautionTypeCode === value.CautionTypeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CautionTypeData?.find(item => {
            if (item.CautionTypeId != value.CautionTypeId) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CautionTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log("this is val", value)
            AddDeleteUpadate('CautionType/UpdateCautionType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CautionTypeCodeError']: '' })
                get_data_CautionType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.CautionTypeCode)) {
            console.log(value.CautionTypeCode);
            console.log(RequiredField(value.CautionTypeCode));
            setErrors(prevValues => { return { ...prevValues, ['CautionTypeCodeError']: RequiredField(value.CautionTypeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CautionTypeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CautionTypeCodeError === 'true') {
            if (status) Update_CautionType()
            else Add_CautionType()
        }
    }, [DescriptionError, CautionTypeCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CautionTypeCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Caution Type</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='CautionTypeCode' maxLength={10} onChange={handlChanges} value={value.CautionTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CautionTypeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CautionTypeCodeError}</span>
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

export default CautionType_Add_Up


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