import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
// import { Select } from 'semantic-ui-react'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'

 

const ContactPhoneType_Add_Up = (props) => {

    const {  ContactTypeID, status, get_data_ContactPhoneType, ContactPhoneTypeData, modal, setModal, ContactPhoneTypeupdStatus  } = props

    const [agencyData, setAgencyData] = useState([])
    const [ContactPhoneTypeEditval, setContactPhoneTypeEditval] = useState();
    const [value, setValue] = useState({
        'ContactType': '', 'Description': '','AgencyCode':'', 'AgencyID:': '', 'Iseditable': '0', 'ContactTypeID:': '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': '', 'IsEMail': '', 'IsPhone': '', 'AgencyName': '', 'MultiAgency_Name': '','ArrestContactType':'','IsActive':'',
    });

    const reset = () => {
        setModal(false);
        setValue({
            ...value,
            'ContactType': '',
            'Description': '',
            'AgencyID:': '',
            'Iseditable': '',
            'ContactTypeID:': '',
            'Iseditable': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'IsEMail': '',
            'IsPhone': '',
            'AgencyName':'',
            'MultiAgency_Name':'',
            'ArrestContactType':'',
            'IsActive':'',
            'AgencyCode':'',

        })
        setErrors({
            'ContactTypeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ContactTypeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (ContactTypeID) {
            GetSingleData_Color()
        }
    }, [ContactTypeID, ContactPhoneTypeupdStatus])

    const GetSingleData_Color = () => {
        const val = { 'ContactTypeID': ContactTypeID }
        fetchPostData('ContactPhoneType/GetSingleData_ContactPhoneType', val)
            .then((res) => {
                if (res) setContactPhoneTypeEditval(res)
                else setContactPhoneTypeEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'AgencyID': ContactPhoneTypeEditval[0]?.AgencyID,
                'IsActive':ContactPhoneTypeEditval[0]?.IsActive,
                'AgencyCode':ContactPhoneTypeEditval[0]?.AgencyCode,
                "ContactType": ContactPhoneTypeEditval[0]?.ContactType,
                "Description": ContactPhoneTypeEditval[0]?.Description,
                'ContactTypeID': ContactPhoneTypeEditval[0]?.ContactTypeID,
                'IsEMail': ContactPhoneTypeEditval[0]?.IsEMail,
                'IsPhone': ContactPhoneTypeEditval[0]?.IsPhone,
                'ArrestContactType':ContactPhoneTypeEditval[0]?.ArrestContactType,
                 'MultiAgency_Name': ContactPhoneTypeEditval[0]?.MultiAgency_Name,
                 'AgencyName': ContactPhoneTypeEditval[0]?.MultipleAgency? changeArrayFormat_WithFilter(ContactPhoneTypeEditval[0]?.MultipleAgency
                ) : '',
                 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                  'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "ContactType": '', 'AgencyCode':'',"Description": '', 'ContactTypeID': '', 'IsEMail': '', 'IsPhone': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name':''
            })
        }
    }, [ContactPhoneTypeEditval])
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
        if (e.target.name === 'IsPhone' || e.target.name === 'IsEMail') {
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

    const Add_Relation = (e) => {
        var result = ContactPhoneTypeData?.find(item => {
            if (item.ContactType === value.ContactType) {
                return true
            } else return false
        }
        );
        var result1 = ContactPhoneTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['ContactTypeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('ContactPhoneType/InsertContactPhoneType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ContactTypeError']: '' })
                setModal(false)
                get_data_ContactPhoneType();
                reset();
            })

        }
    }

    const update_Relation_Type = () => {
        var result = ContactPhoneTypeData?.find(item => {
            if (item.ContactTypeID != ContactTypeID) {
                if (item.ContactType === value.ContactType) {
                    return true
                } else return false
            }
        }
        );
        var result1 = ContactPhoneTypeData?.find(item => {
            if (item.ContactTypeID != ContactTypeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['ContactTypeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('ContactPhoneType/UpdateContactPhoneType', value).then((res) => {
                toastifySuccess(res.Message);
                get_data_ContactPhoneType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ContactType)) {
            // console.log(value.ContactType);
            // console.log(RequiredField(value.ContactType));
            setErrors(prevValues => { return { ...prevValues, ['ContactTypeError']: RequiredField(value.ContactType) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, ContactTypeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && ContactTypeError === 'true') {
            if (status) update_Relation_Type()
            else Add_Relation()
        }
    }, [DescriptionError, ContactTypeError])

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ContactPhoneTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}> Contact Phone Type</legend>

                                            <div className="row">
                                            <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                   
                                                    <div class="text-field">
                                                        <input type="text" name='ContactType' onChange={handlChanges} value={value.ContactType} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ContactTypeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeError}</span>
                                                        ) : null}
                                                    </div>
                                                    </div>
                                                    {/* <div className="col-3"> */}
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
                                                {/* </div> */}
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
                                                        {/* <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsEMail" checked={value.IsEMail} value={value.IsEMail}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsEMail" />
                                                            <label className='ml-2' htmlFor="IsEMail">IsEMail</label>
                                                        </div>
                                                        <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsPhone" checked={value.IsPhone} value={value.IsPhone}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsPhone" />
                                                            <label className='ml-2' htmlFor="IsPhone">IsPhone</label>
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
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => reset()}>Close</button>
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

export default ContactPhoneType_Add_Up;

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