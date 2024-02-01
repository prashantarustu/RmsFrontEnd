import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const VictimCallType_Add_Up = (props) => {

    const { VictimCallTypeID, status, get_data_VictimCallType, VictimCallTypeData, modal, setModal, VictimCallTypeStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [VictimCallTypeEditVal, setVictimCallTypeEditVal] = useState();

    const [value, setValue] = useState({
        'CallTypeCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'VictimCallTypeID': '',
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
            'CallTypeCode': '',
            'Description': '',
            'AgencyID': '',
            'VictimCallTypeID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'CallTypeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CallTypeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (VictimCallTypeID) {
            GetSingledataVictimCallType()
        }
    }, [VictimCallTypeID, VictimCallTypeStatus])
    // GetSingledataVictimCallType

    const GetSingledataVictimCallType = () => {
        const val = { 'VictimCallTypeID': VictimCallTypeID }
        fetchPostData('VictimCallType/GetSingleData_VictimCallType', val)
            .then((res) => {
                if (res) setVictimCallTypeEditVal(res)
                else setVictimCallTypeEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "CallTypeCode": VictimCallTypeEditVal[0]?.CallTypeCode,
                // "DeletedByUserFK": VictimCallTypeEditVal[0]?.DeletedByUserFK,
                'AgencyID': VictimCallTypeEditVal[0]?.AgencyID,
                'AgencyCode': VictimCallTypeEditVal[0]?.AgencyCode,
                "Description": VictimCallTypeEditVal[0]?.Description,
                'VictimCallTypeID': VictimCallTypeEditVal[0]?.VictimCallTypeID,
                'IsActive': VictimCallTypeEditVal[0]?.IsActive,
                'MultiAgency_Name': VictimCallTypeEditVal[0]?.MultiAgency_Name,
                'AgencyName': VictimCallTypeEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(VictimCallTypeEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 
                "CallTypeCode": '',
                 "Description": '', 
                 'AgencyID': '', 
                 'ModifiedByUserFK':'',
                 'MultiAgency_Name': ''
            })
        }
    }, [VictimCallTypeEditVal])

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

    const Add_VictimCallType = (e) => {
        var result = VictimCallTypeData?.find(item => {
            if (item.CallTypeCode === value.CallTypeCode) {
                return true
            } else return false
        }
        );
        var result1 = VictimCallTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CallTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('VictimCallType/InsertVictimCallType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CallTypeCodeError']: '' })
                setModal(false)
                get_data_VictimCallType();
                reset();
            })

        }
    }

    const Update_VictimCallType = () => {
        var result = VictimCallTypeData?.find(item => {
            if (item.VictimCallTypeID != VictimCallTypeID) {
                if (item.CallTypeCode === value.CallTypeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = VictimCallTypeData?.find(item => {
            if (item.VictimCallTypeID != value.VictimCallTypeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CallTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('VictimCallType/UpdateVictimCallType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CallTypeCodeError']: '' })
                get_data_VictimCallType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.CallTypeCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CallTypeCodeError']: RequiredField(value.CallTypeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CallTypeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CallTypeCodeError === 'true') {
            if (status) Update_VictimCallType()
            else Add_VictimCallType()
        }
    }, [DescriptionError, CallTypeCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="VictimCallTypeCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Victim Call Type</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='CallTypeCode' maxLength={10} onChange={handlChanges} value={value.CallTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CallTypeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CallTypeCodeError}</span>
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

export default VictimCallType_Add_Up


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