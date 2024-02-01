import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Tab from '../../Utility/Tab/Tab'
import DataTable from 'react-data-table-component'
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../hooks/Api'
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../Common/Utility'
import { useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import ThreeFilter from '../../Filter/ThreeFilter'

const Name = () => {

    const { get_Incident_Count, setIncStatus, get_Name_Count, updateCount, setUpdateCount, get_Data_Name, nameData, setNameStatus, nameFilterData, setNameFilterData, nameShowPage, setNameShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus, deleteStoreData, storeData } = useContext(AgencyContext);

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', Agency_Name: '', IncidentNumber: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IncidentID) {
                get_Data_Name(localStoreArray?.IncidentID);
                get_Incident_Count(localStoreArray?.IncidentID);
            }
            getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            setIncidentStatus(true);
        }
        setNameShowPage('home')
    }, [localStoreArray])

    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        // ScreenPermision("I028", LoginAgencyID, LoginPinID).then(res => {
        //     if (res) {
        //         setEffectiveScreenPermission(res)
        //     } else {
        //         setEffectiveScreenPermission()
        //     }
        // });
    }

    const columns = [
        {
            width: '100px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={'/nametab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 ">
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={'/nametab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 ">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>
            </>
        },
        {
            name: 'Name',
            selector: (row) => row.FullName,
            // selector: (row) => row.LastName + ' ' + row.FirstName + ',' + row.MiddleName,
            // selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => row.Gender,
            sortable: true
        },
        {
            name: 'DOB',
            // selector: (row) => row.DateOfBirth,
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",

            sortable: true
        },
        {
            name: 'Race',
            selector: (row) => row.Description_Race,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'Reason Code',
            // selector: (row) => row.Address,
            selector: (row) => <>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        // {
        //     name: 'Address',
        //     // selector: (row) => row.Address,
        //     selector: (row) => <>{row?.Address ? row?.Address.substring(0, 50) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
        //     sortable: true
        // },
        // {
        //     name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
        //     cell: row => <>
        //         <div style={{ position: 'absolute', top: 0,  }}>
        //         {
        //             EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
        //                 <Link to={'/nametab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 ">
        //                     <i className="fa fa-edit"></i>
        //                 </Link>
        //                 : <></>
        //                 : <Link to={'/nametab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 ">
        //                     <i className="fa fa-edit"></i>
        //                 </Link>
        //         }
        //     </div>
        // {/* {
        //             EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
        //                 <Link to={`#`} onClick={(e) => setNameId(row.NameID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //                     <i className="fa fa-trash"></i>
        //                 </Link>
        //                 : <></>
        //                 : <Link to={`#`} onClick={(e) => setNameId(row.NameID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //                     <i className="fa fa-trash"></i>
        //                 </Link>
        //         } */}
        //     </>
        // }
    ]

    const set_Edit_Value = (e, row) => {
        // console.log(row);
        if (row.NameID || row.MasterNameID) {
            storeData({ 'NameID': row.NameID, 'MasterNameID': row.MasterNameID, 'NameStatus': true });
            get_Name_Count(row.NameID);
        }
        setNameStatus(true)
        setIncStatus(true)
        setUpdateCount(updateCount + 1)
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row" >
                                            <div className="col-12 pl-3  inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12  mt-2">
                                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Name</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/nametab'} onClick={() => {
                                                            // storeData({ 'NameStatus': false });
                                                            deleteStoreData({ 'NameID': '', 'MasterNameID': '', 'NameStatus': '', });
                                                            setNameStatus(false);
                                                            setIncStatus(false);
                                                            get_Name_Count('0');
                                                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="row ">
                                                    <div className="col-12 ">
                                                        <DataTable
                                                            dense
                                                            columns={columns}
                                                            data={nameFilterData}
                                                            pagination
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            subHeader
                                                            responsive
                                                            showPaginationBottom={10}
                                                            subHeaderComponent={<ThreeFilter Data={nameData} setResult={setNameFilterData} Col1='LastName' Col2='SSN' Col3='Address' searchName1='LastName' searchName2='SSN' searchName3='Address' />}
                                                            subHeaderAlign='left'
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

export default Name