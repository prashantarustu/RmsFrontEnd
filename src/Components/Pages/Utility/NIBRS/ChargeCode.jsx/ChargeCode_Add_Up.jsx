import React from 'react';
import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import SelectBox from '../../../../Common/SelectBox';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredField } from '../../Personnel/Validation';
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';

const Option = props => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <p className='ml-2 d-inline'>{props.label}</p>
            </components.Option>
        </div>
    );
};

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const animatedComponents = makeAnimated()


const ChargeCode_Add_Up = (props) => {

    const { LoginPinID, IsSuperadmin, LoginAgencyID, singleTypeId, status, get_data, DataList, modal, setModal, updateStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [CategoryDropDownVal, setCategoryDropDownVal] = useState([])
    const [DegreeDrpDwnVal, setDegreeDrpDwnVal] = useState([])
    const [ChargeClsDrpDwnVal, setChargeClsDrpDwnVal] = useState([])
    const [UcrArrestDrpDwnVal, setUcrArrestDrpDwnVal] = useState([])
    const [lawTitleDrpDwnVal, setlawTitleDrpDwnVal] = useState([])
    const [FBIDrpDwnVal, setFBIDrpDwnVal] = useState([])
    const [UCRDrpDwnVal, setUCRDrpDwnVal] = useState([])
    const [ChargeGrpDrpDwnVal, setChargeGrpDrpDwnVal] = useState([])
    const [Editval, setEditval] = useState();


    const [value, setValue] = useState({
        'ChargeCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'ChargeCodeID': '', 'StateCD': '',
        'UniqueCharge': '', 'MandatoryHours': '', 'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '',
        'ShortDescription': '', 'IsEditable': 1,
        // DropDown
        'CategoryID': '', 'CategoryName': '',
        'DegreeID': '', 'DegreeName': '',
        'ChargeClassID': '', 'ChargeClassName': '',
        'UCRArrestID': '', 'UCRArrestName': '',
        'LawTitleID': '', 'LawTitleName': '',
        'FBIID': '', 'FBIName': '',
        'UCRCodeID': '', 'UCRCodeName': '',
        'ChargeGroupID': '', 'ChargeGroupName': '',
        // checkbox
        'IsWarrantCode': '', 'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsParking': '',
        'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '',
        'IsDomesticViolenceCrime': '', 'IsConditionalRelease': '', 'IsCADCfsCode': '',

    });

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    // useEffect(() => {
    //     // if (modal) getAgency(LoginAgencyID, LoginPinID);
    //     if (agencyData?.length === 0 && modal) {
    //         if (LoginPinID && LoginAgencyID) {
    //             getAgency(LoginAgencyID, LoginPinID);
    //             setValue({ ...value, 'AgencyID': LoginAgencyID, 'CreatedByUserFK': LoginPinID, })
    //         }
    //     }
    // }, [modal, LoginAgencyID])

    useEffect(() => {
        // if (modal) getAgency(LoginAgencyID, LoginPinID);
        if (agencyData?.length === 0 && modal) {
            if (LoginPinID && LoginAgencyID) {
                getAgency(LoginAgencyID, LoginPinID);
                setValue({ ...value, 'CreatedByUserFK': LoginPinID, })
            }
        }
    }, [modal, LoginAgencyID])


    useEffect(() => {
        if (singleTypeId) {
            GetSingleData()
        }
    }, [singleTypeId, updateStatus])

    const GetSingleData = () => {
        const val = { 'ChargeCodeID': singleTypeId }
        fetchPostData('ChargeCodes/GetSingleData_ChargeCodes', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else setEditval()
            })
    }

    useEffect(() => {
        getCategoryDropVal('ChargeCategory/GetDataDropDown_ChargeCategory', LoginAgencyID);
        getDegreeDropVal('ChargeDegree/GetDataDropDown_ChargeDegree', LoginAgencyID);
        getChargeClassDropVal('ChargeClass/GetDataDropDown_ChargeClass', LoginAgencyID);
        getUCRArrestDropVal('UCRArrest/GetDataDropDown_UCRArrest', LoginAgencyID);
        lawTitleDropVal('LawTitle/GetDataDropDown_LawTitle', LoginAgencyID)
        FBIDropVal('FBICodes/GetDataDropDown_FBICodes', LoginAgencyID);
        UCRDropVal('UCRCodes/GetDataDropDown_UCRCodes', LoginAgencyID);
        ChargeGroupDropVal('ChargeGroup/GetDataDropDown_ChargeGroup', LoginAgencyID);
    }, [LoginAgencyID])

    const getCategoryDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setCategoryDropDownVal(changeArrayFormat(data, 'CategoryVal'))
            } else {
                setCategoryDropDownVal();
            }
        })
    }

    const getDegreeDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setDegreeDrpDwnVal(changeArrayFormat(data, 'DegreeVal'))
            } else {
                setDegreeDrpDwnVal();
            }
        })
    }

    const getChargeClassDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setChargeClsDrpDwnVal(changeArrayFormat(data, 'ChargeClassVal'))
            } else {
                setChargeClsDrpDwnVal();
            }
        })
    }

    const getUCRArrestDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {

            if (data) {
                setUcrArrestDrpDwnVal(changeArrayFormat(data, 'UcrArrestVal'))
            } else {
                setUcrArrestDrpDwnVal();
            }
        })
    }

    const UCRDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setUCRDrpDwnVal(changeArrayFormat(data, 'UcrVal'))
            } else {
                setUCRDrpDwnVal();
            }
        })
    }

    const lawTitleDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setlawTitleDrpDwnVal(changeArrayFormat(data, 'LawTitleVal'))
            } else {
                setlawTitleDrpDwnVal();
            }
        })
    }

    const FBIDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setFBIDrpDwnVal(Comman_changeArrayFormat(data, 'FBIID', 'Description'))
            } else {
                setFBIDrpDwnVal();
            }
        })
    }

    const ChargeGroupDropVal = (Url, LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setChargeGrpDrpDwnVal(changeArrayFormat(data, 'ChargeGrpVal'))
            } else {
                setChargeGrpDrpDwnVal();
            }
        })
    }

    const changeDropDown = (e, name) => {
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
        if (status) {
            setValue({
                ...value,
                "ChargeCode": Editval[0]?.ChargeCode, 'IsActive': Editval[0]?.IsActive,
                "Description": Editval[0]?.Description,
                'AgencyCode': Editval[0]?.AgencyCode,
                //Dropdown
                'CategoryID': Editval[0]?.CategoryID, 'CategoryName': Editval[0]?.CategoryID ? changeArrayFormat_WithFilter(Editval, 'CategoryVal', CategoryDropDownVal) : '',
                'DegreeID': Editval[0]?.DegreeID, 'DegreeName': Editval[0]?.DegreeID ? changeArrayFormat_WithFilter(Editval, 'DegreeVal', DegreeDrpDwnVal) : '',
                'ChargeClassID': Editval[0]?.ChargeClassID, 'ChargeClassName': Editval[0]?.ChargeClassID ? changeArrayFormat_WithFilter(Editval, 'ChargeClassVal', ChargeClsDrpDwnVal) : '',
                'UCRArrestID': Editval[0]?.UCRArrestID, 'UCRArrestName': Editval[0]?.UCRArrestID ? changeArrayFormat_WithFilter(Editval, 'UcrArrestVal', UcrArrestDrpDwnVal) : '',
                'LawTitleID': Editval[0]?.LawTitleID, 'LawTitleName': Editval[0]?.LawTitleID ? changeArrayFormat_WithFilter(Editval, 'LawTitleVal', lawTitleDrpDwnVal) : '',
                'FBIID': Editval[0]?.FBIID, 'FBIName': Editval[0]?.FBIID ? changeArrayFormat_WithFilter(Editval, 'FBIVal', FBIDrpDwnVal) : '',
                'UCRCodeID': Editval[0]?.UCRCodeID, 'UCRCodeName': Editval[0]?.UCRCodeID ? changeArrayFormat_WithFilter(Editval, 'UcrVal', UCRDrpDwnVal) : '',
                'ChargeGroupID': Editval[0]?.ChargeGroupID, 'ChargeGroupName': Editval[0]?.ChargeGroupID ? changeArrayFormat_WithFilter(Editval, 'ChargeGrpVal', ChargeGrpDrpDwnVal) : '',
                'UniqueCharge': Editval[0]?.UniqueCharge, 'IsEditable': Editval[0]?.IsEditable === '0' ? false : true,
                'MandatoryHours': Editval[0]?.MandatoryHours, 'Junsdiction': Editval[0]?.Junsdiction, 'CitationFine': Editval[0]?.CitationFine, 'StateOrdinalCode': Editval[0]?.StateOrdinalCode,
                'ShortDescription': Editval[0]?.ShortDescription, 'IsNeedsDNATaken': Editval[0]?.IsNeedsDNATaken, 'IsProbation': Editval[0]?.IsProbation,
                'IsAutoHold': Editval[0]?.IsAutoHold, 'LC': Editval[0]?.LC, 'ModifiedByUserFK': LoginPinID,
                'Subsection': Editval[0]?.Subsection, 'IsWarrantCode': Editval[0]?.IsWarrantCode, 'IsBondDenied': Editval[0]?.IsBondDenied, 'IsParoleViolation': Editval[0]?.IsParoleViolation,
                'IsAssaultive': Editval[0]?.IsAssaultive, 'IsParking': Editval[0]?.IsParking, 'IsTicketCode': Editval[0]?.IsTicketCode, 'IsNjeTicket': Editval[0]?.IsNjeTicket,
                'IsArrestCode': Editval[0]?.IsArrestCode, 'IsETicketDieselInd': Editval[0]?.IsETicketDieselInd, 'IsReportable': Editval[0]?.IsReportable,
                'IsDomesticViolenceCrime': Editval[0]?.IsDomesticViolenceCrime, 'IsConditionalRelease': Editval[0]?.IsConditionalRelease,
                'IsCADCfsCode': Editval[0]?.IsCADCfsCode, 'StateCD': Editval[0]?.StateCD,
                'ChargeCodeID': Editval[0]?.ChargeCodeID, 'MultiAgency_Name': Editval[0]?.MultiAgency_Name,
                'AgencyID': Editval[0]?.AgencyID, 'ModifiedByUserFK': LoginPinID,
                'AgencyName': Editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(Editval[0]?.MultipleAgency) : '',
                'IsOffenseCode': Editval[0]?.IsOffenseCode,
            });
            setSelected({
                optionSelected: Editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(Editval[0]?.MultipleAgency
                ) : '',
            });
        }
        else {
            setValue({
                ...value,
                'ChargeCode': '', 'AgencyCode': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1',
                'ChargeCodeID': '', 'DegreeID': '', 'ChargeClassID': '', 'UCRArrestID': '', 'LawTitleID': '', 'FBIID': '', 'UCRCodeID': '', 'ChargeGroupID': '',
                'StateCD': '', 'UniqueCharge': '', 'MandatoryHours': '', 'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '',
                'ShortDescription': '', 'IsEditable': 0,
                // DropDown
                'CategoryID': '', 'CategoryName': '',
                'DegreeID': '', 'DegreeName': '',
                'ChargeClassID': '', 'ChargeClassName': '',
                'UCRArrestID': '', 'UCRArrestName': '',
                'LawTitleID': '', 'LawTitleName': '',
                'FBIID': '', 'FBIName': '',
                'UCRCodeID': '', 'UCRCodeName': '',
                'ChargeGroupID': '', 'ChargeGroupName': '',
                //chackbox
                'IsWarrantCode': '', 'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsAutoHold': '',
                'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '', 'IsDomesticViolenceCrime': '',
                'IsConditionalRelease': '', 'IsCADCfsCode': '',
            });
            setSelected({ optionSelected: null })
        }
    }, [Editval])

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

    const reset = () => {
        setValue({
            ...value,
            'ChargeCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0,
            'ModifiedByUserFK': '', 'AgencyName': '', 'DegreeID': '', 'UCRArrestID': '',
            'LawTitleID': '', 'FBIID': '', 'UCRCodeID': '', 'ChargeGroupID': '', 'StateCD': '', 'UniqueCharge': '', 'MandatoryHours': '',
            'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '', 'ShortDescription': '', 'IsWarrantCode': '',
            'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsAutoHold': '', 'IsParking': '',
            'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '', 'IsDomesticViolenceCrime': '', 'IsConditionalRelease': '', 'IsCADCfsCode': '',
            // DropDown
            'CategoryID': '', 'CategoryName': '',
            'DegreeID': '', 'DegreeName': '',
            'ChargeClassID': '', 'ChargeClassName': '',
            'UCRArrestID': '', 'UCRArrestName': '',
            'LawTitleID': '', 'LawTitleName': '',
            'FBIID': '', 'FBIName': '',
            'UCRCodeID': '', 'UCRCodeName': '',
            'ChargeGroupID': '', 'ChargeGroupName': '',
        });
        setSelected({ optionSelected: null })

        setErrors({
            'CodeError': '',
            'DescriptionError': '',
        })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'IsEditable' || e.target.name === 'IsCADCfsCode' || e.target.name === 'IsWarrantCode' || e.target.name === 'IsBondDenied' || e.target.name === 'IsParoleViolation' || e.target.name === 'IsAssaultive' || e.target.name === 'IsNeedsDNATaken' || e.target.name === 'IsProbation' || e.target.name === 'IsAutoHold' || e.target.name === 'IsParking' || e.target.name === 'IsTicketCode' || e.target.name === 'IsNjeTicket' || e.target.name === 'IsArrestCode' || e.target.name === 'IsOffenseCode' || e.target.name === 'IsETicketDieselInd' || e.target.name === 'IsReportable' || e.target.name === 'IsDomesticViolenceCrime' || e.target.name === 'IsConditionalRelease') {
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

    const [Selected, setSelected] = useState({
        optionSelected: null
    })
    const Agencychange = (selected) => {
        setSelected({ optionSelected: selected });
        var id = []
        var name = []
        if (selected) {
            selected.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }
    const getAgency = async (LoginAgencyID, LoginPinID) => {
        const value = {
            AgencyID: LoginAgencyID,
            PINID: LoginPinID
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_Type = (e) => {
        var result = DataList?.find(item => {
            if (item.ChargeCode === value.ChargeCode) {
                return true
            } else return false
        }
        );
        var result1 = DataList?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('ChargeCodes/InsertChargeCodes', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_data(LoginAgencyID, LoginPinID, IsSuperadmin);
                reset();
            })
        }
    }

    const update_Type = () => {
        var result = DataList?.find(item => {
            if (item.ChargeCodeID != singleTypeId) {
                if (item.ChargeCode === value.ChargeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = DataList?.find(item => {
            if (item.ChargeCodeID != singleTypeId) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('ChargeCodes/UpdateChargeCodes', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data(LoginAgencyID, LoginPinID, IsSuperadmin);
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ChargeCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: RequiredField(value.ChargeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { CodeError, DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CodeError === 'true') {
            if (status) update_Type()
            else Add_Type()
        }
    }, [CodeError, DescriptionError])

    const closeModal = () => {
        reset();
        setModal(false);
    }


    const HandleChanges = (e) => {
        if (e.target.name === 'CitationFine' || e.target.name === 'MandatoryHours') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }


    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CFSModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-xl modal-dialog-centered rounded" role="document">
                            <div class="modal-content" style={{ marginTop: '-20px', marginBottom: '-20px' }}>
                                <div class="modal-body" >
                                    <div className=" ">
                                        <fieldset style={{ border: '1px solid gray', marginTop: '-12px' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Charge Code</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-2 col-lg-2 ">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='ChargeCode' onChange={handlChanges}
                                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} className='requiredColor' value={value.ChargeCode} />
                                                        <label>Code</label>
                                                        {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-2 ">
                                                    <div class="text-field">
                                                        <input type="text" name='AgencyCode' disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-7 col-lg-8 ">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' name='Description' disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  dropdown__box">
                                                    {
                                                        value?.CategoryName ?
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                defaultValue={value?.CategoryName}
                                                                options={CategoryDropDownVal}
                                                                onChange={(e) => changeDropDown(e, 'CategoryID')}
                                                                placeholder="Category"
                                                            />
                                                            : <>
                                                                <Select
                                                                    name='CategoryID'
                                                                    isClearable
                                                                    options={CategoryDropDownVal}
                                                                    onChange={(e) => changeDropDown(e, 'CategoryID')}
                                                                    placeholder="Category"
                                                                />
                                                            </>
                                                    }
                                                    <label htmlFor="" className='pt-1'>Category</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  dropdown__box">
                                                    {
                                                        value?.DegreeName ?
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                defaultValue={value?.DegreeName}
                                                                options={DegreeDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'DegreeID')}
                                                                placeholder="Degree"
                                                            />
                                                            : <>
                                                                <Select
                                                                    name='CategoryID'
                                                                    isClearable
                                                                    options={DegreeDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'DegreeID')}
                                                                    placeholder="Degree"
                                                                />
                                                            </>
                                                    }
                                                    <label htmlFor="" className='pt-1'>Degree</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3   dropdown__box">
                                                    {
                                                        value?.ChargeClassName ?
                                                            <Select
                                                                name='ChargeClassID'
                                                                isClearable
                                                                defaultValue={value?.ChargeClassName}
                                                                options={ChargeClsDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'ChargeClassID')}
                                                                placeholder="Charge Class"
                                                            />
                                                            : <>
                                                                <Select
                                                                    name='ChargeClassID'
                                                                    isClearable
                                                                    options={ChargeClsDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'ChargeClassID')}
                                                                    placeholder="Charge Class"
                                                                />
                                                            </>
                                                    }
                                                    <label htmlFor="" className='pt-1'>Charge Class</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  dropdown__box">
                                                    {
                                                        value?.UCRArrestName ?
                                                            <Select
                                                                name='UCRArrestID'
                                                                isClearable
                                                                defaultValue={value?.UCRArrestName}
                                                                options={UcrArrestDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'UCRArrestID')}
                                                                placeholder="Ucr Arrest"
                                                            />
                                                            : <>
                                                                <Select
                                                                    name='UCRArrestID'
                                                                    isClearable
                                                                    options={UcrArrestDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'UCRArrestID')}
                                                                    placeholder="Ucr Arrest"
                                                                />
                                                            </>
                                                    }
                                                    <label htmlFor="" className='pt-1'>UCR Arrest</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  pt-1 mt-1 ">
                                                    <div className="dropdown__box ">
                                                        {
                                                            value?.LawTitleName ?
                                                                <Select
                                                                    name='LawTitleID'
                                                                    isClearable
                                                                    defaultValue={value?.LawTitleName}
                                                                    options={lawTitleDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'LawTitleID')}
                                                                    placeholder="Law Title"
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='LawTitleID'
                                                                        isClearable
                                                                        options={lawTitleDrpDwnVal}
                                                                        onChange={(e) => changeDropDown(e, 'LawTitleID')}
                                                                        placeholder="Law Title"
                                                                    />
                                                                </>
                                                        }
                                                        <label htmlFor="" className=''>Law Title</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 pt-1 mt-1 ">
                                                    <div className="dropdown__box">
                                                        {
                                                            value?.FBIName ?
                                                                <Select
                                                                    name='FBIID'
                                                                    isClearable
                                                                    defaultValue={value?.FBIName}
                                                                    options={FBIDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'FBIID')}
                                                                    placeholder="Law Title"
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='FBIID'
                                                                        isClearable
                                                                        options={FBIDrpDwnVal}
                                                                        onChange={(e) => changeDropDown(e, 'FBIID')}
                                                                        placeholder="FBI ID"
                                                                    />
                                                                </>
                                                        }
                                                        <label htmlFor="" className=''>FBI ID</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 pt-1 mt-1">
                                                    <div className=" dropdown__box">
                                                        {
                                                            value?.UCRCodeName ?
                                                                <Select
                                                                    name='UCRCodeID'
                                                                    isClearable
                                                                    defaultValue={value?.UCRCodeName}
                                                                    options={UCRDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'UCRCodeID')}
                                                                    placeholder="UCR Code"
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='UCRCodeID'
                                                                        isClearable
                                                                        options={UCRDrpDwnVal}
                                                                        onChange={(e) => changeDropDown(e, 'UCRCodeID')}
                                                                        placeholder="UCR Code"
                                                                    />
                                                                </>
                                                        }
                                                        <label htmlFor="" className=''>UCR Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  pt-1 mt-1">
                                                    <div className="dropdown__box ">
                                                        {
                                                            value?.ChargeGroupName ?
                                                                <Select
                                                                    name='ChargeGroupID'
                                                                    isClearable
                                                                    defaultValue={value?.ChargeGroupName}
                                                                    options={ChargeGrpDrpDwnVal}
                                                                    onChange={(e) => changeDropDown(e, 'ChargeGroupID')}
                                                                    placeholder="Charge Group"
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='ChargeGroupID'
                                                                        isClearable
                                                                        options={ChargeGrpDrpDwnVal}
                                                                        onChange={(e) => changeDropDown(e, 'ChargeGroupID')}
                                                                        placeholder="Charge Group"
                                                                    />
                                                                </>
                                                        }
                                                        <label htmlFor="" className=''>Charge Group</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={''} name='StateCD' onChange={handlChanges} value={value.StateCD} />
                                                        <label>State CD</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='UniqueCharge' onChange={handlChanges} value={value.UniqueCharge} />
                                                        <label>Unique Charge</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='MandatoryHours' onChange={HandleChanges} value={value.MandatoryHours} />
                                                        <label>Mandatory Hours</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='Subsection' onChange={handlChanges} value={value.Subsection} />
                                                        <label>Subsection</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='StateOrdinalCode' onChange={handlChanges} value={value.StateOrdinalCode} />
                                                        <label>State Ordinal Code</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='CitationFine' onChange={HandleChanges} value={value.CitationFine} />
                                                        <label>Citation Fine</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='LC' onChange={handlChanges} value={value.LC} />
                                                        <label>LC</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='Junsdiction' onChange={handlChanges} value={value.Junsdiction} />
                                                        <label>Junsdiction</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='ShortDescription' onChange={handlChanges} value={value.ShortDescription} />
                                                        <label>Short Description</label>
                                                        {/* {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null} */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box pt-1">
                                                    <SelectBox
                                                        options={agencyData}
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        components={{ Option, MultiValue, animatedComponents }}
                                                        onChange={Agencychange}
                                                        allowSelectAll={true}
                                                        value={Selected.optionSelected}
                                                    />
                                                    <label className='pt-1'>Agency</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3">
                                                    <input type="checkbox" name="IsWarrantCode" checked={value.IsWarrantCode} value={value.IsWarrantCode}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsWarrantCode" />
                                                    <label className='ml-2' htmlFor="IsWarrantCode">Is Warrant Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsBondDenied" checked={value.IsBondDenied} value={value.IsBondDenied}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsBondDenied" />
                                                    <label className='ml-2' htmlFor="IsBondDenied">Is Bond Denied</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsParoleViolation" checked={value.IsParoleViolation} value={value.IsParoleViolation}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsParoleViolation" />
                                                    <label className='ml-2' htmlFor="IsParoleViolation">Is Parole Violation</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsAssaultive" checked={value.IsAssaultive} value={value.IsAssaultive}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsAssaultive" />
                                                    <label className='ml-2' htmlFor="IsAssaultive">Is Assaultive</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsNeedsDNATaken" checked={value.IsNeedsDNATaken} value={value.IsNeedsDNATaken}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsNeedsDNATaken" />
                                                    <label className='ml-2' htmlFor="IsNeedsDNATaken">Is Needs DNA Taken</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsProbation" checked={value.IsProbation} value={value.IsProbation}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsProbation" />
                                                    <label className='ml-2' htmlFor="IsProbation">Is Probation</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsAutoHold" checked={value.IsAutoHold} value={value.IsAutoHold}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsAutoHold" />
                                                    <label className='ml-2' htmlFor="IsAutoHold">Is Auto Hold</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsParking" checked={value.IsParking} value={value.IsParking}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsParking" />
                                                    <label className='ml-2' htmlFor="IsParking">Is Parking</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsTicketCode" checked={value.IsTicketCode} value={value.IsTicketCode}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsTicketCode" />
                                                    <label className='ml-2' htmlFor="IsTicketCode">Is Ticket Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsNjeTicket" checked={value.IsNjeTicket} value={value.IsNjeTicket}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsNjeTicket" />
                                                    <label className='ml-2' htmlFor="IsNjeTicket">Is Nje Ticket</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3">
                                                    <input type="checkbox" name="IsArrestCode" checked={value.IsArrestCode} value={value.IsArrestCode}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsArrestCode" />
                                                    <label className='ml-2' htmlFor="IsArrestCode">Is Arrest Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsOffenseCode" checked={value.IsOffenseCode} value={value.IsOffenseCode}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsOffenseCode" />
                                                    <label className='ml-2' htmlFor="IsOffenseCode">Is Offense Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsETicketDieselInd" checked={value.IsETicketDieselInd} value={value.IsETicketDieselInd}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsETicketDieselInd" />
                                                    <label className='ml-2' htmlFor="IsETicketDieselInd">Is ETicket Diesel Ind</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsReportable" checked={value.IsReportable} value={value.IsReportable}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsReportable" />
                                                    <label className='ml-2' htmlFor="IsReportable">Is Reportable</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsDomesticViolenceCrime" checked={value.IsDomesticViolenceCrime} value={value.IsDomesticViolenceCrime}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsDomesticViolenceCrime" />
                                                    <label className='ml-2' htmlFor="IsDomesticViolenceCrime">Is Domestic Violence Crime</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsConditionalRelease" checked={value.IsConditionalRelease} value={value.IsConditionalRelease}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsConditionalRelease" />
                                                    <label className='ml-2' htmlFor="IsConditionalRelease">Is Conditional Release</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsCADCfsCode" checked={value.IsCADCfsCode} value={value.IsCADCfsCode}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsCADCfsCode" />
                                                    <label className='ml-2' htmlFor="IsCADCfsCode">Is CAD CFS Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                                        onChange={handlChanges}
                                                        // disabled={''}
                                                        id="IsCADCfsCode" />
                                                    <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right pt-1  mr-1" style={{ marginBottom: '-13px' }}>
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

export default ChargeCode_Add_Up;

export const changeArrayFormat = (data, type) => {
    if (type === 'ChargeGrpVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeGroupID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'UcrVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UCRCodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'FBIVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.FBICodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'LawTitleVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.LawTitleID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'CategoryVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeCategoryID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'UcrArrestVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UCRArrestID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'ChargeClassVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeClassID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'DegreeVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeDegreeID, label: sponsor.Description })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, firstDropDownValue) => {
    if (type === 'ChargeGrpVal') {
        const result = data?.map((sponsor) =>
            (sponsor.ChargeGroupID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'UcrVal') {
        const result = data?.map((sponsor) =>
            (sponsor.UCRCodeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'FBIVal') {
        const result = data?.map((sponsor) =>
            (sponsor.FBIID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'LawTitleVal') {
        const result = data?.map((sponsor) =>
            (sponsor.LawTitleID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'CategoryVal') {
        const result = data?.map((sponsor) =>
            (sponsor.CategoryID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'UcrArrestVal') {
        const result = data?.map((sponsor) =>
            (sponsor.UCRArrestID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'ChargeClassVal') {
        const result = data?.map((sponsor) =>
            (sponsor.ChargeClassID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'DegreeVal') {
        const result = data?.map((sponsor) =>
            (sponsor.DegreeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    } else {
        const result = data.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }
}