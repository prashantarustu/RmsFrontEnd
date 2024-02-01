import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const BodyBuild_Add_Up = (props) => {

    const { BodyBuildID, status, get_data_BodyBuild, BodyBuildData, modal, setModal, BodyBuildStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [BodyBuildEditVal, setBodyBuildEditVal] = useState();

    const [value, setValue] = useState({
        'BodyBuildCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'BodyBuildID': '',
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
            'BodyBuildCode': '',
            'Description': '',
            'AgencyID': '',
            'BodyBuildID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':''
        })
        setErrors({
            'BodyBuildCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'BodyBuildCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (BodyBuildID) {
            GetSingledataBodyBuild()
        }
    }, [BodyBuildID, BodyBuildStatus])
    // GetSingledataBodyBuild

    const GetSingledataBodyBuild = () => {
        const val = { 'BodyBuildID': BodyBuildID }
        fetchPostData('BodyBuild/GetSingleData_BodyBuild', val)
            .then((res) => {
                console.log("GetSingledataBodyBuild", res);
                if (res) setBodyBuildEditVal(res)
                else setBodyBuildEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "BodyBuildCode": BodyBuildEditVal[0]?.BodyBuildCode,
                // "DeletedByUserFK": BodyBuildEditVal[0]?.DeletedByUserFK,
                'AgencyCode':BodyBuildEditVal[0]?.AgencyCode,
                'AgencyID': BodyBuildEditVal[0]?.AgencyID,
                "Description": BodyBuildEditVal[0]?.Description,
                'BodyBuildID': BodyBuildEditVal[0]?.BodyBuildID,
                'IsActive': BodyBuildEditVal[0]?.IsActive,
                'MultiAgency_Name': BodyBuildEditVal[0]?.MultiAgency_Name,
                'AgencyName': BodyBuildEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(BodyBuildEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 
                "BodyBuildCode": '',
                 "Description": '', 
                 'AgencyID': '', 
                 'ModifiedByUserFK':'',
                 'MultiAgency_Name': ''
            })
        }
    }, [BodyBuildEditVal])
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

    const Add_BodyBuild = (e) => {
        var result = BodyBuildData?.find(item => {
            if (item.BodyBuildCode === value.BodyBuildCode) {
                return true
            } else return false
        }
        );
        var result1 = BodyBuildData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['BodyBuildCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log("this is val", value)
            AddDeleteUpadate('BodyBuild/InsertBodyBuild', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['BodyBuildCodeError']: '' })
                setModal(false)
                get_data_BodyBuild();
                reset();
                  console.log("this is addResponse",res)
            })

        }
    }

    const Update_BodyBuild = () => {
        var result = BodyBuildData?.find(item => {
            if (item.BodyBuildID != BodyBuildID) {
                if (item.BodyBuildCode === value.BodyBuildCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = BodyBuildData?.find(item => {
            if (item.BodyBuildID != value.BodyBuildID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['BodyBuildCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log("this is val", value)
            AddDeleteUpadate('BodyBuild/UpdateBodyBuild', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['BodyBuildCodeError']: '' })
                get_data_BodyBuild();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.BodyBuildCode)) {
            console.log(value.BodyBuildCode);
            console.log(RequiredField(value.BodyBuildCode));
            setErrors(prevValues => { return { ...prevValues, ['BodyBuildCodeError']: RequiredField(value.BodyBuildCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, BodyBuildCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && BodyBuildCodeError === 'true') {
            if (status) Update_BodyBuild()
            else Add_BodyBuild()
        }
    }, [DescriptionError, BodyBuildCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BodyBuildCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Body Build</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='BodyBuildCode' maxLength={10} onChange={handlChanges} value={value.BodyBuildCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.BodyBuildCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BodyBuildCodeError}</span>
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

export default BodyBuild_Add_Up


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