import React from 'react'
import { useState, useCallback,useEffect } from 'react'
// import { useEffect } from 'react'
// import { Select } from 'semantic-ui-react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';


const Ethnicity_Add_Up = (props) => {

    const {EthnicityID, status, get_data_Ethnicity, ethnicityData, modal, setModal, EthnicityupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [ethnicityEditval, setethnicityEditval] = useState();

    const [value, setValue] = useState({
        'EthnicityCode': '',
        'Description': '',
        'EthnicityID': '',
        'IsActive': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'DeletedByUserFK': '',
        'AgencyId': '', 'MultiAgency_Name':'',
        'AgencyName': '','AgencyCode':'',
    });

    const reset = () => {
        setValue({
            ...value,
            'EthnicityCode': '',
            'Description': '',
            'EthnicityID': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyId': '',
            'AgencyName': '', 'MultiAgency_Name':'','AgencyCode':'',
        })
        setErrors({
            'EthnicityCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'EthnicityCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (EthnicityID) {
            GetSingleData_Gender()
        }
    }, [EthnicityID, EthnicityupdStatus])

    const GetSingleData_Gender = () => {
        const val = { 'EthnicityID': EthnicityID }
        fetchPostData('TableManagement/GetSingleData_Ethnicity', val)
            .then((res) => {
                console.log(res);
                if (res) setethnicityEditval(res)
                else setethnicityEditval()
            })
    }


  
    useEffect(() => {
        if (status) {
            console.log("1111",ethnicityEditval[0]?.AgencyCode,);
            setValue({
                ...value,
                "EthnicityCode": ethnicityEditval[0]?.EthnicityCode,
                'AgencyCode':ethnicityEditval[0]?.AgencyCode,
                "Description": ethnicityEditval[0]?.Description,
                'EthnicityID': ethnicityEditval[0]?.EthnicityID, 'MultiAgency_Name': ethnicityEditval[0]?.MultiAgency_Name,
                'AgencyId': ethnicityEditval[0]?.AgencyID, 'IsActive': ethnicityEditval[0]?.IsActive,
                'AgencyName': ethnicityEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(ethnicityEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
        }
        else {
            setValue({
                ...value,
                "EthnicityCode": '',
                "Description": '',
                'EthnicityID': '',
                'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name':'', 'IsActive':'', 'ModifiedByUserFK':'','AgencyCode':'',
            })
        }
    }, [ethnicityEditval])

    
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
            e.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyId']: id.toString(), ['MultiAgency_Name']: name.toString()
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

  
    const Add_Ethnicity = (e) => {
        var result = ethnicityData?.find(item => {
            if (item.EthnicityCode === value.EthnicityCode) {
                return true
            } else return false
        }
        );
        var result1 = ethnicityData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('TableManagement/InsertEthnicity', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
                setModal(false)
                get_data_Ethnicity();
                reset();
                //   console.log("this is addResponse",res)
            })
        }
    }

    const update_Ethnicity = () => {
        var result = ethnicityData?.find(item => {
            if (item.EthnicityID != EthnicityID) {
                if (item.EthnicityCode === value.EthnicityCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = ethnicityData?.find(item => {
            if (item.EthnicityID != EthnicityID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Ethnicity Code Already Exists')
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            // console.log(value);
            AddDeleteUpadate('TableManagement/UpdateEthnicity', value).then((res) => {
                toastifySuccess(res.Message);setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_Ethnicity();
                setModal(false)
                reset();
            })
        }
    }


    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.EthnicityCode)) {
            setErrors(prevValues => { return { ...prevValues, ['EthnicityCodeError']: RequiredField(value.EthnicityCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, EthnicityCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && EthnicityCodeError === 'true') {
            if (status) update_Ethnicity()
            else Add_Ethnicity()
        }
    }, [DescriptionError, EthnicityCodeError])


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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EthnicityModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Ethnicity</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='EthnicityCode' maxLength={10} onChange={handlChanges} value={value.EthnicityCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.EthnicityCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EthnicityCodeError}</span>
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
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                    {
                                                        value?.AgencyName ?
                                                            <Select
                                                                isMulti
                                                                name='Agencyid'
                                                                isClearable
                                                                defaultValue={value?.AgencyName}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            /> : <><Select
                                                                isMulti
                                                                name='Agencyid'
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

export default Ethnicity_Add_Up

export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}

