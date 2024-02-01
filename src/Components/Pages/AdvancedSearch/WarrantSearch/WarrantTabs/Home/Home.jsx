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
                                Warrant Information
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12  " >
                        <div className="row">
                            <>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Warrant#</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant Type</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant Holder</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Agency</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant Classification</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant Status</label>
                                    </div>
                                </div>
                            </>

                            {/* --Name Information-- */}
                            <div className="col-12 col-md-12 mt-2 mb-2 p-0" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Name Information
                                    </p>
                                </div>
                            </div>

                            <>
                                <div className="col-6 col-md-4 col-lg-4 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant Name</label>
                                    </div>
                                </div>
                                <div className="col-3 col-md-4 col-lg-4 mt-2">
                                    <div class="text-field">
                                        <input type="text" required />
                                        <label>Complainant</label>
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
                                    <label htmlFor="">Date Of Complain</label>
                                </div>
                            </>

                            {/* ---Date-- */}
                            <div className="col-12 col-md-12 mt-2 mb-2 p-0" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Dates
                                    </p>
                                </div>
                            </div>

                            <>
                                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">Date/Time Issued</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">Date Expired</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">Notice Date</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">Creation Date</label>
                                </div>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Poster's Name</label>
                                    </div>
                                </div>
                            </>


                            {/* --Court Information-- */}
                            <div className="col-12 col-md-12 mt-2 mb-2 p-0" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Court Information
                                    </p>
                                </div>
                            </div>

                            <>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Name</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Judge</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Warrant#</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Docket</label>
                                    </div>
                                </div>
                            </>

                            {/* --Service Information-- */}
                            <div className="col-12 col-md-12 mt-2 mb-2 p-0" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Service Information
                                    </p>
                                </div>
                            </div>
                            <>
                                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                    <DatePicker
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        placeholderText={'Select...'}
                                        timeCaption="Time"
                                    />
                                    <label htmlFor="">Attempted Date</label>
                                </div>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Service Limitation</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Served Date</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Served By Officer</label>
                                    </div>
                                </div>
                            </>

                            {/* --State Highway Petrol And Authority--- */}
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-12 col-md-12 mt-2 mb-2" >
                                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0 d-flex align-items-center">
                                                        State Highway Petrol
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mt-2">
                                                <div class="text-field">
                                                    <input type="text" />
                                                    <label>KRS</label>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mt-2">
                                                <div class="text-field">
                                                    <input type="text" />
                                                    <label>UOR Cd</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-12 col-md-12 mt-2 mb-2" >
                                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0 d-flex align-items-center">
                                                        Issuing Authority
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mt-2">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        styles={colourStyles}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Authority</label>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mt-2">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        styles={colourStyles}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Location</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --Bail-- */}
                            <div className="col-12 col-md-12 mt-2 mb-2 p-0" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Bail
                                    </p>
                                </div>
                            </div>

                            <>
                                <div className="col-6 col-md-5 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Bail Condition</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Bail Ammount</label>
                                    </div>
                                </div>
                            </>



                            <div className="col-12 text-right mt-2">
                                <Link to={'/warrant-search'} className="btn btn-sm btn-success mx-2">Close</Link>
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