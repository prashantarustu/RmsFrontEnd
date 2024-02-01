import React, { useContext } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../../../Common/Utility';
import { RequiredField } from '../../../../../Utility/Personnel/Validation';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';

const Penalties = ({ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }) => {

    const { setIncStatus, updateCount, setUpdateCount } = useContext(AgencyContext);    

    const navigate = useNavigate();
    const [ftaDate, setftadate] = useState();
    const [ArrestChargeID, setArrestChargeID] = useState();
    
    const [Editval, setEditval] = useState();

    const [value, setValue] = useState({
        'Fine': '',
        'CourtCost': '',
        'OtherCost': '',
        'FTADate': '',
        'FTAAmount': '',
        'LitigationTax': '',
        'TotalPenalty': '',
        'Comments': '',
        'Years': '',
        'Months': '',
        'Days': '',
        'ChargePenaltyID': '',
        'ChargeID': ChargeID ,
        'CreatedByUserFK': LoginPinID,
        'ModifiedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'FineError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredField(value.Fine)) {
            setErrors(prevValues => { return { ...prevValues, ['FineError']: RequiredField(value.Fine) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { FineError } = errors

    useEffect(() => {
        if (FineError === 'true') {
            if (ArrestChargeID) update_Charge_Penalties()
            else Insert_Penalties()
        }
    }, [FineError])

    useEffect(() => {
        if (ChargeID) {
            setArrestChargeID(ChargeID)
        } else {
            setArrestChargeID();
        }
    }, [updateCount])

    useEffect(() => {
        if (ArrestChargeID) {
            GetSingleData(ArrestChargeID)
        }
    }, [ArrestChargeID])

    const GetSingleData = (ArrestChargeID) => {
        const val = { 'ChargeID': ArrestChargeID, }
        fetchPostData('ChargePenalty/GetSingleData_ChargePenalty', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                } else { setEditval() }
            })
    }

    useEffect(() => {
        if (ArrestChargeID) {
            console.log(Editval[0]?.Comments);
            setValue({
                ...value,
                'Fine': Editval[0]?.Fine ? Editval[0]?.Fine : '',
                'CourtCost': Editval[0]?.CourtCost ? Editval[0]?.CourtCost : '',
                'OtherCost': Editval[0]?.OtherCost ? Editval[0]?.OtherCost : '',
                'FTADate': Editval[0]?.FTADate ? getShowingDateText(Editval[0]?.FTADate) : '',
                'FTAAmount': Editval[0]?.FTAAmount ? Editval[0]?.FTAAmount : '',
                'LitigationTax': Editval[0]?.LitigationTax ? Editval[0]?.LitigationTax : '',
                'TotalPenalty': Editval[0]?.TotalPenalty ? Editval[0]?.TotalPenalty : '',
                'Comments': Editval[0]?.Comments,
                'Years': Editval[0]?.Years,
                'Months': Editval[0]?.Months,
                'Days': Editval[0]?.Days,
                'ModifiedByUserFK': LoginPinID,
            })
            setftadate(Editval[0]?.FTADate ? new Date(Editval[0]?.FTADate) : "")
        } else {
            setValue({
                ...value,
                'Fine': '',
                'CourtCost': '',
                'OtherCost': '',
                'FTADate': '',
                'FTAAmount': '',
                'LitigationTax': '',
                'TotalPenalty': '',
                'Comments': '',
                'Years': '',
                'Months': '',
                'Days': '',
            })
        }
    }, [Editval])

    const handlChanges = (e) => {
        if (e.target.name === 'Fine' || e.target.name === 'Years' || e.target.name === 'LitigationTax' || e.target.name === 'FTAAmount' || e.target.name === 'OtherCost' || e.target.name === 'CourtCost') {
            // var ele = e.target.value.replace(/[^0-9.]/g, "")
            // if (ele.length === 10) {
            //     console.log(ele);
            //     var cleaned = ('' + ele).replace(/[^0-9.]/g, '');
            //     setValue({
            //         ...value,
            //         [e.target.name]:  cleaned
            //     });
            // } else {
            //     ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
            //     setValue({
            //         ...value,
            //         [e.target.name]: ele
            //     });
            // }   
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    // setChangesStatus(true)    
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    // setChangesStatus(true)
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
                if (ele.length === 16) {
                    // setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                } else {
                    // setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                }
            }
        } else if (e.target.name === 'Months') {
            if (e.target.value <= 11) {
                setValue({
                    ...value,
                    ['Months']: e.target.value
                })
            }
        } else if (e.target.name === 'Days') {
            if (e.target.value <= 30) {
                setValue({
                    ...value,
                    ['Days']: e.target.value
                })
            }

        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })

        }
    }

    const Insert_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Insert_ChargePenalty', value).then((res) => {
            toastifySuccess(res.Message)
            setUpdateCount(updateCount + 1)
            setErrors({
                ...errors,
                ['FineError']: ''
            })
        })
    }

    const update_Charge_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Update_ChargePenalty', value).then((res) => {
            toastifySuccess(res.Message);
            setErrors({
                ...errors,
                ['FineError']: ''
            })
        })
    }

    useEffect(() => {
        Sum();
    }, [value?.Fine, value?.OtherCost, value?.CourtCost, value?.FTAAmount, value?.LitigationTax])

    const Sum = () => {
        let total = "";
        let fineNum = value?.Fine ? value?.Fine : 0
        let OtherCostNum = value?.OtherCost ? value?.OtherCost : 0
        let CourtCostNum = value?.CourtCost ? value?.CourtCost : 0
        let FTAAmountNum = value?.FTAAmount ? value?.FTAAmount : 0
        let LitigationTaxNum = value?.LitigationTax ? value?.LitigationTax : 0
        total += parseFloat(fineNum) + parseFloat(OtherCostNum) + parseFloat(CourtCostNum) + parseFloat(FTAAmountNum) + parseFloat(LitigationTaxNum);
        setValue({
            ...value,
            // ['TotalPenalty']: `\$ ${total}`
            ['TotalPenalty']: total
        })
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
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    const OnClose = () => {
        navigate('/warrant-tab')
    }

    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Penalties</p>
                </div>
                <div className="row ">
                    <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Fine' id='Fine' maxLength={17} onChange={handlChanges} value={`\$ ${value?.Fine}`} />
                            <label htmlFor="">Fine</label>
                            {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='CourtCost' id='CourtCost' maxLength={17} onChange={handlChanges} value={`\$ ${value?.CourtCost}`} />
                            <label htmlFor="">Court Cost</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='OtherCost' id='OtherCost' maxLength={17} onChange={handlChanges} value={`\$ ${value?.OtherCost}`} />
                            <label htmlFor="">Other Cost</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                            id='FTADate'
                            name='FTADate'
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            onChange={(date) => { setftadate(date); setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null }) }}
                            className=''
                            dateFormat="MM/dd/yyyy"
                            isClearable={value?.FTADate ? true : false}
                            selected={ftaDate}
                            placeholderText={'Select...'}
                            timeInputLabel
                            autoComplete="nope"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                        />
                        <label htmlFor="">FTA Date</label>
                    </div>
                    <div className="col-7  col-md-4 col-lg-2  mt-3" >
                        <div className="text-field">
                            <input type="text" name='FTAAmount' id='FTAAmount' maxLength={17} onChange={handlChanges} value={`\$ ${value?.FTAAmount}`} />
                            <label htmlFor="" >FTA Amount</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-2  mt-3" >
                        <div className="text-field">
                            <input type="text" name='LitigationTax' id='LitigationTax' maxLength={17} onChange={handlChanges} value={`\$ ${value?.LitigationTax}`} />
                            <label htmlFor="" >Litigation Tax</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-2  mt-3" >
                        <div className="text-field">
                            <input type="text" name='TotalPenalty' id='TotalPenalty' maxLength={17} value={`\$ ${value?.TotalPenalty}`} readOnly />
                            <label htmlFor="" >Total Penalty</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-6  mt-2 pt-1  " >
                        <div className=" dropdown__box">
                            <textarea name='Comments' id='Comments' value={value?.Comments} onChange={handlChanges} cols="30" rows='1' className="form-control">
                            </textarea>
                            <label htmlFor="">Comments</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 pt-1 p-0" >
                        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                            <p className="p-0 m-0">Sentence</p>
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Years' id='Years' maxLength={4} onChange={handlChanges} value={value?.Years} />
                            <label htmlFor="">Yrs</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>

                    <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Months' id='Months' maxLength={3} onChange={handlChanges} value={value?.Months} />
                            <label htmlFor="">Months</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                    <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Days' id='Days' maxLength={3} onChange={handlChanges} value={value?.Days} />
                            <label htmlFor="">Days</label>
                            {/* {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null} */}
                        </div>
                    </div>
                </div>
                <div className="col-12 text-right mt-3 p-0">
                    {
                        ArrestChargeID ?
                            <>
                                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                            </>
                            :
                            <>
                                <button type="button" className="btn btn-sm btn-success" onClick={() => { check_Validation_Error(); }}>Save</button>
                            </>
                    }
                    <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { OnClose(); }} >Close</button>
                </div>
            </div>
        </>
    )
}

export default Penalties