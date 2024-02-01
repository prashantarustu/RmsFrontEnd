import React, { useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';


const AgencySetting = (props) => {

    const { aId, pinId } = props
    // console.log(props)
    const [ReportingTypeDrp, setRepotingTypeDrp] = useState([{ value: 1, label: 'UCR' }, { value: 2, label: 'NIBRS' }]);
    const [EditVal, setEditVal] = useState([])

    const [value, setValue] = useState({
        MaxAgeForJuvenile: "", ReportingTypeID: 1, BaseDate: "", ExpiryYear: "", SolvabilityRating: "", MaxAgeForStatutoryRape: "", MaxAgeForJuvenileByFederal_UCR_NIBRS: "",
        //checkBox
        IsEnhancedNameIndex: "", IsAliasReqForConsolidating: "", IsRMSCFSCode: "", IsReqHeightWeightArrest: "",
        //Ids
        ModifiedByUserFK: pinId,
        AgencyID: aId,
    });

    useEffect(() => {
        if (aId) { getAgencySettingData(aId); }
    }, [aId]);

    const getAgencySettingData = (aId) => {
        fetchPostData('Agency/GetData_SingleData', { 'AgencyID': aId }).then((res) => {
            // console.log(res);
            setEditVal(res)
        })
    }

    useEffect(() => {
        if (aId && EditVal?.length > 0) {
            setValue({
                ...value,
                MaxAgeForJuvenile: EditVal[0]?.MaxAgeForJuvenile, ReportingTypeID: EditVal[0]?.ReportingTypeID, BaseDate: EditVal[0]?.BaseDate, ExpiryYear: EditVal[0]?.ExpiryYear, SolvabilityRating: EditVal[0]?.SolvabilityRating, MaxAgeForStatutoryRape: EditVal[0]?.MaxAgeforStatutoryRape, MaxAgeForJuvenileByFederal_UCR_NIBRS: EditVal[0]?.MaxAgeForJuvenileByFederal_UCR_NIBRS,
                //checkBox
                IsEnhancedNameIndex: EditVal[0]?.IsEnhancedNameIndex, IsAliasReqForConsolidating: EditVal[0]?.IsAliasReqForConsolidating, IsRMSCFSCode: EditVal[0]?.IsRMSCFSCode, IsReqHeightWeightArrest: EditVal[0]?.IsReqHeightWeightArrest,
            });
        } else {
            setValue({
                ...value,
                MaxAgeForJuvenile: "", ReportingTypeID: "", BaseDate: "", ExpiryYear: "", SolvabilityRating: "", MaxAgeForStatutoryRape: "", MaxAgeForJuvenileByFederal_UCR_NIBRS: "",
                //checkBox
                IsEnhancedNameIndex: "", IsAliasReqForConsolidating: "", IsRMSCFSCode: "", IsReqHeightWeightArrest: "",
            })
        }
    }, [EditVal]);

    const updateAgencySetting = () => {
        AddDeleteUpadate('Agency/AgencyDetails', value).then((res) => {
            if (res?.success) {
                toastifySuccess(res?.Message);
                getAgencySettingData(aId)
            } else {
                console.log("Api Throw Error")
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            })
        }
    }

    const HandleChanges = (e) => {
        if (e) {
            if (e.target.name === "IsEnhancedNameIndex" || e.target.name === "IsAliasReqForConsolidating" || e.target.name === "IsRMSCFSCode" || e.target.name === "IsReqHeightWeightArrest") {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked
                })
            } else {
                setValue({
                    ...value,
                    [e.target.name]: e.target.value
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: " "
            })
        }
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // custuom style withoutColor
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

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };



    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Agency Setting</p>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="col-12  col-md-12 col-lg-10 mt-1" >
                            <div className="text-field">
                                <input type="text" name='MaxAgeForJuvenile' value={value?.MaxAgeForJuvenile} onChange={HandleChanges} className='' maxLength={2} required />
                                <label htmlFor="">Maximum Age For Juvenile</label>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-10  mt-4">
                            <div className=" dropdown__box">
                                <Select
                                    styles={customStylesWithOutColor}
                                    value={ReportingTypeDrp?.filter((obj) => obj.value === value?.ReportingTypeID)}
                                    options={ReportingTypeDrp}
                                    onChange={(e) => ChangeDropDown(e, 'ReportingTypeID')}
                                    name="ReportingTypeID"
                                    isClearable
                                    placeholder="Select..."
                                />
                                <label className='pl-0'>Reporting Type</label>
                            </div>
                        </div>
                        <div class="col-12  col-md-12 col-lg-10  mt-3">
                            <div className=" dropdown__box">
                                <DatePicker
                                    ref={startRef}
                                    onKeyDown={onKeyDown}
                                    id='BaseDate'
                                    name='BaseDate'
                                    className=''
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    onChange={(date) => { setValue({ ...value, ['BaseDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                    selected={value?.BaseDate && new Date(value?.BaseDate)}
                                    timeInputLabel
                                    isClearable={value?.BaseDate ? true : false}
                                    placeholderText={'Select...'}
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                />
                                <label htmlFor="" className='pt-1 pl-0'>Base Date</label>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-10   mt-4" >
                            <div className="text-field">
                                <input type="text" name='ExpiryYear' value={value?.ExpiryYear} onChange={HandleChanges} className='' maxLength={4} required />
                                <label htmlFor="">Expiry Year</label>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-10   mt-4" >
                            <div className="text-field">
                                <input type="text" name='SolvabilityRating' value={value?.SolvabilityRating} onChange={HandleChanges} maxLength={2} required />
                                <label htmlFor="">Solvability Rating</label>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-10   mt-4" >
                            <div className="text-field">
                                <input type="text" name='MaxAgeForStatutoryRape' value={value?.MaxAgeForStatutoryRape} onChange={HandleChanges} maxLength={2} required />
                                <label htmlFor="">Maximum Age For Statutory Rape</label>
                            </div>
                        </div>
                        <div className="col-12  col-md-12 col-lg-10   mt-4" >
                            <div className="text-field">
                                <input type="text" name='MaxAgeForJuvenileByFederal_UCR_NIBRS' value={value?.MaxAgeForJuvenileByFederal_UCR_NIBRS} onChange={HandleChanges} maxLength={2} required />
                                <label htmlFor="">Maximum Age For Juvenile Set By Federal UCR/NIBRS</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="col-12  col-md-12 col-lg-12  mt-3">
                            <input type="checkbox" name='IsEnhancedNameIndex' checked={value?.IsEnhancedNameIndex} value={value?.IsEnhancedNameIndex} onChange={HandleChanges} />
                            <label className='ml-2' >Enhanced Name Index</label>
                        </div>
                        <div className="col-12  col-md-12 col-lg-12  mt-4">
                            <input type="checkbox" name='IsAliasReqForConsolidating' checked={value?.IsAliasReqForConsolidating} value={value?.IsAliasReqForConsolidating} onChange={HandleChanges} />
                            <label className='ml-2' >Alias Requried For Consolidating</label>
                        </div>
                        <div className="col-12  col-md-12 col-lg-12  mt-4">
                            <input type="checkbox" name='IsRMSCFSCode' checked={value?.IsRMSCFSCode} value={value?.IsRMSCFSCode} />
                            <label className='ml-2' >Default RMS CFS Code To Offense Code - Yes/No</label>
                        </div>
                        <div className="col-12  col-md-12 col-lg-12  mt-4">
                            <input type="checkbox" name="IsReqHeightWeightArrest" checked={value?.IsReqHeightWeightArrest} value={value?.IsReqHeightWeightArrest} onChange={HandleChanges} />
                            <label className='ml-2' >Require Height & Weight for an Arrest? Yes/No</label>
                        </div>
                        <div className="col-12  col-md-12 col-lg-12 mt-4">
                            <input type="checkbox" name="EnableMaster" />
                            <label className='ml-2' >Enable Master Incident Field in Incident Screen for Input. Yes/No</label>
                        </div>
                    </div>
                    <div className="col-12 text-right mt-2 p-0">
                        <button type="button" onClick={() => { updateAgencySetting() }} className="btn btn-sm btn-success">Update</button>
                        {/* <button type="button" className="btn btn-sm btn-success mx-1" >Close</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgencySetting