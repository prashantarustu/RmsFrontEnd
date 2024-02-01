import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { customStylesWithOutColor } from '../../../../Common/Utility';
const Security = () => {
    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Security</p>
                </div>
                <div className="row">

                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Denomination' id='Denomination' required />
                            <label htmlFor="">Denomination</label>
                        </div>
                    </div>
                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='IssuingAgency' id='IssuingAgency' required />
                            <label htmlFor="">Issuing Agency</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='MeasureTypeID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                                isDisabled
                            />
                            <label>Measure Type</label>
                        </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                            id='SecurityDtTm'
                            name='SecurityDtTm'
                            className=''
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeInputLabel
                            showTimeInput
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            autoComplete="nope"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                        />
                        <label htmlFor="">Security Date</label>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className="text-field">
                            <input type="text" name='SerialID' id='SerialID' required />
                            <label htmlFor="" className='pt-1'>Serial Id</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Security