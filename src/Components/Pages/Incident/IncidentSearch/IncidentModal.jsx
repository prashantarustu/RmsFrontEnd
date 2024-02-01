import React from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import DatePicker from "react-datepicker";


const IncidentModal = () => {
    
    const colourStyles = {
        control: (styles) => ({
            ...styles,
            // backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    return (
        <>
            {/* <div className="modal  fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="AddMasterModal" tabIndex role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div class="modal-header px-3 p-2" >
                            <h5 class="modal-title">Search</h5>
                            <button type="button" className="close btn-modal" >
                                <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div class="col-10 col-md-10 col-lg-10 mt-2">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>hfyh</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div> */}


            <div class="modal top fade  " style={{ background: "rgba(0,0,0, 0.5)" }} id="AddMasterModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog   modal-xl" role="document">
                    <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
                        <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                            <h5 class="modal-title">Incident Advance Search</h5>
                            <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" >
                            <div className="m-1 ">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <fieldset className='fieldset' style={{ marginTop: '-10px' }}>
                                            <legend>Incident Report</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" />
                                                        <label className=''>Case From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" />
                                                        <label className=''>Case To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" />
                                                        <label className=''>Master Incident From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" />
                                                        <label className=''>Master Incident To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>RMS CFS Range From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>RMS CFS Range To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ActivityDateTime'
                                                            name='ActivityDateTime'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            isClearable
                                                            placeholderText={'Select...'}
                                                            timeIntervals={1}
                                                            timeCaption="Time"
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Occurred From Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ActivityDateTime'
                                                            name='ActivityDateTime'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            isClearable
                                                            placeholderText={'Select...'}
                                                            timeIntervals={1}
                                                            timeCaption="Time"
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ActivityDateTime'
                                                            name='ActivityDateTime'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            isClearable
                                                            placeholderText={'Select...'}
                                                            timeIntervals={1}
                                                            timeCaption="Time"
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ActivityDateTime'
                                                            name='ActivityDateTime'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            isClearable
                                                            placeholderText={'Select...'}
                                                            timeIntervals={1}
                                                            timeCaption="Time"
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-2 mb-1 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Pin Activity</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-2  ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Officer</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Type Of Security</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Recieve Source</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <fieldset className='fieldset mt-2'>
                                    <legend>RMS Disposition/Clearance Information</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOR NORMAL SEARCH */}
            {/* <div id="incident-advanced-search">
                <div className="card Agency">
                    <div className="card-body">
                        <div className="row mb-1">
                            <div className="col-12">
                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0">Incident Advanced Search</p>
                                    <p className="p-0 m-0">
                                        <i className="fa fa-times close-icon" onClick={() => setAdvancedSearch(false)} />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <fieldset className='fieldset'>
                                    <legend>Incident Report</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Case From</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Case To</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Master Incident From</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Master Incident To</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>RMS CFS Range From</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>RMS CFS Range To</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Occurred From Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Reported From Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Reported To Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-2 mb-1 ">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Pin Activity</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-2  ">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Officer</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Type Of Security</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Recieve Source</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className='fieldset mt-2'>
                                    <legend>RMS Disposition/Clearance Information</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ActivityDateTime'
                                                    name='ActivityDateTime'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable
                                                    placeholderText={'Select...'}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                            </div>
                        </div>
                        <div className="row mt-3 text-right">
                            <div className="col-12">
                                <button type="button" className="btn btn-sm btn-success mx-2">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

        </>
    )
}

export default IncidentModal