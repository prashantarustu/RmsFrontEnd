import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import { colourStyles } from '../../../../../../../Common/Utility';
const Home = () => {
    return (
        <>
            <div className="tab-pane fade show active" id="chargeHome">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">
                                Charge Information
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12  " >
                        <div className="row">
                            <>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Name</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Incident</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Arrest</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Warrant</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Citation</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Description</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">Charge Code</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">NIBRS Code</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-2">
                                    <div class="text-field">
                                        <input type="text" />
                                        <label>Court</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="">UCR Clear</label>
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

export default Home