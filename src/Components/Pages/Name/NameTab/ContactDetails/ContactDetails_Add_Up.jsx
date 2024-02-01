import React, { useContext, useState } from 'react'
import { useEffect, useCallback } from 'react';
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { Email_Field, Email_Field_Contact, PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const ContactDetails_Add_Up = (props) => {

    const { get_Name_Count } = useContext(AgencyContext)
    const { nameID, MasterNameID, LoginAgencyID, LoginPinID, status, Get_ContactDetailsData, setModal, modal, NameContactID, updateStatus, Get_Master_ContactData } = props
    const useQuery = () => new URLSearchParams(useLocation().search);

    let openPage = useQuery().get('page');
    const [ContactType, setContactType] = useState([]);
    const [Editval, setEditval] = useState([]);
    const [verifyIdDrp, setverifyIdDrp] = useState([]);
    const [contactTypeCode, setContactTypeCode] = useState('');

    const [value, setValue] = useState({
        'ContactTypeID': '', 'VerifyID': '', 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": '',
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'ContactTypeIDErrors': "", 'Phone_EmailErrors': ""
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID } });
    }, [nameID, MasterNameID, updateStatus]);

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

    useEffect(() => {
        if (openPage === 'mastername') {
            if (NameContactID) GetMasterSingleData(NameContactID)
        } else if (NameContactID) {
            GetSingleData(NameContactID);
        }
    }, [NameContactID])

    const GetSingleData = (NameContactID) => {
        const val = {
            'NameContactID': NameContactID
        }
        fetchPostData('NameContactDetails/GetSingleData_NameContactDetails', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                }
                else { setEditval([]) }
            })
    }

    const GetMasterSingleData = (NameContactID) => {
        const val = {
            'NameContactID': NameContactID
        }
        fetchPostData('MainMasterNameContactDetails/GetSingleData_MainMasterNameContactDetails', val).then((res) => {
            if (res) {
                setEditval(res);
            }
            else { setEditval([]) }
        })
    }

    useEffect(() => {
        if (status) {
            // console.log(Editval)
            setValue({
                ...value,
                'NameContactID': Editval[0]?.NameContactID,
                'ContactTypeID': Editval[0]?.ContactTypeID,
                'VerifyID': Editval[0]?.VerifyID,
                'Phone_Email': Editval[0]?.Phone_Email,
                'ModifiedByUserFK': LoginPinID,
                'IsInListedPh': Editval[0]?.IsInListedPh,
                "IsCurrentPh": Editval[0]?.IsCurrentPh,
            })
            setContactTypeCode(Get_Property_Code(Editval, ContactType))
        } else {
            setValue({
                ...value,
                'ContactTypeID': '',
                'VerifyID': '',
                'Phone_Email': '',
                'IsInListedPh': '',
                "IsCurrentPh": '',
            })
            setContactTypeCode('')
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'ContactTypeID': '', 'VerifyID': '', 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": '',
        });
        setErrors({
            ...errors,
            'Phone_EmailErrors': '', 'ContactTypeIDErrors': '', 'CommentsError': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ContactTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['ContactTypeIDErrors']: RequiredFieldIncident(value.ContactTypeID) } })
        }
        if (contactTypeCode === "E") {
            if (Email_Field_Contact(value.Phone_Email)) {
                setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: Email_Field_Contact(value.Phone_Email) } })
            }
        } else {
            if (PhoneFieldNotReq(value.Phone_Email)) {
                setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: PhoneFieldNotReq(value.Phone_Email) } })
            }
        }
    }

    const { ContactTypeIDErrors, Phone_EmailErrors, } = errors

    useEffect(() => {
        if (ContactTypeIDErrors === 'true' && Phone_EmailErrors === 'true') {
            if (openPage === 'mastername') {
                if (status) Master_Update_Activity()
                else master_Add_Type()
            } else {
                if (status) update_Activity()
                else Add_Type()
            }
        }
    }, [ContactTypeIDErrors, Phone_EmailErrors])

    useEffect(() => {
        GetVerifyIDDrp(LoginAgencyID);
        get_ContactType(LoginAgencyID, '1', '1');
    }, [LoginAgencyID])

    const get_ContactType = (LoginAgencyID, IsEMail, IsPhone) => {
        const val = {
            AgencyID: LoginAgencyID,
            IsEMail: IsEMail,
            IsPhone: IsPhone,
        }
        fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
            if (data) {
                // setContactType(Comman_changeArrayFormat(data, 'ContactTypeID', 'Description'))
                setContactType(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
            } else {
                setContactType([]);
            }
        })
    }

    const GetVerifyIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
            if (data) {
                setverifyIdDrp(Comman_changeArrayFormat(data, 'VerifyID', 'Description'))
            } else {
                setverifyIdDrp([]);
            }
        })
    }

    const handleChange = (e) => {
        if (e.target.name === 'IsInListedPh' || e.target.name === 'IsCurrentPh') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        }
        else if (e.target.name === 'Phone_Email') {
            if (contactTypeCode !== "E") {
                var ele = e.target.value.replace(/\D/g, '');
                if (ele.length === 10) {
                    var cleaned = ('' + ele).replace(/\D/g, '');
                    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                        })
                    }
                } else {
                    ele = e.target.value.split('-').join('').replace(/\D/g, '');
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    })
                }
            } else {
                setValue({
                    ...value,
                    [e.target.name]: e.target.value
                })
            }
        }
    }

    const Add_Type = (e) => {
        AddDeleteUpadate('NameContactDetails/Insert_NameContactDetails', value)
            .then((res) => {
                if (res.Message === " ") {
                    get_Name_Count(nameID);
                    Get_ContactDetailsData(nameID);
                    setModal(false)
                    reset();
                    setContactTypeCode('')
                } else {
                    get_Name_Count(nameID);
                    Get_ContactDetailsData(nameID);
                    setModal(false)
                    toastifySuccess(res.Message);
                    reset();
                }
            })
    }

    const master_Add_Type = (e) => {
        AddDeleteUpadate('MainMasterNameContactDetails/Insert_MainMasterNameContactDetails', value)
            .then((res) => {
                if (res.Message === " ") {
                    Get_Master_ContactData(MasterNameID);
                    setModal(false)
                    reset();
                    setContactTypeCode('')
                } else {
                    Get_Master_ContactData(MasterNameID);
                    setModal(false)
                    toastifySuccess(res.Message);
                    reset();
                }
            })
    }

    const Master_Update_Activity = () => {
        AddDeleteUpadate('MainMasterNameContactDetails/Update_MainMasterNameContactDetails', value).then((res) => {
            toastifySuccess(res.Message);
            Get_Master_ContactData(MasterNameID);
            reset();
            setContactTypeCode('')
            setErrors({ ...errors, ['Phone_EmailErrors']: '', });
            setModal(false);
        })
    }

    const update_Activity = () => {
        AddDeleteUpadate('NameContactDetails/Update_NameContactDetails', value).then((res) => {
            toastifySuccess(res.Message);
            Get_ContactDetailsData(nameID);
            setContactTypeCode('')
            reset();
            setErrors({ ...errors, ['Phone_EmailErrors']: '', });
            setModal(false);
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'ContactTypeID') {
                setContactTypeCode(e.id)
                setValue({
                    ...value,
                    ['ContactTypeID']: e.value
                })
            }
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            }); setContactTypeCode('')
        }
    }

    const closeModal = () => {
        reset();
        setModal(false);
        setContactTypeCode('')
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
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
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PinModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Contact Details</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                                <Select
                                                                    name='ContactTypeID'
                                                                    styles={colourStyles}
                                                                    value={ContactType?.filter((obj) => obj.value === value?.ContactTypeID)}
                                                                    isClearable
                                                                    options={ContactType}
                                                                    onChange={(e) => ChangeDropDown(e, 'ContactTypeID')}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' className='mt-1'>Contact Type</label>
                                                                {errors.ContactTypeIDErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeIDErrors}</span>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-4 mt-1">
                                                                <div className="text-field">
                                                                    {
                                                                        contactTypeCode === "E" ?
                                                                            <input type="text" className='requiredColor' name='Phone_Email' value={value.Phone_Email} onChange={handleChange} required />
                                                                            :
                                                                            <>
                                                                                <input type="text" className='requiredColor' maxLength={10} name='Phone_Email' value={value.Phone_Email} onChange={handleChange} required />
                                                                            </>
                                                                    }
                                                                    <label className=''>Phone/Email</label>
                                                                    {errors.Phone_EmailErrors !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone_EmailErrors}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 col-lg-4 pt-1  dropdown__box">
                                                                <Select
                                                                    name='VerifyID'
                                                                    styles={customStylesWithOutColor}
                                                                    isClearable
                                                                    value={verifyIdDrp?.filter((obj) => obj.value === value?.VerifyID)}
                                                                    options={verifyIdDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                                                                    placeholder="Select.."
                                                                />
                                                                <label htmlFor="" className='pt-1'>How Verify</label>

                                                            </div>
                                                            <div className="col-12">
                                                                {
                                                                    contactTypeCode === "E" ?
                                                                        <>
                                                                        </>
                                                                        :
                                                                        <div className="row ">
                                                                            <div className="col-6 col-md-4 col-lg-3 mt-2" >
                                                                                <div class="form-check "  >
                                                                                    <input class="form-check-input" type="checkbox" id="IsCurrentPh" onChange={handleChange} name='IsCurrentPh' value={value.IsCurrentPh} checked={value.IsCurrentPh} />
                                                                                    <label class="form-check-label" for="IsCurrentPh">
                                                                                        Current Phone
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-6 col-md-4 col-lg-3 mt-2" >
                                                                                <div class="form-check px-1" >
                                                                                    <input type="checkbox" name="IsInListedPh" checked={value.IsInListedPh} value={value.IsInListedPh}
                                                                                        onChange={handleChange}
                                                                                        // disabled={''}
                                                                                        id="IsInListedPh" />
                                                                                    <label className='ml-2' htmlFor="IsInListedPh">Unlisted Phone</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right mr-1 mb-2">
                                        {
                                            status ?
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} class="btn btn-sm btn-success mr-1">Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" onClick={closeModal} class="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default ContactDetails_Add_Up

const Get_Property_Code = (data, dropDownData) => {

    const result = data?.map((sponsor) => (sponsor.ContactTypeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}
