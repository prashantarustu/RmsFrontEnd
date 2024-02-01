// Import Component
import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { useState } from 'react';
import SubTab from '../../../Utility/Tab/SubTab';
import { PersTabs } from '../../../Utility/Tab/TabsArray';
import Dates from '../PersTab/DatesMember/Dates';
import Emergency from '../PersTab/Emergency/Emergency';
import Effectivepermission from '../PersTab/Effectivepermission/Effectivepermission';
import PersonnelGroup from '../PersTab/Group/PersonnelGroup';
import EffectiveFieldPermission from '../PersTab/EffectiveFieldPermission/EffectiveFieldPermission';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { Personnel_Name_Filter } from '../../../Filter/PersonnelFilter';
import Dropdown from 'react-bootstrap/Dropdown';
import { Decrypt_Id_Name } from '../../../Common/Utility';
import Home from '../PersTab/Home/Index';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';


const PersonnelModal = ({ PINID, setPINID, setModalOpen, agencyId, editValueList, setEditValueData, EffectiveScreenPermission, get_Personnel_Lists }) => {

    const { get_CountList, count } = useContext(AgencyContext);

    // Hooks Initialization
    const [showPage, setShowPage] = useState('home');
    const [personnelList, setPersonnelList] = useState([])
    const [personnelFilterList, setPersonnelFilterList] = useState([])
    // const [PINID, setPINID] = useState(pinId)
    const [status, setStatus] = useState(false)
    const [showCount, setShowCount] = useState(false)

    // Fitler 
    const [filterPersonnelNameOption, setFilterPersonnelNameOption] = useState('Contains')

    // Onload Function
    useEffect(() => {
        get_PersonnelList();
        // get_Password_Setting();
        get_CountList(agencyId, PINID)
    }, [])

    useEffect(() => {
        if (editValueList?.PINID) {
            setPINID(editValueList?.PINID)
            setStatus(true)
            setShowCount(true)
        }
    }, [editValueList])

    // Get Password setting 
    const get_Password_Setting = () => {
        const value = {
            AgencyID: localStorage.getItem('PasswordUserId')
        }
        fetchPostData('PasswordSetting/PasswordSetting_getData', value)
            .then(res => {
                if (res) {
                    localStorage.setItem('data', JSON.stringify(res[0]))
                }
            })
    }

    // Get Data Personnel, Rank, AssociatedShift and Division list 
    const get_PersonnelList = () => {
        const val = {
            AgencyID: agencyId
        }
        fetchPostData('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) {
                    setPersonnelList(res);
                    setPersonnelFilterList(res)
                }
                else {
                    setPersonnelList([]);
                    setPersonnelFilterList([])
                };
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'LastName',
            selector: (row) => row.LastName
        },
        {
            name: 'FirstName',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Division Name',
            selector: (row) => row.Division_Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 0, right: 40 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    {
                        EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`#`} onClick={(e) => editValueSet(e, row)}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                    }
                    {/* {
                        EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setPINID(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                    } */}

                    {/* <Link to={`#`}
                        className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i>
                    </Link> */}
                </div>
            </>

        }
    ]

    const editValueSet = (e, Data) => {
        e.preventDefault()
        setShowPage('home')
        setPINID(Data?.PINID)
        setEditValueData(Data)
        setStatus(true)
        get_CountList(agencyId, Data?.PINID)
    }

    const delete_Personnel = (e, id) => {
        e.preventDefault()
        const val = {
            DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            PINID: PINID
        }
        AddDeleteUpadate('Personnel/DeletePersonnel', val)
            .then((res) => {
                if (res) toastifySuccess(res.Message); get_PersonnelList(); get_CountList(agencyId); get_Personnel_Lists()
            })
    }

    // Custom Style
    const conditionalRowStyles = [
        {
            when: row => row.PINID === editValueList?.PINID,
            style: {
                backgroundColor: 'hwb(199deg 88% 0%)',
                userSelect: "none"
            }
        },
    ];

    return (
        <>
            <div id='pers_full_screen_modal'>
                <div className="box">
                    <div className="d-flex justify-content-between align-items-center px-3 py-1 bg-green">
                        <span className='text-white' style={{ fontSize: '12px' }}>Personnel</span>
                        {
                            editValueList ?
                                <span className='text-white' style={{ fontSize: '12px' }}>
                                    {editValueList?.PIN + '-' + editValueList?.LastName + ',' + ' ' + editValueList?.FirstName}
                                </span>
                                :
                                <></>
                        }

                        <div className='d-flex' style={{ color: '#fff' }}>
                            <div className="">
                                <input type="text" onChange={(e) => {
                                    const result = Personnel_Name_Filter(personnelList, e.target.value, filterPersonnelNameOption)
                                    setPersonnelFilterList(result)
                                }} className='form-control' placeholder='Search By Name ...' />
                            </div>
                            <div >
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <i className="fa fa-filter"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterPersonnelNameOption('Contains')}>Contains</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterPersonnelNameOption('is equal to')}>is equal to</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterPersonnelNameOption('is not equal to')}>is not equal to </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterPersonnelNameOption('Starts With')}>Starts With</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterPersonnelNameOption('End with')}>End with</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            {/* <button style={{ background: 'inherit', border: 'none', outline: 'none' }} className='text-white' onClick={() => setModalOpen(false)}> <i className='fa fa-print'></i> </button> */}
                            <button style={{ background: 'inherit', border: 'none', outline: 'none', color: '#e63946' }} onClick={() => setModalOpen(false)}> <i className='fa fa-close'></i> </button>
                        </div>
                    </div>
                    <div className="row px-2">
                        <div className="col-12">
                            <div id='dataTable-box'>
                                <DataTable
                                    dense
                                    columns={columns}
                                    data={EffectiveScreenPermission[0]?.DisplayOK ? personnelFilterList : ''}
                                    conditionalRowStyles={conditionalRowStyles}
                                    paginationPerPage={'5'}
                                    paginationRowsPerPageOptions={[5, 10, 15]}
                                    highlightOnHover
                                    noContextMenu
                                    pagination
                                    responsive
                                    subHeaderAlign="right"
                                    fixedHeader
                                    fixedHeaderScrollHeight="193px"
                                    subHeaderWrap
                                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                            </div>
                        </div>
                        <div className="col-12 text-right pr-1 pb-2" style={{ position: 'absolute', top: '33%', right: '32%' }}>
                        </div>
                    </div>
                    <div className="row px-3 g-2">
                        <div className={`col-12 col-md-12  pb-2 pl-0`} style={{ border: '1px solid #999', borderRadius: '6px' }}>
                            <div className="row mb-2">
                                <div className="col-12 pl-3">
                                    <SubTab tabs={PersTabs} setShowPage={setShowPage} showPage={showPage} count={count} showCount={showCount} />
                                </div>
                            </div>

                            {/* Tabs */}
                            {/* {
                                showPage === 'home' ?
                                    <Home {...{ PINID, setShowCount, setPINID, agencyId, editValueList, EffectiveScreenPermission, get_PersonnelList, get_Personnel_Lists, setModalOpen, setShowCount, personnelList }} />
                                    :
                                    showPage === 'characteristics,dates & numbers' ?
                                        <Dates {...{ PINID, status, editValueList, agencyId }} />
                                        :
                                        showPage === 'emergency contact' ?
                                            <Emergency {...{ PINID, status, agencyId }} />
                                            :
                                            showPage === 'effective screen permission' ?
                                                <Effectivepermission {...{ PINID, status, agencyId }} />
                                                :
                                                showPage === 'group' ?
                                                    <PersonnelGroup {...{ PINID, status, agencyId }} />
                                                    :
                                                    showPage === 'effective field permisson' ?
                                                        <EffectiveFieldPermission {...{ PINID, status, agencyId }} />
                                                        : ''
                            } */}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PersonnelModal