import React from 'react'
import { Link } from 'react-router-dom';
import { colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";


const PropertyAdvanceSearch = () => {
    
    //dateTime
    const [Reportedfromdate, setreportedfromDate] = useState();
    const [Reportedtodate, setreportedtoDate] = useState();
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
                                    <legend>Property Information</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-3 " style={{marginTop:'5px'}}>
                                            <div className="text-field">
                                                <input type="text" id='IncidentNumber' name='IncidentNumber' className={''} />
                                                <label className=''>Master Case</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 " style={{marginTop:'5px'}}>
                                            <div className="text-field">
                                                <input type="text" id='PropertyNumber' name='PropertyNumber' className={'requiredColor'} />
                                                <label className=''>Property</label>

                                            </div>
                                        </div>
                                        <div class="col-6 col-md-3 col-lg-3 pt-1">
                                            <div className="dropdown__box">
                                                <Select
                                                    styles={colourStyles}
                                                    name='PropertyTypeID'
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Property Type</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3 pt-1 ">
                                            <div className="dropdown__box">
                                                <Select
                                                    name='LossCodeID'
                                                    styles={colourStyles}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='mt-0'>Property Reason</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTm'
                                                    name='ReportedDtTm'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setreportedfromDate(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    autoComplete='Off'
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDtTm ? true : false}
                                                    selected={Reportedfromdate}
                                                    maxDate={new Date()}
                                                    placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported From Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTmTo'
                                                    name='ReportedDtTmTo'
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setreportedtoDate(date); setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    autoComplete='Off'
                                                    timeInputLabel
                                                    maxDate={new Date()}
                                                    isClearable={value?.ReportedDtTmTo ? true : false}
                                                    selected={Reportedtodate}
                                                    placeholderText={value?.ReportedDtTmTo ? value.ReportedDtTmTo : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported To Date</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className='fieldset mt-2'>
                                    <legend>Property Owner</legend>
                                    <div className="row">
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
                                    </div>
                                </fieldset>
                                <div className="row mt-1 px-2 text-right">
                                    <div className="col-12">
                                        <Link to={'/property-search'}>
                                        <button type="button" className="btn btn-sm btn-success mr-1" >Search</button>
                                        </Link>
                                        <Link to={'/property-search'}>
                                        <button type="button" className="btn btn-sm btn-success" >Close</button>
                                        </Link>
                                    </div>
                              
                                </div>
                                {/* <div className="row">
                                <div className="col-12  mt-2">
                                    <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0">Property</p>
                                        <p className="p-0 m-0">
                                            <Link to={''} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12 ">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={propertySearchValue}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PropertyAdvanceSearch