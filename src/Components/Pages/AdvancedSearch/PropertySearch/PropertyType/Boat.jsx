import React from 'react'
import Select from "react-select";
import { customStylesWithOutColor } from '../../../../Common/Utility';
import DatePicker from "react-datepicker";

const Boat = () => {
    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Boat</p>
                </div>
                <div className="row">
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='ManufactureYear' required />
                            <label htmlFor="">ManufactureYear</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-2 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Length' id='Length' required />
                            <label htmlFor="">Length</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-4 col-lg-4 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='RegistrationStateID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Registration State</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='RegistrationNumber' id='RegistrationNumber' required />
                            <label htmlFor="">Registration No.</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='VODID'
                                // value={measureTypeDrp?.filter((obj) => obj.value === value?.VODID)}
                                styles={customStylesWithOutColor}
                                // options={measureTypeDrp}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>VOD</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-5 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='MaterialID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Material</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='MakeID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Make</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='ModelID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Model Id</label>
                        </div>
                    </div>
                    <div className="col-9  col-md-12 col-lg-6 mt-1">
                        <div className=" dropdown__box">
                            <textarea name='Comments' id="Comments" cols="30" rows='1' className="form-control" >
                            </textarea>
                            <label htmlFor="">Comments</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='HIN' required />
                            <label htmlFor="">HIN</label>
                        </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                            id='RegistrationExpiryDtTm'
                            name='RegistrationExpiryDtTm'
                            className=''
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeInputLabel
                            showTimeInput
                            timeIntervals={1}
                            timeCaption="Time"
                            autoComplete="nope"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                        />
                        <label htmlFor="">Reg. Expiry</label>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='BottomColorID'
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Bottom Color</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='TopColorID'
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Top Color</label>
                        </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='PropulusionID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Propulusion</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Boat