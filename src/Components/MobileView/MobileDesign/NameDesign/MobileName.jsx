import React, { useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, Encrypted_Id_Name, tableCustomStyles } from '../../../Common/Utility'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import MobileTab from '../../MobileUtility/MobileTab'
import { fetchPostData } from '../../../hooks/Api'
import { AgencyContext } from '../../../../Context/Agency/Index'

const MobileName = () => {

    const { updateCount, setUpdateCount } = useContext(AgencyContext)

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [nameDataFRW, setNameDataFRW] = useState([]);

    useEffect(() => {     
        get_Incident_List();
    }, []);

    const get_Incident_List = () => {
        const val = {
            'IncidentIDFRW': '',
        }
        fetchPostData('Name_FRW/GetData_Name_FRW', val).then((res) => {
            if (res) {
                setNameDataFRW(res);
            }
            else { setNameDataFRW(); }
        })
    }

    const columns = [
        {
            name: 'Action',
            cell: row => <>
                <div className="div">
                    <Link to={'/mobile-name'} onClick={() => { set_FRW_IncidentId(row) }} className="btn btn-sm bg-green text-white" data-toggle="modal" data-target="" >
                        <i className="fa fa-edit"></i>
                    </Link>
                </div>
            </>,
            grow: 0,
        },
        {
            name: 'LastName',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 50) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    const set_FRW_IncidentId = (row) => {
        console.log(row)
        // sessionStorage.setItem("NameID", Encrypted_Id_Name(row.NameID, 'NForNameId'));
        setUpdateCount(updateCount + 1)
    }

    return (
        <>
            <div class="section-body view_page_design ">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body ">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                                                <MobileTab />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 px-3">
                     
                        <div className="bg-line text-white py-1  px-0 d-flex justify-content-between align-items-center" >
                            <p className="p-0 m-0 pl-3 py-1 col-4" style={{ fontSize: '18px', }}>
                                Name
                            </p>
                                    <p className="p-0 m-0">
                                        <Link to={'/mobile-name'} onClick={() => { ("NameID") }} className="btn btn-sm bg-green text-white px-2 py-0 mr-2" style={{ fontSize: '18px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                    </p>
                                </div>
                                <div className="col-12 mt-2 px-3" >
                                    <DataTable
                                        columns={columns}
                                        data={nameDataFRW}
                                        dense
                                        pagination
                                        paginationPerPage={'5'}
                                        paginationRowsPerPageOptions={[5]}
                                        highlightOnHover
                                        // subHeader
                                        responsive
                                        customStyles={tableCustomStyles}
                                        className='mobile-datatable'
                                        showPaginationBottom={5}
                                        subHeaderComponent={
                                            <>
                                                {/* <div className="col-12  mt-1">
                                                    <div className="row ">
                                                        <div className="col-3 col-md-3">
                                                            <input type="text" onChange={(e) => {
                                                                setSearchValue1(e.target.value)
                                                                const result = Three_Search_FilterWith_Date(incidentList, e.target.value, searchValue2, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                setIncidentFilterData(result)
                                                            }} className='form-control' placeholder='Search By Incident ...' />
                                                        </div>
                                                        <div className='col-1 col-md-1'>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                    <i className="fa fa-filter"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => setFilterIncidentIdOption('Contains')}>Contains</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterIncidentIdOption('is equal to')}>is equal to</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterIncidentIdOption('is not equal to ')}>is not equal to </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterIncidentIdOption('Starts With')}>Starts With</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterIncidentIdOption('End with')}>End with</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-3">
                                                            <DatePicker
                                                                dateFormat="MM/dd/yyyy"
                                                                name='Date1'
                                                                className='form-control datepicker-custom '
                                                                onChange={(date) => {
                                                                    setSearchValue3(date)
                                                                    const result = Three_Search_FilterWith_Date(incidentList, searchValue1, searchValue2, date, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                    setIncidentFilterData(result)
                                                                }}
                                                                autoComplete="off"
                                                                placeholderText="Search By Occurred To Date "
                                                                selected={searchValue3}

                                                            />
                                                        </div>
                                                        <div className="col-1">
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant='primary' id="dropdown-basic">
                                                                    <i class="fa fa-filter"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => setFilterOccuredToOption('Contains')}>Contain</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterOccuredToOption('is equal to')}>Is Equal to</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterOccuredToOption('is Not equal to')}>Is not Equal to</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterOccuredToOption('Start With')}>Start with</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setFilterOccuredToOption('End With')}>End with</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-3 col-md-3">
                                                            <input type="text" onChange={(e) => {
                                                                setSearchValue2(e.target.value)
                                                                const result = Three_Search_FilterWith_Date(incidentList, searchValue1, e.target.value, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                setIncidentFilterData(result)
                                                            }} className='form-control' placeholder='Search By RMS CFS Code ...' />
                                                        </div>   
                                                        <div className='col-1 col-md-1'>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                    <i className="fa fa-filter"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => setfilterRmsCfsOption('Contains')}>Contains</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setfilterRmsCfsOption('is equal to')}>is equal to</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setfilterRmsCfsOption('is not equal to ')}>is not equal to </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setfilterRmsCfsOption('Starts With')}>Starts With</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setfilterRmsCfsOption('End with')}>End with</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </>
                                        }
                                        subHeaderAlign='left'
                                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div>
            </div> */}
        </>
    )
}

export default MobileName