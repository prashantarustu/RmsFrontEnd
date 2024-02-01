import React, { useContext, useState } from 'react'
import { useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../../Common/Utility';
import { fetchData, fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { useLocation } from 'react-router-dom';
import { SSN_Field } from '../../../PersonnelCom/Validation/PersonnelValidation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Aliases_Add_Up = (props) => {

    const { nameID, MasterNameID, LoginPinID, LoginAgencyID, status, get_Aliases_Data, setModal, modal, NameAliasesID, updateStatus } = props
    const { get_Name_Count } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [Editval, setEditval] = useState();
    const [suffixIdDrp, setsuffixIdDrp] = useState([])
    const [DOB, setDOB] = useState();

    const [value, setValue] = useState({
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SuffixID': '', 'AliasSSN': '', 'DOB': '', 'ModifiedDtTm': "",
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
        "ModifiedByUserFK": ""
        //  'IsVerify': "",
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID } });
    }, [nameID, MasterNameID,updateStatus]);

    const [errors, setErrors] = useState({
        'LastNameErrors': '',
    })

    useEffect(() => {
        if (NameAliasesID) {
            GetSingleData(NameAliasesID)
        }
    }, [NameAliasesID])

    const GetSingleData = () => {
        const val = { 'NameAliasesID': NameAliasesID }
        fetchPostData('NameAliases/GetSingleData_NameAliases', val)
            .then((res) => {
                console.log(res)
                if (res) setEditval(res)
                else setEditval()
            }
            )
    }

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
        if (status) {
            setValue({
                ...value,
                'NameAliasesID': NameAliasesID, "NameAliasesID": Editval[0]?.NameAliasesID,
                'DOB': Editval[0]?.DOB ? getShowingDateText(Editval[0]?.DOB) : ' ', "LastName": Editval[0]?.LastName,
                'FirstName': Editval[0]?.FirstName, 'MiddleName': Editval[0]?.MiddleName, 'SuffixID': Editval[0]?.SuffixID,
                // 'IsVerify': Editval[0]?.IsVerify,
                'AliasSSN': Editval[0]?.AliasSSN,
                'ModifiedByUserFK': LoginPinID,
                'DOB': Editval[0]?.DOB ? getShowingWithOutTime(Editval[0]?.DOB) : '',
            });
            setDOB(Editval[0]?.DOB ? new Date(Editval[0]?.DOB) : '');
        }
        else {
            setValue({
                ...value,
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '', 'ModifiedByUserFK': '',
                // 'IsVerify': '',
            })
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '',
            //  'IsVerify': '',
        });
        setDOB("")
        setErrors({
            ...errors,
            'LastNameErrors': '',
        })
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldSpaceNotAllow(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameErrors']: RequiredFieldSpaceNotAllow(value.LastName) } })
        }
        // if (SSN_Field(value.SSN)) {
        //     setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
        //   }
        if (SSN_Field(value.AliasSSN)) {
            setErrors(prevValues => { return { ...prevValues, ['AliasSSN']: SSN_Field(value.AliasSSN) } })
        }
    }
    const { LastNameErrors, AliasSSN } = errors

    useEffect(() => {
        if (LastNameErrors === 'true' && AliasSSN === 'true') {
            if (status) update_Activity()
            else Add_Type()
        }
    }, [LastNameErrors, AliasSSN])

    useEffect(() => {
        GetSuffixIDDrp(LoginAgencyID);
    }, [LoginAgencyID])

    const GetSuffixIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setsuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            } else {
                setsuffixIdDrp([]);
            }
        })
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const Add_Type = (e) => {
        AddDeleteUpadate(openPage === 'mastername' ? 'MainMasterNameAliases/Insert_MainMasterNameAliases' : 'NameAliases/Insert_NameAliases', value).then((res) => {
            get_Aliases_Data(nameID, MasterNameID);
            get_Name_Count(nameID);
            setModal(false)
            toastifySuccess(res.Message);
            reset();
        })
    }

    const update_Activity = () => {
        AddDeleteUpadate('NameAliases/Update_NameAliases', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_Aliases_Data(nameID, MasterNameID)
            reset();
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    useEffect(() => {
        if (!status) {
        } else {
            setDOB('');
            setValue({
                ...value,
                ['DOB']: '',
            });
        }
    }, [])

    const handleChange = (e) => {
        if (e.target.name === "IsVerify") {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        }
        else if (e.target.name === 'AliasSSN') {
            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
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
                [e.target.name]: e.target.value,
            });
        }
    };

    const closeModal = () => {
        reset();
        setModal(false);
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
            minHeight: 32,
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
                                                <legend style={{ fontWeight: 'bold' }}>Aliases</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">

                                                            <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1">
                                                                <div class="text-field">
                                                                    <input type="text" className='requiredColor' name='LastName' value={value?.LastName} onChange={handleChange} required />
                                                                    <label>Last Name</label>
                                                                    {errors.LastNameErrors !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-4  mt-2 pt-1">
                                                                <div class="text-field">
                                                                    <input type="text" name='FirstName' value={value?.FirstName} onChange={handleChange} required />
                                                                    <label>First Name</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-6 col-lg-4  mt-2 pt-1">
                                                                <div class="text-field">
                                                                    <input type="text" name='MiddleName' value={value?.MiddleName} onChange={handleChange} required />
                                                                    <label>Middle Name</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 mt-1 pt-1 col-lg-4 mb-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='AliasSSN' value={value.AliasSSN} maxLength={9} onChange={handleChange} required />
                                                                    <label className=''>Alias SSN</label>
                                                                    {errors.AliasSSN !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AliasSSN}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">

                                                                <Select
                                                                    name='SuffixID'
                                                                    className='requiredColor'
                                                                    styles={customStylesWithOutColor}
                                                                    value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                                                    isClearable
                                                                    options={suffixIdDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' className='mt-1'>Suffix</label>

                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-4">
                                                                <div className=' dropdown__box'>
                                                                    <DatePicker
                                                                        id='DOB'
                                                                        name='DOB'
                                                                        className=''
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setDOB(date); setValue({ ...value, ['DOB']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        isClearable={value?.DOB ? true : false}
                                                                        selected={DOB}
                                                                        showDisabledMonthNavigation
                                                                        autoComplete="nope"
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        maxDate={new Date()}
                                                                        placeholderText={value?.DOB ? value.DOB : 'Select...'}

                                                                    />
                                                                    <label htmlFor="" className='pt-1'>DOB</label>
                                                                </div>
                                                            </div>

                                                            <div className="col-12 col-md-12 col-lg-2  pl-2">
                                                                <div class="form-check ">
                                                                    {/* <input class="form-check-input" type="checkbox" name='IsVerify' value={value.IsVerify} checked={value.IsVerify} onChange={handleChange} id="IsVerify" />
                                                                    <label class="form-check-label" for="IsVerify">
                                                                        Is Verify
                                                                    </label> */}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
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

export default Aliases_Add_Up

