import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const ContactType_Add_Up = (props) => {
    const { ContactTypeID, status, get_data_ContactType, ContactTypeData, modal, setModal, ContactTypeStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [ContactTypeEditVal, setContactTypeEditVal] = useState();

    const [value, setValue] = useState({
        'ContactTypeCode': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': "0",
        'ContactTypeID': '',
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
            'ContactTypeCode': '',
            'Description': '',
            'AgencyID': '',
            'ContactTypeID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'ContactTypeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ContactTypeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (ContactTypeID) {
            GetSingledataContactType()
        }
    }, [ContactTypeID, ContactTypeStatus])
    // GetSingledataContactType

    const GetSingledataContactType = () => {
        const val = { 'ContactTypeID': ContactTypeID }
        fetchPostData('ContactType/GetSingleData_ContactType', val)
            .then((res) => {
                
                if (res) setContactTypeEditVal(res)
                else setContactTypeEditVal()
            })
    }



    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "ContactTypeCode": ContactTypeEditVal[0]?.ContactTypeCode,
                // "DeletedByUserFK": ContactTypeEditVal[0]?.DeletedByUserFK,
                'AgencyID': ContactTypeEditVal[0]?.AgencyID,
                'AgencyCode':ContactTypeEditVal[0]?.AgencyCode,
                "Description": ContactTypeEditVal[0]?.Description,
                'ContactTypeID': ContactTypeEditVal[0]?.ContactTypeID,
                'IsActive': ContactTypeEditVal[0]?.IsActive,
                'MultiAgency_Name': ContactTypeEditVal[0]?.MultiAgency_Name,
                'AgencyName': ContactTypeEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(ContactTypeEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 
                "ContactTypeCode": '',
                 "Description": '', 
                 'AgencyID': '', 
                 'ModifiedByUserFK':'',
                 'MultiAgency_Name': ''
            })
        }
    }, [ContactTypeEditVal])
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

    const Add_ContactType = (e) => {
        var result = ContactTypeData?.find(item => {
            if (item.ContactTypeCode === value.ContactTypeCode) {
                return true
            } else return false
        }
        );
        var result1 = ContactTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['ContactTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
          
            AddDeleteUpadate('ContactType/InsertContactType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ContactTypeCodeError']: '' })
                setModal(false)
                get_data_ContactType();
                reset();
            
            })

        }
    }

    const Update_ContactType = () => {
        var result = ContactTypeData?.find(item => {
            if (item.ContactTypeID != ContactTypeID) {
                if (item.ContactTypeCode === value.ContactTypeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = ContactTypeData?.find(item => {
            if (item.ContactTypeID != value.ContactTypeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['ContactTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
          
            AddDeleteUpadate('ContactType/UpdateContactType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ContactTypeCodeError']: '' })
                get_data_ContactType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ContactTypeCode)) {
            // console.log(value.ContactTypeCode);
            // console.log(RequiredField(value.ContactTypeCode));
            setErrors(prevValues => { return { ...prevValues, ['ContactTypeCodeError']: RequiredField(value.ContactTypeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, ContactTypeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && ContactTypeCodeError === 'true') {
            if (status) Update_ContactType()
            else Add_ContactType()
        }
    }, [DescriptionError, ContactTypeCodeError])

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
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ContactTypeCodes" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Contact Type</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='ContactTypeCode' maxLength={10} onChange={handlChanges} value={value.ContactTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ContactTypeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeCodeError}</span>
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

export default ContactType_Add_Up


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