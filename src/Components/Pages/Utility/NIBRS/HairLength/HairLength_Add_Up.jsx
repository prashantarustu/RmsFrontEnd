import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const HairLength_Add_Up = (props) => {

    const { HairLengthID, status, get_data_HairLength, HairLengthData, modal, setModal, HairLengthStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [HairLengthEditVal, setHairLengthEditVal] = useState();

    const [value, setValue] = useState({
        'HairLengthCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'HairLengthID': '',
        'IsActive': '1',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':'',
    });


    const reset = () => {
        setValue({
            ...value,
            'HairLengthCode': '',
            'Description': '',
            'AgencyID': '',
            'HairLengthID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'HairLengthCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'HairLengthCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (HairLengthID) {
            GetSingledataHairLength()
        }
    }, [HairLengthID, HairLengthStatus])
    // GetSingledataHairLength

    const GetSingledataHairLength = () => {
        const val = { 'HairLengthID': HairLengthID }
        fetchPostData('HairLength/GetSingleData_HairLength', val)
            .then((res) => {
                if (res) setHairLengthEditVal(res)
                else setHairLengthEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "HairLengthCode": HairLengthEditVal[0]?.HairLengthCode,
                // "DeletedByUserFK": HairLengthEditVal[0]?.DeletedByUserFK,
                'AgencyID': HairLengthEditVal[0]?.AgencyID,
                'AgencyCode':HairLengthEditVal[0]?.AgencyCode,
                "Description": HairLengthEditVal[0]?.Description,
                'HairLengthID': HairLengthEditVal[0]?.HairLengthID,
                'IsActive': HairLengthEditVal[0]?.IsActive,
                'MultiAgency_Name': HairLengthEditVal[0]?.MultiAgency_Name,
                'AgencyName': HairLengthEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(HairLengthEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "HairLengthCode": '',
                "Description": '',
                'AgencyID': '',
                'ModifiedByUserFK': '',
                'MultiAgency_Name': ''
            })
        }
    }, [HairLengthEditVal])

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

    const Add_HairLength = (e) => {
        var result = HairLengthData?.find(item => {
            if (item.HairLengthCode === value.HairLengthCode) {
                return true
            } else return false
        }
        );
        var result1 = HairLengthData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['HairLengthCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('HairLength/InsertHairLength', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['HairLengthCodeError']: '' })
                setModal(false)
                get_data_HairLength();
                reset();
            })

        }
    }

    const Update_HairLength = () => {
        var result = HairLengthData?.find(item => {
            if (item.HairLengthID != HairLengthID) {
                if (item.HairLengthCode === value.HairLengthCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = HairLengthData?.find(item => {
            if (item.HairLengthID != value.HairLengthID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['HairLengthCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('HairLength/UpdateHairLength', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['HairLengthCodeError']: '' })
                get_data_HairLength();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.HairLengthCode)) {
            // console.log(value.HairLengthCode);
            // console.log(RequiredField(value.HairLengthCode));
            setErrors(prevValues => { return { ...prevValues, ['HairLengthCodeError']: RequiredField(value.HairLengthCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, HairLengthCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && HairLengthCodeError === 'true') {
            if (status) Update_HairLength()
            else Add_HairLength()
        }
    }, [DescriptionError, HairLengthCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="HairLengthCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Hair Length</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='HairLengthCode' maxLength={10} onChange={handlChanges} value={value.HairLengthCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.HairLengthCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HairLengthCodeError}</span>
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

export default HairLength_Add_Up


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