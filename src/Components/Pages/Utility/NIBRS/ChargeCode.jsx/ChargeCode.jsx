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
import ChargeCode_Add_Up from './ChargeCode_Add_Up';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const ChargeCode = () => {


    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

    const [DataList, setDataList] = useState();
    const [filterDataList, setFilterDataList] = useState();
    const [status, setStatus] = useState(false);
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [codeSortOrder, setCodeSortOrder] = useState('Asc');
    const [descriptionSortOrder, setDescriptionSortOrder] = useState('Asc');
    const [activeColumn, setActiveColumn] = useState('Code');
    const [orderTypeCode, setOrderTypeCode] = useState('Asc');
    const [orderTypeDescription, setOrderTypeDescription] = useState('Asc');
    const [fillterListData, setFillterListData] = useState([])
    const [lodaer, setLodaer] = useState(false)
    const [listData, setListData] = useState([])


    const getUrl = "ChargeCodes/GetData_ChargeCodes"

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
                get_data(localStoreArray?.AgencyID, localStoreArray?.PINID, localStoreArray?.IsSuperadmin);
            }
        }
        setfilterTypeIdOption('Contains'); setfilterTypeDescOption('Contains');
    }, [localStoreArray, pageStatus])

    useEffect(() => {
        if (getUrl) setPageStatus('1'); setSearchValue1(''); setSearchValue2('')
    }, [getUrl])

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue1, searchValue2]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch_Post_Data(getUrl, {
                    PageCount: currentPage,
                    PageRecord: itemsPerPage,
                    AgencyID: '',
                    ChargeCode: searchValue1,
                    Description: searchValue2,
                    IsActive: pageStatus,
                    IsSuperAdmin: '1',
                    PINID: '1',
                    OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
                    OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
                });

                if (res) {
                    console.log(res, "response")
                    setDataList(changeArrayFormat(res?.Data));
                    setFillterListData(changeArrayFormat(res?.Data));
                    setLodaer(true);
                    setEffectiveScreenPermission(res?.Permision);
                    setTotalRows(res?.Data[0]?.Count || 0);
                } else {
                    setDataList([]);
                    setFillterListData([]);
                    setLodaer(true);
                    setEffectiveScreenPermission(null);
                    setTotalRows(0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setDataList([]);
                setFillterListData([]);
                setLodaer(true);
                setEffectiveScreenPermission(null);
                setTotalRows(0);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, searchValue1, searchValue2, getUrl, activeColumn, orderTypeCode, orderTypeDescription]);
    const handleSort = (column, sortDirection) => {
        if (column.name === 'Code') {
            const newSortOrder = codeSortOrder === 'Asc' ? 'Desc' : 'Asc';
            setCodeSortOrder(newSortOrder);
            setOrderTypeCode(newSortOrder);
            setActiveColumn('Code');
        } else if (column.name === 'Description') {
            setOrderTypeDescription(sortDirection);
            setActiveColumn('Description');
        }
    };
    useEffect(() => {
        get_data()
    }, [])

    const get_data = () => {
        const val = {
            PageCount: currentPage,
            PageRecord: itemsPerPage,
            AgencyID: '',
            ChargeCode: searchValue1,
            Description: searchValue2,
            IsActive: pageStatus,
            IsSuperAdmin: '1',
            PINID: '1',
            OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
            OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
        };

        setLodaer(false);
        fetch_Post_Data(getUrl, val)
            .then((res) => {
                console.log(res, "response")
                if (res) {
                    setListData(changeArrayFormat(res?.Data));
                    setFillterListData(changeArrayFormat(res?.Data));
                    setLodaer(true);
                    setEffectiveScreenPermission(res?.Permision);
                    setTotalRows(res?.Data[0]?.Count || 0);
                } else {
                    setListData([]);
                    setFillterListData([]);
                    setLodaer(true);
                    setEffectiveScreenPermission(null);
                    setTotalRows(0);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setListData([]);
                setFillterListData([]);
                setLodaer(true);
                setEffectiveScreenPermission(null);
                setTotalRows(0);
            });
    };

    const [IsActive, setIsActive] = useState('')
    const [singleTypeId, setSingleTypeId] = useState('')
    const [confirmType, setConfirmType] = useState('')

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': IsActive,
            'ChargeCodeID': singleTypeId,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('ChargeCodes/DeleteChargeCodes', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message); get_data(LoginAgencyID, LoginPinID, IsSuperadmin);
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
            name: 'Code',
            selector: (row) => row.Code,
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
                <div style={{ position: 'absolute', top: 0, right: 40 }}>

                    {
                        pageStatus === "1" ?
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.ChangeOK ?
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#CFSModal" onClick={(e) => { setEditValue(e, row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                                : <></>
                            : <></>
                    }

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                            : <></>
                            :
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                    }
                </div>
            </>
        }
    ]

    const handlePageChange = (page) => {
        setCurrentPage((prevPage) => {
            return page;
        }, () => {
            get_data();
        });
    };

    const checkEdittable = (val) => {
        const check = { "1": true, "0": false };
        return check[val]
    }

    // to set Button add or update condition
    const setEditValue = (e, row) => {
        setUpdateStatus(updateStatus + 1); setSingleTypeId(row.ChargeCodeID)
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
                                <p className="p-0 m-0">Charge Code</p>
                                {
                                    pageStatus === '1' ?
                                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                            <Link to="/ListManagement?page=Charge Code" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#CFSModal" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                            : <></>
                                            : <Link to="/ListManagement?page=Charge Code" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#CFSModal" >
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
                        {/* <div className='col-1'>
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
                        </div> */}
                        <div className="col-5">
                            <input type="text" onChange={(e) => {
                                setSearchValue2(e.target.value)
                                const result = Filter(DataList, searchValue1, e.target.value, filterTypeDescOption, 'ChargeCode', 'Description')
                                setFilterDataList(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>
                        {/* <div className='col-1'>
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
                        </div> */}
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                <DataTable
                                    columns={columns}
                                    data={fillterListData}
                                    dense
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    paginationPerPage={itemsPerPage}
                                    onChangeRowsPerPage={setItemsPerPage}
                                    onChangePage={handlePageChange}
                                    onSort={handleSort}
                                    highlightOnHover
                                    noContextMenu
                                    responsive
                                    subHeaderAlign="right"
                                    subHeaderWrap
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChargeCode_Add_Up {...{ LoginPinID, IsSuperadmin, LoginAgencyID, singleTypeId, status, get_data, DataList, modal, setModal, updateStatus }} />
            <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default ChargeCode


const changeArrayFormat = (data, col1, col4) => {
    if (!data || !Array.isArray(data)) {
        return [];
    }

    return data.map((item) => ({
        Code: item.ChargeCode,  // Assuming col1 represents the property name for the Code column in your data
        AgencyCode: item.AgencyCode || '',  // Replace 'AgencyCode' with the actual property name in your data
        Description: item.Description || '',  // Replace 'Description' with the actual property name in your data
        MultiAgency_Name: item.MultiAgency_Name,
        IsEditable: item.IsEditable,
        ChargeCodeID: item.ChargeCodeID || '',
        IsActive: item.IsActive
        // Add more properties as needed
    }));
};




