import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, fetch_Post_Data, UtilityPersonnelScreenPermision } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Filter } from '../../../../Filter/Filter';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import WarrantORI_Add_Up from './WarrantORI_Add_Up';

const WarrantORI = () => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [DataList, setDataList] = useState();
    const [filterDataList, setFilterDataList] = useState();
    const [status, setStatus] = useState(false);
    // const [tabstatus, setTabStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState("1")
    const [modal, setModal] = useState(false)
    // FilterData 
    const [filterTypeIdOption, setfilterTypeIdOption] = useState('Contains');
    const [filterTypeDescOption, setfilterTypeDescOption] = useState('Contains');
    const [updateStatus, setUpdateStatus] = useState(0)
    //filter SearchVal

    const [searchValue1, setSearchValue1] = useState('')
    const [searchValue2, setSearchValue2] = useState('')

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [IsSuperadmin, setIsSuperadmin] = useState(0);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IsSuperadmin: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IsSuperadmin) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setIsSuperadmin(localStoreArray?.IsSuperadmin);
                get_Data_List(localStoreArray?.AgencyID, localStoreArray?.PINID, localStoreArray?.IsSuperadmin);
            }
        }
        setfilterTypeIdOption('Contains'); setfilterTypeDescOption('Contains');
    }, [localStoreArray, pageStatus])

    // useEffect(() => {
    //     get_Data_List();   
    // }, [pageStatus])

    const get_Data_List = (AgencyID, PINID, IsSuperadmin) => {
        const val = {
            IsActive: pageStatus,
            AgencyID: AgencyID,
            IsSuperadmin: IsSuperadmin,
            PINID: PINID,
        }
        fetch_Post_Data('WarrantORI/GetData_WarrantORI', val).then((res) => {
                if (res) {
                    setDataList(res?.Data)
                    setFilterDataList(res?.Data);
                    setEffectiveScreenPermission(res?.Permision)
                }
                else { setDataList(); setFilterDataList(); setEffectiveScreenPermission() }
            })
    }

    const [IsActive, setIsActive] = useState('')
    const [singleTypeId, setSingleTypeId] = useState('')
    const [confirmType, setConfirmType] = useState('')

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': IsActive,
            'WarrantORIID': singleTypeId,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('WarrantORI/Delete_WarrantORI', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message); get_Data_List(LoginAgencyID, LoginPinID, IsSuperadmin);
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: 10 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, left: 15 }}>

                    {
                        pageStatus === "1" ?
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.ChangeOK ?
                                <Link to="/ListManagement?page=Warrant ORI" data-toggle="modal" data-target="#WarrantORIModel" onClick={(e) => { setEditValue(e, row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                                : <></>
                            : <></>
                    }



                </div>
            </>
        },
        {
            name: 'ORI Number',
            selector: (row) => row.ORINumber,
            sortable: true
        },
        {
            name: 'State Code',
            selector: (row) => row.Agency_State,
            sortable: true
        },

        {
            name: 'Agency Code',
            selector: (row) => row.AgencyCode,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: 'AgencyName',
            selector: (row) => row.AgencyName,
            sortable: true
        },

        {
            name: 'Agency',
            selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'IsEditable',
            selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 60 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Warrant ORI" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.WarrantORIID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Warrant ORI" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.WarrantORIID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                            : <></>
                            :
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Warrant ORI" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.WarrantORIID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Warrant ORI" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.WarrantORIID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                    }
                </div>
            </>
        }
    ]

    const checkEdittable = (val) => {
        const check = { "1": true, "0": false };
        return check[val]
    }

    // to set Button add or update condition
    const setEditValue = (e, row) => {
        setUpdateStatus(updateStatus + 1); setSingleTypeId(row.WarrantORIID)
        setModal(true)
        setStatus(true);
    }

    const setStatusFalse = (e) => {
        setStatus(false);
        setModal(true)
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-12 ">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link ${pageStatus === '1' ? 'active' : ''}`} onClick={() => setPageStatus("1")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">Active</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className={`nav-link ${pageStatus === '0' ? 'active' : ''}`} onClick={() => setPageStatus("0")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">InActive</a>
                        </li>
                    </ul>
                </div>
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">Warrant ORI</p>
                                {
                                    pageStatus === '1' ?
                                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                            <Link to="/ListManagement?page=Warrant ORI" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#WarrantORIModel" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                            : <></>
                                            : <Link to="/ListManagement?page=Warrant ORI" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#WarrantORIModel" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-2 ">
                    <div className="row">
                        <div className="col-5">
                            <input type="text" onChange={(e) => {
                                setSearchValue1(e.target.value);
                                const result = Filter(DataList, e.target.value, searchValue2, filterTypeIdOption, 'ChargeCode', 'Description')
                                setFilterDataList(result)
                            }}
                                className='form-control' placeholder='Search By Code...' />
                        </div>
                        <div className='col-1'>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <i className="fa fa-filter"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('Contains')}>Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-5">
                            <input type="text" onChange={(e) => {
                                setSearchValue2(e.target.value)
                                const result = Filter(DataList, searchValue1, e.target.value, filterTypeDescOption, 'ChargeCode', 'Description')
                                setFilterDataList(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>
                        <div className='col-1'>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <i className="fa fa-filter"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('Contains')}>Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                <DataTable
                                    columns={columns}
                                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? filterDataList : '' : ''}
                                    dense
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[5, 10, 15]}
                                    highlightOnHover
                                    noContextMenu
                                    pagination
                                    responsive
                                    subHeaderAlign="right"
                                    // fixedHeader
                                    subHeaderWrap
                                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <WarrantORI_Add_Up {...{ LoginPinID, IsSuperadmin, LoginAgencyID, singleTypeId, status, get_Data_List, DataList, modal, setModal, updateStatus }} />
            <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default WarrantORI 