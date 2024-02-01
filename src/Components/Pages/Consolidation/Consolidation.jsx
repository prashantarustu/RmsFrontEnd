import React from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { getShowingMonthDateYear } from '../../Common/Utility';
const Consolidation = () => {
    const [DOBDate, setDOBDate] = useState();
    const [value, setValue] = useState()
    const [DateOfBirth, setDateOfBirth] = useState();

    const columns = [
        {
            name: 'Comment',
            selector: 'Comment',
            sortable: true,
        },
        {
            name: 'Date/Time',
            selector: 'Date/Time',
            sortable: true,
        },

        {
            name: 'Officer',
            selector: 'Officer',
            sortable: true,
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                </Link>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-trash"></i>
                </Link>

            </>
        }

    ];
    // const data = [
    //     {
    //         "Comment": "Comments Test",
    //         "Date/Time": "08/20/2015 08:34:17",
    //         "Officer": "..."
    //     },
    // ]
    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 mb-2 p-0" >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Consolidation</p>
                                            <p className="p-0 m-0">
                                                <Link to={'#'} data-toggle="modal" data-target="#CommentsModal" className="btn btn-sm bg-green text-white px-2 py-0" >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div class="text-field">
                                            <input type="text" name='LastName' className="" id='LastName' required />
                                            <label className="pt-1">Last Name</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div class="text-field">
                                            <input type="text" name='FirstName' className="" id='FirstName' required />
                                            <label className="pt-1">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div class="text-field">
                                            <input type="text" name='MiddleName' className="" id='MiddleName' required />
                                            <label className="pt-1">Middle Name</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 pt-1">
                                        <div className="date__box ">
                                            <DatePicker
                                                id='DateOfBirth'
                                                name='DateOfBirth'
                                                onChange={(date) => { setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy"
                                                isClearable
                                                selected={DateOfBirth}
                                                placeholderText={value?.DateOfBirth ? value?.DateOfBirth : 'Select...'}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="" className='px-0'>DOB</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1 pt-1">
                                        <div class="text-field">
                                            <input type="text" name='DLNumber' className="" id='DLNumber' required />
                                            <label className="">DL Number</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1"  >
                                        <div className=" dropdown__box" >
                                            <Select
                                                name='DLState'
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">DL State</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1 pt-1" >
                                        <div className=" dropdown__box" >
                                            <Select
                                                name='gender'
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Gender</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1 pt-1" >
                                        <div className=" dropdown__box" >
                                            <Select
                                                name='race'
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Race</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1 pt-1" >
                                        <div className=" dropdown__box" >
                                            <Select
                                                name='ethnicity'
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Ethnicity</label>
                                        </div>
                                    </div>
                                    <div className="col-10  col-md-10 col-lg-10  mt-1" >
                                        <div className="dropdown__box" >
                                            <textarea name='Address' id="Address" cols="30" rows='1' className="form-control  " ></textarea>
                                            <label htmlFor="" className=''>Address</label>
                                        </div>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-2 mt-1 pt-1">
                                        <div class="text-field">
                                            <input type="text" name='PhoneNumber' className="" id='PhoneNumber' required />
                                            <label className="">Phone Number</label>
                                        </div>
                                    </div>
                                    <div className=" text-right col-12 col-md-12  col-lg-12 ">
                                        <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Search</button>
                                    </div>

                                    <div className="col-12 col-md-12 mb-2 p-0" >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Person</p>
                                        </div>
                                    </div>

                                    <div class="container">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Merge

                                                    </th>
                                                    <th>Name</th>
                                                    <th>DOB</th>
                                                    <th>Residence</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td>John</td>
                                                    <td>30-11-2022</td>
                                                    <td>address</td>
                                                </tr>
                                             
                                            </tbody>
                                        </table>
                                    </div>


                                    {/* <div className="col-12">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            // data={data}
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                        />
                                    </div> */}
                                    <div className=" text-right col-12 col-md-12  col-lg-12 ">
                                        <Link to={'/Consolidation-merge'}>
                                        
                                        <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Merge</button>
                                        </Link>
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

export default Consolidation