import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';

const WarrantSearch = () => {

  const [issuedDatefrom, setissuedDatefrom] = useState();
  const [issuedDateto, setissuedDateto] = useState();
  const [value, setValue] = useState({});

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
                <div className="row  ">
                  <div className={`col-12 col-md-12`}>
                    <div className="row">
                      <div className="col-12  mb-2">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                          <p className="p-0 m-0">Warrant Search</p>
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="text-field">
                          <input type="text" name='LastName' />
                          <label>Warrant Number From</label>
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="text-field">
                          <input type="text" name='FirstName' />
                          <label>Warrant Number to</label>
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="text-field">
                          <input type="text" name='MiddleName' />
                          <label>Incident Number</label>
                        </div>
                      </div>
                      <div class="col-4 col-md-4 col-lg-3 mb-1 " style={{ marginTop: '6px' }}>
                        <div className="dropdown__box">
                          <Select
                            styles={colourStyles}
                            menuPlacement='top'
                            isClearable
                            placeholder="Select..."
                          />
                          <label htmlFor='' className='mt-0'>Warrant Type</label>
                        </div>
                      </div>
                      <div class="col-4 col-md-4 col-lg-3 mb-1">
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

                      <div class="col-4 col-md-4 col-lg-3 mb-1">
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
                      <div class="col-4 col-md-4 col-lg-3 mb-1" style={{ marginTop: '4px' }}>
                        <div className="dropdown__box">
                          <Select
                            styles={colourStyles}
                            menuPlacement='top'
                            isClearable
                            placeholder="Select..."
                          />
                          <label htmlFor='' className='mt-0'>Location From</label>
                        </div>
                      </div>
                      <div class="col-4 col-md-4 col-lg-3 mb-1" style={{ marginTop: '4px' }}>
                        <div className="dropdown__box">
                          <Select
                            styles={colourStyles}
                            menuPlacement='top'
                            isClearable
                            placeholder="Select..."
                          />
                          <label htmlFor='' className='mt-0'>Location To</label>
                        </div>
                      </div>
                      <div className=" text-right col-10 col-md-10  col-lg-10 " style={{ marginTop: '18px' }}>
                        <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Search</button>
                      </div>
                      <div className="col-2 col-md-2 col-lg-2  text-right mt-3">
                        <Link to={'/warrant-advance-search'}>
                          <button className="btn btn-sm bg-green text-white px-2 py-1" data-toggle="modal" data-target="#">Advance Search</button>
                        </Link>
                      </div>
                      <div className="col-12  mt-2">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                          <p className="p-0 m-0">Warrant</p>
                          <p className="p-0 m-0">
                            <Link to={''}
                              className="btn btn-sm bg-green text-white px-2 py-0" >
                              <i className="fa fa-plus"></i>
                            </Link>
                          </p>
                        </div>
                        <div className="row ">
                          <div className="col-12 ">
                            <DataTable
                              dense
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WarrantSearch