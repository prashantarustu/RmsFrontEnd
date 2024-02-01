import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { getShowingDateText } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';

const PawnInformation = () => {

    const { localStoreArray, get_LocalStorage, storeData, deleteStoreData } = useContext(AgencyContext);

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [pawnInfoID, setpawnInfoID] = useState('');
    const [DataList, setDataList] = useState();

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
        fetchPostData('Pawn/GetData_Pawn', val).then((res) => {
            if (res) {
                console.log(res)
                setDataList(res);
            } else {
                setDataList([]);
            }
        })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Pledgor Name',
            selector: (row) => row.PledgorName,
            sortable: true
        },
        {
            name: 'Buyer Name',
            selector: (row) => row.BuyerName,
            sortable: true
        },
        {
            name: 'Pawn Broker Issue',
            selector: (row) => row.PawnBrokerIssue,
            sortable: true
        },
        {
            name: 'Pawn Date',
            selector: (row) => row.PawnDate ? getShowingDateText(row.PawnDate) : '',
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    <Link to="/PawnInformation-details" onClick={() => { setEditVal(row); }}
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                    </Link>
                </div>
            </>
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 8 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setpawnInfoID(row?.PawnID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setpawnInfoID(row?.PawnID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const setEditVal = (row) => {
        if (row.PawnID) {
            storeData({ 'PawnID': row.PawnID, 'PawnStatus': true, })
            setpawnInfoID(row?.PawnID);
        }
    }

    const DeletePin = () => {
        const val = {
            IsActive: true,
            PawnID: pawnInfoID,
            DeletedByUserFK: LoginPinID,
        }
        AddDeleteUpadate('Pawn/DeletePawn', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Data(LoginAgencyID)
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Pawn Information
                                    </p>
                                    <p className="p-0 m-0">
                                        <Link to="/PawnInformation-details" onClick={() => { deleteStoreData({ 'PawnID': '', 'PawnStatus': '', }) }} className="text-white"
                                            data-toggle="modal" data-target="#PawnModal" >
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                    </p>
                                </div>
                                <div className="table-responsive mt-2">
                                    <div className="col-12">
                                        <div className="row ">
                                            <div className="col-12">
                                                <DataTable
                                                    columns={columns}
                                                    // data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? filterDataList : '' : ''}
                                                    data={DataList ? DataList : []}
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
            <DeletePopUpModal func={DeletePin} />
        </>
    )
}

export default PawnInformation