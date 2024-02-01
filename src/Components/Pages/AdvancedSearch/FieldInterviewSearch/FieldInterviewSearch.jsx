import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';
import DataTable from 'react-data-table-component';

const FieldInterviewSearch = () => {
    const [fromInterviewdate, setfromInterviewdate] = useState();
    const [toInterviewdate, settoInterviewdate] = useState();
    const [value, setValue] = useState();

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset className='fieldset'>
                                    <legend>Field Interview</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-6 col-lg-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Field Interview Number From</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Field Interview Number To</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Incident Number</label>
                                            </div>
                                        </div>

                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    menuPlacement='top'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Interviewing Officer</label>
                                            </div>
                                        </div>

                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='fromInterviewdate'
                                                    name='fromInterviewdate'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setfromInterviewdate(date); setValue({ ...value, ['DOBDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable={value?.fromInterviewdate ? true : false}
                                                    selected={fromInterviewdate}
                                                    placeholderText={value?.fromInterviewdate ? value.fromInterviewdate : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>From Interviewed Date</label>
                                            </div>
                                        </div>

                                        <div class="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='toInterviewdate'
                                                    name='toInterviewdate'
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { settoInterviewdate(date); setValue({ ...value, ['DOBDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable={value?.toInterviewdate ? true : false}
                                                    selected={toInterviewdate}
                                                    placeholderText={value?.toInterviewdate ? value.toInterviewdate : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>To Interviewed Date</label>
                                            </div>
                                        </div>

                                        <div className="col-12 mt-2">
                                            <div className="row">
                                                <div className="col-4 col-md-4 col-lg-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="no_id" />
                                                        <label class="form-check-label" for="no_id">No ID</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="Probation" />
                                                        <label class="form-check-label" for="Probation">Probation</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="nrs" />
                                                        <label class="form-check-label" for="nrs">NRS</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="Parolee" />
                                                        <label class="form-check-label" for="Parolee">Parolee</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="Id_Verified" />
                                                        <label class="form-check-label" for="Id_Verified">Id Verified</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="Local_Lookup" />
                                                        <label class="form-check-label" for="Local_Lookup">Local Lookup</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" id="ncic_search" />
                                                        <label class="form-check-label" for="ncic_search">NCIC Search</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className='fieldset mt-3'>
                                    <legend>Person Interviewed</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Last Name</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>First Name</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>Middle Name</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 mt-1">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>SSN</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 mt-2">
                                            <div className="text-field">
                                                <input type="text" />
                                                <label className=''>FBI</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>


                                <div className="row mt-1 px-2 text-right">
                                    <div className="col-12">
                                        <button type="button" className="btn btn-sm btn-success">Search</button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12  mt-2">
                                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Field Interview</p>
                                            <p className="p-0 m-0">
                                                <Link to={'/field-interview-add'} className="btn btn-sm bg-green text-white px-2 py-0" >
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FieldInterviewSearch