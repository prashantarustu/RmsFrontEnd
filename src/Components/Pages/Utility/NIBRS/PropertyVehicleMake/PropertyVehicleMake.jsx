import React, { useEffect, useState, memo, useContext } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
// import { AddDeleteUpadate, fetch_Post_Data } from '../../../hooks/Api';
// import Loader from '../../../Common/Loader';
// import Add_UpCom from './Add_UpCom';
// import ConfirmModal from '../../../Common/ConfirmModal';
// import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
// import { Filter} from '../../../Filter/Filter';
// import { AgencyContext } from '../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetch_Post_Data } from '../../../../hooks/Api';
// import { Loader } from 'semantic-ui-react';
import Add_UpCom from '../../ListManagement/Add_UpCom';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Filter } from '../../../../Filter/Filter';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Loader from '../../../../Common/Loader';
import { Decrypt_Id_Name } from '../../../../Common/Utility';

const PropertyVehicleMake = (props) => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const { getUrl, col1, col2, col3, col4, openPage, addUrl, singleDataUrl, upUrl, delUrl } = props

    const [pageStatus, setPageStatus] = useState("1")
    const [listData, setListData] = useState([])
    const [fillterListData, setFillterListData] = useState([])
    const [lodaer, setLodaer] = useState(false)
    const [modal, setModal] = useState(false)
    const [id, setId] = useState('');
    const [updateStatus, setUpdateStateus] = useState(0)
    const [status, setStatus] = useState(false);
    const [IsActive, setIsActive] = useState('');
    const [confirmType, setConfirmType] = useState('');
    const [filterTypeIdOption, setfilterTypeIdOption] = useState('Contains');
    const [filterTypeDescOption, setfilterTypeDescOption] = useState('Contains');
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    //filter SearchVal
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
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


    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IsSuperadmin: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID && !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setIsSuperadmin(localStoreArray?.IsSuperadmin);
                get_data(localStoreArray?.AgencyID, localStoreArray?.PINID, localStoreArray?.IsSuperadmin);

            }
        }
        setfilterTypeIdOption('Contains'); setfilterTypeDescOption('Contains');

    }, [localStoreArray, openPage, pageStatus])

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
                    PropertyVehicleMakeCode: searchValue1,
                    Description: searchValue2,
                    IsActive: pageStatus,
                    IsSuperAdmin: '1',
                    PINID: '1',
                    OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
                    OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
                });

                if (res) {
                    setListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setFillterListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
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
            } catch (error) {
                console.error('Error fetching data:', error);
                setListData([]);
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
            PropertyVehicleMakeCode: searchValue1,
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
                if (res) {
                    setListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setFillterListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
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


    // const handleNextClick = () => {

    //     setCurrentPage((prevPage) => prevPage + 1);
    //     const nextPage = currentPage + 1;
    //     setCurrentPage(nextPage);
    //     get_data(LoginAgencyID, LoginPinID, IsSuperadmin, nextPage, itemsPerPage);
    // };

    // const handlePreviousClick = () => {
    //     const previousPage = currentPage - 1;
    //     setCurrentPage(previousPage);
    //     get_data(LoginAgencyID, LoginPinID, IsSuperadmin, previousPage, itemsPerPage);
    // };

    // const handleNextClick = () => {
    //     const nextPage = currentPage + 1;
    //     setCurrentPage(nextPage);
    //     get_data(LoginAgencyID, LoginPinID, IsSuperadmin, nextPage);
    // };


    const handlePageChange = (page) => {
        setCurrentPage((prevPage) => {
            return page;
        }, () => {
            // Now you can safely call get_data with the updated currentPage
            get_data();
        });
    };

    const checkEdittable = (val) => { const check = { "1": true, "0": false }; return check[val] }

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
        // {
        //     name: 'Agency',
        //     selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
        //     sortable: true
        // },
        {
            name: 'IsEditable',
            selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
            sortable: true
        },
        // {
        //     name: 'Current Phone',
        //     selector: (row) => <><input type="checkbox" checked={row.IsEditable} disabled /></>,
        //     sortable: true
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    {
                        pageStatus === "1" ?
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.ChangeOK ?
                                <Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#Modal" onClick={(e) => { setEditValue(e, row); setUpdateStateus(updateStatus + 1) }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                                : <></>
                            : <></>
                    }
                    {EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                        pageStatus === "1" ?
                            < Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setId(row.id); setIsActive('0'); setConfirmType("InActive") }}
                                className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                            </Link>
                            :
                            <Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setId(row.id); setIsActive('1'); setConfirmType("Active"); }}
                                className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                            </Link>
                        : <></>
                        : <></>
                    }
                </div>
            </>
        }
    ]

    // to set Button add or update condition
    const setEditValue = (e, row) => {
        // e.prevent
        setId(row.id);
        setModal(true); setStatus(true);
    }

    const setStatusFalse = (e) => {
        setStatus(false);
        setModal(true)
        setId(null);
    }

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': IsActive,
            [col3]: id,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate(delUrl, value)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_data(LoginAgencyID, LoginPinID, IsSuperadmin);
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-12 ">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class={`nav-link ${pageStatus === '1' ? 'active' : ''}`} onClick={() => setPageStatus("1")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">Active</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class={`nav-link ${pageStatus === '0' ? 'active' : ''}`} onClick={() => setPageStatus("0")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">InActive</a>
                        </li>
                    </ul>
                </div>
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">{openPage}</p>
                                {
                                    pageStatus === '1' ?
                                        EffectiveScreenPermission ?
                                            EffectiveScreenPermission[0]?.AddOK ?
                                                <Link to={`/ListManagement?page=${openPage}`} onClick={setStatusFalse} className="text-white"
                                                    data-toggle="modal" data-target="#Modal" >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                                :
                                                <></>
                                            :
                                            <>
                                                <Link to={`/ListManagement?page=${openPage}`} onClick={setStatusFalse} className="text-white"
                                                    data-toggle="modal" data-target="#Modal" >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </>
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-2 ">
                    <div className="row">
                        <div className="col-5">
                            <input type="text" value={searchValue1} onChange={(e) => {
                                setSearchValue1(e.target.value);
                                const result = Filter(listData, e.target.value, searchValue2, filterTypeIdOption, 'Code', 'Description')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Code...' />
                        </div>
                        <div className='col-1 '>
                            {/* <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                 
                                    <img src={SendIcon(filterTypeIdOption)} alt="" className='filter-icon mr-1' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('Contains')}>Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeIdOption('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>
                        <div className="col-5">
                            <input type="text" value={searchValue2} onChange={(e) => {
                                setSearchValue2(e.target.value)
                                const result = Filter(listData, searchValue1, e.target.value, filterTypeDescOption, 'Code', 'Description')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>
                        <div className='col-1'>
                            {/* <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                  
                                    <img src={SendIcon(filterTypeDescOption)} alt="" className='filter-icon mr-1' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('Contains')}> Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setfilterTypeDescOption('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                {
                                    lodaer ?
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
                                        :
                                        <Loader />
                                }

                            </div>

                            <div className="col-12">
                                <div className="col-12">
                                    {/* <button onClick={handlePreviousClick}>Previous</button>
                                    <button onClick={handleNextClick}>Next</button> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Add_UpCom {...{ LoginPinID, IsSuperadmin, LoginAgencyID, openPage, modal, setModal, updateStatus, id, col1, col3, addUrl, upUrl, get_data, status, singleDataUrl, listData }} />
            <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default memo(PropertyVehicleMake)

export const changeArrayFormat = (data, col1, col2, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ Code: sponsor[col1], Description: sponsor[col2], MultiAgency_Name: sponsor.MultiAgency_Name, id: sponsor[col3], AgencyCode: sponsor.AgencyCode, IsEditable: sponsor[col4] })
    )
    return result
}


