import { Dropdown } from 'bootstrap';
import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { One_Value_Search_Filter } from '../../../Filter/Filter';
import PreviousYearCounter_Add_Up from './PreviousYearCounter_Add_Up';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData } from '../../../hooks/Api';

const PreviousYearCounter = () => {

    const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [DataList, setDataList] = useState();
    const [dataListFillter, setDataListFillter] = useState([]);
    const [filterOption, setfilterOption] = useState('Contains');
    const [searchValue, setSearchValue] = useState('');
    const [status, setStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState(1);
    const [modal, setModal] = useState(false);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [preYearCountID, setPreYearCountID] = useState('');

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                get_Data(localStoreArray.AgencyID)
            }
        }
    }, [localStoreArray]);

    const get_Data = (AgencyID) => {
        const val = {
            'AgencyID': AgencyID,
        }
        fetchPostData('Counter/GetData_CounterForPreviousYear', val).then((res) => {
            if (res) {
                setDataList(res);
            } else {
                setDataList([]);
            }
        })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Counter Type',
            selector: (row) => row.CounterType,
            sortable: true
        },
        // {
        //     name: 'Application',
        //     selector: (row) => row.Application,
        //     sortable: true
        // },
        {
            name: 'Counter_Format',
            selector: (row) => row.Format,
            sortable: true
        },
        {
            name: 'Year',
            selector: (row) => row.Year,
            sortable: true
        },
        {
            name: 'Last Number',
            selector: (row) => row.LastNumber,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    <Link to="#" onClick={() => { setEditVal(row); }} data-toggle="modal" data-target="#PreviousCounterModal"
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                    </Link>
                </div>
            </>
        }
    ]

    const setEditVal = (row) => {
        if (row.CounterID) {
            setPreYearCountID(row?.CounterID);
            setPageStatus(pageStatus + 1);
        }
        setModal(true); setStatus(true);
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 ">
                                        <div className="row mt-2">
                                            <div className="col-12 ">
                                                <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Previous Year Counter</p>
                                                    <p className="p-0 m-0">
                                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                                            onClick={() => { setStatus(false); setModal(true); setPreYearCountID(''); setPageStatus(pageStatus + 1) }}
                                                            data-toggle="modal" data-target="#PreviousCounterModal">
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-2 ">
                                        <div className="row">
                                            <div className="col-5">
                                                <input type="text" onChange={(e) => {
                                                    setSearchValue(e.target.value);
                                                    const result = One_Value_Search_Filter(DataList, e.target.value, filterOption, 'CounterDesc')
                                                    setDataListFillter(result)
                                                }}
                                                    className='form-control' placeholder='Search By Name...' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive mt-2">
                                        <div className="col-12">
                                            <div className="row ">
                                                <div className="col-12">
                                                    <DataTable
                                                        columns={columns}
                                                        // data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? DataList : [] : []}
                                                        data={DataList ? DataList : []}
                                                        dense
                                                        paginationPerPage={'10'}
                                                        paginationRowsPerPageOptions={[5, 10, 15]}
                                                        highlightOnHover
                                                        noContextMenu
                                                        pagination
                                                        responsive
                                                        subHeaderAlign="right"
                                                        subHeaderWrap
                                                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
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
            <PreviousYearCounter_Add_Up {...{ preYearCountID, LoginPinID, LoginAgencyID, modal, pageStatus, setModal, get_Data, status }} />

        </>
    )
}

export default PreviousYearCounter