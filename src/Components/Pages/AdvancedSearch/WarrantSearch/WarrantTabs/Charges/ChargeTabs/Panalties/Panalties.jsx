import React from 'react'
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
const Panalties = () => {
    return (
        <>
            <div className="tab-pane fade" id="Panalties">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">
                                Panalties Information
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12  " >
                        <div className="row">
                            <>
                                <div className="col-6 col-md-4 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Fine</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Court Cost</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Other Cost</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-2 col-lg-1 mt-2 pt-2">
                                    <span className='pt-2 d-inline-block'>Sentence :</span>
                                </div>
                                <div className="col-6 col-md-4 col-lg-1 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Year</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-1 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Months</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-1 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Days</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-4 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">FTA Date</label>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>FTA Amt</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Warrant Amt</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Lotigation Tax</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Total Panalty</label>
                                    </div>
                                </div>
                                
                            </>

                            <div className="col-12 text-right mt-2">
                                <Link to={'/warrant-add'} className="btn btn-sm btn-success mx-2">Close</Link>
                                <button type="button" className="btn btn-sm btn-success">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Panalties