import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';

const WarrantAdvanceSearch = () => {

    const [issuedDatefrom, setissuedDatefrom] = useState();
    const [issuedDateto, setissuedDateto] = useState();
    const [serviceAttemptedfrom, setserviceAttemptedfrom] = useState();
    const [serviceAttemptedto, setserviceAttemptedto] = useState();
    const [serviceDatefrom, setserviceDatefrom] = useState();
    const [serviceDateto, setserviceDateto] = useState();
    const [expiryDate, setexpiryDate] = useState();
    const [value, setValue] = useState();

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const startRef5 = React.useRef();
    const startRef6 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
            startRef5.current.setOpen(false);
            startRef6.current.setOpen(false);
        }
    };

    return (
        <>
            <div className="section-body pt-3 px-3">
                <div className="row">
                    <div className="col-12">
                        <fieldset className='fieldset'>
                            <legend>Warrant Information</legend>
                            <div className="row">
                                <div class="col-6 col-md-3 mt-1">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Warrant Number From</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mt-1">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Warrant Number To</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mt-1">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Incident</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1 mt-1">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Status</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1 mt-1">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Type</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1 mt-1">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Classification</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='issuedDatefrom'
                                            name='issuedDatefrom'
                                            ref={startRef}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setissuedDatefrom(date); setValue({ ...value, ['issuedDatefrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.issuedDatefrom ? true : false}
                                            selected={issuedDatefrom}
                                            placeholderText={value?.issuedDatefrom ? value.issuedDatefrom : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Date Issue From</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='issuedDateto'
                                            name='issuedDateto'
                                            ref={startRef1}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setissuedDateto(date); setValue({ ...value, ['issuedDateto']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.issuedDateto ? true : false}
                                            selected={issuedDateto}
                                            placeholderText={value?.issuedDateto ? value.issuedDateto : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Date Issue To</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='serviceAttemptedfrom'
                                            name='serviceAttemptedfrom'
                                            ref={startRef2}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setserviceAttemptedfrom(date); setValue({ ...value, ['serviceAttemptedfrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.serviceAttemptedfrom ? true : false}
                                            selected={serviceAttemptedfrom}
                                            placeholderText={value?.serviceAttemptedfrom ? value.serviceAttemptedfrom : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Service Attempted Date From</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='serviceAttemptedto'
                                            name='serviceAttemptedto'
                                            ref={startRef3}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setserviceAttemptedto(date); setValue({ ...value, ['serviceAttemptedto']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.serviceAttemptedto ? true : false}
                                            selected={serviceAttemptedto}
                                            placeholderText={value?.serviceAttemptedto ? value.serviceAttemptedto : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Service Attempted Date To</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='serviceDatefrom'
                                            name='serviceDatefrom'
                                            ref={startRef4}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setserviceDatefrom(date); setValue({ ...value, ['serviceDatefrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.serviceDatefrom ? true : false}
                                            selected={serviceDatefrom}
                                            placeholderText={value?.serviceDatefrom ? value.serviceDatefrom : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Service Date From</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='serviceDateto'
                                            name='serviceDateto'
                                            ref={startRef5}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setserviceDateto(date); setValue({ ...value, ['serviceDateto']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.serviceDateto ? true : false}
                                            selected={serviceDateto}
                                            placeholderText={value?.serviceDateto ? value.serviceDateto : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Service Date To</label>
                                    </div>
                                </div>



                                <div class="col-6 col-md-3 mb-1 mt-2">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Authority</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mb-1 mt-2">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Location</label>
                                    </div>
                                </div>

                                {/* <div class="col-6 col-md-3 mb-1 mt-2">
                  <div className="dropdown__box">
                    <Select
                      styles={colourStyles}
                      menuPlacement='top'
                      isClearable
                      placeholder="Select..."
                    />
                    <label htmlFor='' className='mt-0'>Charge</label>
                  </div>
                </div> */}

                                {/* <div class="col-6 col-md-3 mb-1 mt-2">
                  <div className="dropdown__box">
                    <Select
                      styles={colourStyles}
                      menuPlacement='top'
                      isClearable
                      placeholder="Select..."
                    />
                    <label htmlFor='' className='mt-0'>Served by</label>
                  </div>
                </div> */}
                                {/* 
                <div class="col-6 col-md-3 mt-2">
                  <div className="text-field">
                    <input type="text" />
                    <label className=''>Docket</label>
                  </div>
                </div> */}

                                {/* <div class="col-6 col-md-3 mt-2">
                  <div className="text-field">
                    <input type="text" />
                    <label className=''>Court Warrant</label>
                  </div>
                </div> */}

                                {/* <div class="col-6 col-md-3 mt-2">
                  <div className="text-field">
                    <input type="text" />
                    <label className=''>Complainant</label>
                  </div>
                </div> */}

                            </div>
                        </fieldset>

                        <fieldset className='fieldset mt-2'>
                            <legend>Restraining Order Information</legend>
                            <div className="row">
                                <div className="col-12  mb-1">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="Copy On Fire" />
                                                <label class="form-check-label" for="Copy On Fire">Copy On Fire</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="Child Custody" />
                                                <label class="form-check-label" for="Child Custody">Child Custody</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="Contact Prohibited" />
                                                <label class="form-check-label" for="Contact Prohibited">Contact Prohibited</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-3
                    ">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="Forbidden To Return" />
                                                <label class="form-check-label" for="Forbidden To Return">Forbidden To Return</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div class="form-check">
                                                <input type="checkbox" class="form-check-input" id="Granted Possession" />
                                                <label class="form-check-label" for="Granted Possession">Granted Possession</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mt-1">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Warning Given</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 ">
                                    <div className="dropdown__box">
                                        <DatePicker
                                            id='expiryDate'
                                            name='expiryDate'
                                            ref={startRef6}
                                            onKeyDown={onKeyDown}
                                            onChange={(date) => { setexpiryDate(date); setValue({ ...value, ['expiryDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                            className=''
                                            dateFormat="MM/dd/yyyy"
                                            timeInputLabel
                                            isClearable={value?.expiryDate ? true : false}
                                            selected={expiryDate}
                                            placeholderText={value?.expiryDate ? value.expiryDate : 'Select...'}
                                        />
                                        <label htmlFor="" className='pt-1'>Date Expire</label>
                                    </div>
                                </div>

                            </div>
                        </fieldset>

                        <fieldset className='fieldset mt-2'>
                            <legend>Name Information</legend>
                            <div className="row">
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Name ID</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Last Name</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>First Name</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Middle Name</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mt-2">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>SSN</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className='fieldset mt-2'>
                            <legend>Address Information</legend>
                            <div className="row">
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Common Place</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Premise Range From</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Premise Range To</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Apt Range From</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mt-2">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Apt Range To</label>
                                    </div>
                                </div>
                                <div class="col-6 col-md-3 mt-2">
                                    <div className="text-field">
                                        <input type="text" />
                                        <label className=''>Street Name</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mt-2">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>State</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mt-2">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>City</label>
                                    </div>
                                </div>

                                <div class="col-6 col-md-3 mt-2">
                                    <div className="dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            isClearable
                                            placeholder="Select..."
                                        />
                                        <label htmlFor='' className='mt-0'>Zip</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                    </div>
                </div>
                <div className="row mt-3 px-2 text-right">
                    <div className="col-12">
                        <Link to={'/warrant-search'}>
                            <button type="button" className="btn btn-sm btn-success mr-1">Search</button>
                        </Link>
                        <Link to={'/warrant-search'}>
                            <button type="button" className="btn btn-sm btn-success">Close</button>
                        </Link>
                    </div>
                </div>
                {/* <div className="row ">
                    <div className="col-12 mt-2">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Warrant</p>
                            <p className="p-0 m-0">
                                <Link to={'/warrant-add'} className="btn btn-sm bg-green text-white px-2 py-0" >
                                    <i className="fa fa-plus"></i>
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="col-12 ">
                        <DataTable
                            dense
                            // columns={columns}
                            // data={nameSearchValue}
                            pagination
                            selectableRowsHighlight
                            highlightOnHover
                        />
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default WarrantAdvanceSearch