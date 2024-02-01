import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'  
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'   
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

  

const CrimeMethod_Oper_Add_Up = (props) => {

    const {  MethodOfOperationID, status, get_data_Meth_operation, MethOperData, modal, setModal, updStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [MethOperEditVal, setMethOperEditVal] = useState();
    const [value, setValue] = useState({
        'MethodOfOperationCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'MethodOfOperationID': '',
        'IsActive':'',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':''
    });


    const reset = () => {
        setValue({
            ...value,
            'MethodOfOperationCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'MethodOfOperationID': '',  
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'MethodOfOperationCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'MethodOfOperationCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (MethodOfOperationID) {
            GetSingleDataBias()
        }
    }, [MethodOfOperationID, updStatus])

    const GetSingleDataBias = () => {
        const val = { 'MethodOfOperationID': MethodOfOperationID }
        fetchPostData('CrimeMethodOfOperation/GetSingleData_CrimeMethodOfOperation', val)
            .then((res) => {

                if (res) setMethOperEditVal(res)
                else setMethOperEditVal()
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "MethodOfOperationCode": MethOperEditVal[0]?.MethodOfOperationCode,
                'AgencyID': MethOperEditVal[0]?.AgencyID,
                'AgencyCode': MethOperEditVal[0]?.AgencyCode,
                "Description": MethOperEditVal[0]?.Description,
                'MethodOfOperationID': MethOperEditVal[0]?.MethodOfOperationID,
                'Iseditable':MethOperEditVal[0]?.Iseditable,
                'IsActive':MethOperEditVal[0]?.IsActive,
                'MultiAgency_Name': MethOperEditVal[0]?.MultiAgency_Name,
                'AgencyName': MethOperEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(MethOperEditVal[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "MethodOfOperationCode": '','AgencyCode':'', "Description": '', 'MethodOfOperationID': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': ''
            })
        }
    }, [MethOperEditVal])
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

    const Add_Method_Oper = (e) => {
        var result = MethOperData?.find(item => {
            if (item.MethodOfOperationCode === value.MethodOfOperationCode) {
                return true
            } else return false
        }  
        );
        var result1 = MethOperData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['MethodOfOperationCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {  
            AddDeleteUpadate('CrimeMethodOfOperation/InsertCrimeMethodOfOperation', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['MethodOfOperationCodeError']: '' })
                setModal(false)
                get_data_Meth_operation();
                reset();
            })

        }
    }

    const Update_CrimeMethod_Oper = () => {
        var result = MethOperData?.find(item => {
            if (item.MethodOfOperationID != MethodOfOperationID) {
                if (item.MethodOfOperationCode === value.MethodOfOperationCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = MethOperData?.find(item => {
            if (item.MethodOfOperationID != value.MethodOfOperationID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['MethodOfOperationCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CrimeMethodOfOperation/UpdateCrimeMethodOfOperation', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['MethodOfOperationCodeError']: '' })
                get_data_Meth_operation();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.MethodOfOperationCode)) {
            // console.log(value.MethodOfOperationCode);
            // console.log(RequiredField(value.MethodOfOperationCode));
            setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationCodeError']: RequiredField(value.MethodOfOperationCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, MethodOfOperationCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && MethodOfOperationCodeError === 'true') {
            if (status) Update_CrimeMethod_Oper()
            else Add_Method_Oper()
        }
    }, [DescriptionError, MethodOfOperationCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MethodOperModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Method Of Operation</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='MethodOfOperationCode' onChange={handlChanges} value={value.MethodOfOperationCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.MethodOfOperationCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MethodOfOperationCodeError}</span>
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

export default CrimeMethod_Oper_Add_Up;


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