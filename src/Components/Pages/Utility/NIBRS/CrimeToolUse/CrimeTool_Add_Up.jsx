import React from 'react'
import { useState,useCallback } from 'react'  
import { useEffect } from 'react'  
import Select from 'react-select'  
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

  
  
const CrimeTool_Add_Up = (props) => {

    const { ToolsUseID, status, get_data_CrimeTool, CrimeToolData, modal, setModal, updStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [CrimeToolEditval, setCrimeToolEditval] = useState();
    const [value, setValue] = useState({
        'ToolsUseCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'ToolsUseID': '',
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
            'ToolsUseCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'ToolsUseID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'ToolsUseCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ToolsUseCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (ToolsUseID) {
            GetSingleDataBias()
        }
    }, [ToolsUseID, updStatus])

    const GetSingleDataBias = () => {
        const val = { 'ToolsUseID': ToolsUseID }
        fetchPostData('CrimeToolsUse/GetSingleData_CrimeToolsUse', val)
            .then((res) => {

                if (res) setCrimeToolEditval(res)
                else setCrimeToolEditval()  
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "ToolsUseCode": CrimeToolEditval[0]?.ToolsUseCode,
                'AgencyID': CrimeToolEditval[0]?.AgencyID,
                'AgencyCode':CrimeToolEditval[0]?.AgencyCode,
                "Description": CrimeToolEditval[0]?.Description,
                'ToolsUseID': CrimeToolEditval[0]?.ToolsUseID,
                'Iseditable':CrimeToolEditval[0]?.Iseditable,
                'IsActive':CrimeToolEditval[0]?.IsActive,
                'MultiAgency_Name': CrimeToolEditval[0]?.MultiAgency_Name,
                'AgencyName': CrimeToolEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(CrimeToolEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "ToolsUseCode": '', 'AgencyCode':'',"Description": '', 'ToolsUseID': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': ''
            })
        }
    }, [CrimeToolEditval])
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

    const Add_CrimeTool = (e) => {
        var result = CrimeToolData?.find(item => {
            if (item.ToolsUseCode === value.ToolsUseCode) {
                return true
            } else return false
        }  
        );
        var result1 = CrimeToolData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['ToolsUseCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeToolsUse/InsertCrimeToolsUse', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ToolsUseCodeError']: '' })
                setModal(false)
                get_data_CrimeTool();
                reset();
            })

        }
    }

    const Add_Update_CrimeTool = () => {
        var result = CrimeToolData?.find(item => {
            if (item.ToolsUseID != ToolsUseID) {
                if (item.ToolsUseCode === value.ToolsUseCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = CrimeToolData?.find(item => {
            if (item.ToolsUseID != value.ToolsUseID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['ToolsUseCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeToolsUse/UpdateCrimeToolsUse', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ToolsUseCodeError']: '' })
                get_data_CrimeTool();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ToolsUseCode)) {
            // console.log(value.ToolsUseCode);
            // console.log(RequiredField(value.ToolsUseCode));
            setErrors(prevValues => { return { ...prevValues, ['ToolsUseCodeError']: RequiredField(value.ToolsUseCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, ToolsUseCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && ToolsUseCodeError === 'true') {
            if (status) Add_Update_CrimeTool()
            else Add_CrimeTool()
        }
    }, [DescriptionError, ToolsUseCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CrimeSusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Tools Use</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='ToolsUseCode' onChange={handlChanges} value={value.ToolsUseCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ToolsUseCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ToolsUseCodeError}</span>
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

export default CrimeTool_Add_Up;


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