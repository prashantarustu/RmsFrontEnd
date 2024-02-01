import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { colourStyles, getShowingMonthDateYear } from '../../../../Common/Utility';
const Home = () => {
    const [value, setValue] = useState();
    const [startdate, setStartDate] = useState();
    const [enddate, setEndDate] = useState();
    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Field Interview</p>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-md-12 col-lg-12  " >
                        <div className="row">
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Field Interview</label>
                                </div>
                            </div>

                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Agency</label>
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Incident</label>
                                </div>
                            </div>

                            <div className="col-3 col-md-3 col-lg-3 ">
                                <div className=" dropdown__box">
                                    <DatePicker
                                        id='startdate'
                                        name='startdate'
                                        onChange={(date) => { setValue({ ...value, ['startdate']: date ? getShowingMonthDateYear(date) : null }) }}
                                        selected={value?.startdate && new Date(value?.startdate)}
                                        className=''
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        autoComplete="nope"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        isClearable={value?.startdate ? true : false}
                                        placeholderText={value?.startdate ? value.startdate : 'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        maxDate={new Date()}
                                    />
                                    <label htmlFor="" className='pt-1 pl-0'>Interview Start Date/Time</label>
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3  pt-1">
                                <div className=" dropdown__box">
                                    <DatePicker
                                        id='enddate'
                                        name='enddate'
                                        onChange={(date) => { setValue({ ...value, ['enddate']: date ? getShowingMonthDateYear(date) : null }) }}
                                        selected={value?.enddate && new Date(value?.enddate)}
                                        className=''
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        autoComplete="nope"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        isClearable={value?.enddate ? true : false}
                                        placeholderText={value?.enddate ? value.enddate : 'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        maxDate={new Date()}
                                    />
                                    <label htmlFor="" className='pt-1 pl-0'>Interview End Date/Time</label>

                                </div>
                            </div>

                            <div className="col-3 col-md-3 col-lg-3 mt-1 pt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name='NameTypeID'
                                        styles={colourStyles}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="" className='pl-0'>Interviewing Officer</label>
                                </div>
                            </div>
                            <div className="col-12 col-md-5 col-lg-5 mt-1 pt-1" >
                                <div className="text-field">
                                    <textarea id="" cols="30" rows='1'
                                        className="form-control " ></textarea>
                                    <label className='pt-1'>Place Of Interview</label>
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 mt-4">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="ISVerify" />
                                    <label class="form-check-label" for="ISVerify">Is Verify</label>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mt-2" >
                                <div className="text-field">
                                    <textarea id="" cols="30" rows='1'
                                        className="form-control " ></textarea>
                                    <label>FI Reason</label>
                                </div>
                            </div>
                            <div className="col-lg-2 mt-4">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="no_id" />
                                    <label class="form-check-label" for="no_id">No ID</label>
                                </div>
                            </div>
                            <div className="col-lg-2 mt-4">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="Probation" />
                                    <label class="form-check-label" for="Probation">Probation</label>
                                </div>
                            </div>
                            <div className="col-lg-2 mt-4">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="nrs" />
                                    <label class="form-check-label" for="nrs">NRS</label>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Parolee" />
                                            <label class="form-check-label" for="Parolee">Parolee</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Id_Verified" />
                                            <label class="form-check-label" for="Id_Verified">Id Verified</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Local_Lookup" />
                                            <label class="form-check-label" for="Local_Lookup">Local Lookup</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 ">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="ncic_search" />
                                            <label class="form-check-label" for="ncic_search">NCIC Search</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 ">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="NCIC Lookup" />
                                            <label class="form-check-label" for="NCIC Lookup">NCIC Lookup</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 ">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Gang Affiliation" />
                                            <label class="form-check-label" for="Gang Affiliation">Gang Affiliation</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 text-right mt-2">
                                <button type="button" className="btn btn-sm btn-success">Save</button>
                                <Link to={'/field-interview'} className="btn btn-sm btn-success mx-2">Close</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Home