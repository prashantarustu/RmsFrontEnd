import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import { colourStyles } from '../../../../../Common/Utility';
const Home = () => {
    return (
        <>
            <div className="tab-pane fade show active" id="home">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">
                                Field Interview
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12  " >
                        <div className="row">
                            <div className="col-3 col-md-4 col-lg-2 mt-2">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Field Interview</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-2 mt-3 date__box">
                                <DatePicker
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeInputLabel
                                    showTimeSelect
                                    timeIntervals={1}
                                    placeholderText={'Select...'}
                                    timeCaption="Time"
                                />
                                <label htmlFor="">Interview Start Date/Time</label>
                            </div>
                            <div className="col-6 col-md-6 col-lg-2 mt-3 date__box">
                                <DatePicker
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeInputLabel
                                    showTimeSelect
                                    timeIntervals={1}
                                    placeholderText={'Select...'}
                                    timeCaption="Time"
                                />
                                <label htmlFor="">Interview End Date/Time</label>
                            </div>
                            <div className="col-3 col-md-4 col-lg-2 mt-2">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Agency</label>
                                </div>
                            </div>
                            <div className="col-3 col-md-4 col-lg-2 mt-2">
                                <div class="text-field">
                                    <input type="text" className='readonlyColor' name='nameid' required readOnly />
                                    <label>Incident</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-5 col-lg-2 mt-2">
                                <div className=" dropdown__box">
                                    <Select
                                        name='NameTypeID'
                                        styles={colourStyles}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Interviewing Officer</label>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mt-2" >
                                <div className="text-field">
                                    <textarea id="" cols="30" rows='1'
                                        className="form-control " ></textarea>
                                    <label>Place Of Interview</label>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-6 mt-2" >
                                <div className="text-field">
                                    <textarea id="" cols="30" rows='1'
                                        className="form-control " ></textarea>
                                    <label>FI Reason</label>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="no_id" />
                                            <label class="form-check-label" for="no_id">No ID</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Probation" />
                                            <label class="form-check-label" for="Probation">Probation</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="nrs" />
                                            <label class="form-check-label" for="nrs">NRS</label>
                                        </div>
                                    </div>
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
                                    <div className="col-lg-2 mt-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="ncic_search" />
                                            <label class="form-check-label" for="ncic_search">NCIC Search</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 mt-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="NCIC Lookup" />
                                            <label class="form-check-label" for="NCIC Lookup">NCIC Lookup</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 mt-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="Gang Affiliation" />
                                            <label class="form-check-label" for="Gang Affiliation">Gang Affiliation</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 text-right mt-2">
                                <Link to={'/field-interview-search'} className="btn btn-sm btn-success mx-2">Close</Link>
                                <button type="button" className="btn btn-sm btn-success">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home