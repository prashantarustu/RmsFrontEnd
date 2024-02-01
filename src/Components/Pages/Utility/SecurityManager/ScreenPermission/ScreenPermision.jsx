// Import Component
import React, { useState, useEffect, useContext } from 'react'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const ScreenPermission = () => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, incidentNumber, setIncidentNumber, } = useContext(AgencyContext);
    // Hooks Initialization
    const [moduleFK, setModuleFK] = useState([])
    const [tableList, setTableList] = useState([])
    const [groupFieldPermissions, setGroupFieldPermissions] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([])
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const [value, setValue] = useState({
        'ApplicationId': '',
        'ModuleFK': '',
        'TableID': ''
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", Agency_Name: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    useEffect(() => {
        get_ModuleFK('1');
        if (LoginPinID && LoginAgencyID) {
            getScreenPermision(LoginAgencyID, LoginPinID)
        }
    }, [LoginAgencyID, LoginPinID])

    // onChange Hooks Function
    const handleChange = (e, row) => {
        update_GroupField_Permissions(e, row)
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("A008", LoginAgencyID, LoginPinID).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }



    const ModuleFKChange = (e) => {
        if (e) {
            setValue({ ...value, ['ModuleFK']: e.value, ['TableID']: '' })
            getTableListName(e.value);
            setTableList([]);
            setGroupFieldPermissions([])
        } else {
            setValue({
                ...value,
                ['ModuleFK']: null, ['TableID']: ''
            })
            setTableList([]);
            setGroupFieldPermissions([])
        }
    }

    const tableChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['TableID']: e.value
            })
            get_GroupField_Permissions(e.value);
        } else {
            setValue({
                ...value,
                ['TableID']: ''
            })
            setGroupFieldPermissions([])
        }
    }

    // Get Module and Application Screen And Group Field permission   
    const get_ModuleFK = (id) => {
        const val = {
            ApplicationId: id
        }
        fetchPostData('ScreenPermission/GetData_Module', val)
            .then(res => {
                if (res) { setModuleFK(changeArrayFormat(res, 'modul')); }
                else setModuleFK([])
            })
    }

    // css-qc6sy-singleValue
    const getTableListName = (id) => {
        const val = {
            ModuleID: id,
        }
        fetchPostData('TableManagement/GetData_TableManagement', val)
            .then(res => {
                if (res) {
                    setTableList(changeArrayFormat(res, 'screen'))
                }
                else {
                    setTableList();
                    setGroupFieldPermissions()
                }
            })
    }

    const get_GroupField_Permissions = (TableId) => {
        const val = {
            'AgencyID': LoginAgencyID,
            'TableId': TableId
        }
        fetchPostData('TablePermission/GetData_GroupTablePermissions', val)
            .then(res => {
                if (res) { setGroupFieldPermissions(res); }
                else setGroupFieldPermissions()
            })
    }

    // Update group field permission
    const update_GroupField_Permissions = (e, row) => {
        const val = {
            'Display': e.target.name === 'Display' ? e.target.checked : row.Display,
            'Add': e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            'Change': e.target.name === 'Change' ? e.target.checked : row.Change,
            'Delete': e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            'permID': row.Id,
        }
        console.log(val)
        AddDeleteUpadate('TablePermission/UpdateGroupTablePermissions', val)
            .then(res => {
                toastifySuccess(res.data);
                get_GroupField_Permissions(value.TableID)
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" checked={row.Display} value={row.GroupId} name='Display' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.GroupId} name='AddOK' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Change} value={row.GroupId} name='Change' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.GroupId} name='DeleteOK' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        }

    ]

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row px-3">
                                    <div className="col-12 pt-2 p-0">
                                        <div className="row ">
                                            <div className="col-6 mt-2 dropdown__box">
                                                <Select
                                                    value={moduleFK?.filter((obj) => obj.value === value?.ModuleFK)}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="ModuleFK"
                                                    options={moduleFK}
                                                    isClearable
                                                    onChange={ModuleFKChange}
                                                />
                                                <label htmlFor="">Module</label>
                                            </div>
                                            <div className="col-6 mt-2 dropdown__box">
                                                <Select
                                                    value={tableList?.filter((obj) => obj.value === value?.TableID)}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="TableID"
                                                    options={tableList}
                                                    isClearable
                                                    onChange={tableChange}
                                                />
                                                <label htmlFor="">Table Name</label>
                                            </div>
                                        </div>
                                        <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">
                                                Security Manager
                                            </p>
                                        </div>
                                        <div className="row ">
                                            <div className="col-12 mt-2">
                                                <DataTable
                                                    columns={columns}
                                                    data={groupFieldPermissions}
                                                    // data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? groupFieldPermissions : '' : ''}
                                                    dense
                                                    // paginationPerPage={'5'}
                                                    paginationRowsPerPageOptions={[10, 15]}
                                                    highlightOnHover
                                                    noContextMenu
                                                    pagination
                                                    responsive
                                                    subHeaderAlign="right"
                                                    subHeaderWrap
                                                // noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
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
        </>
    )
}

export default ScreenPermission

export const changeArrayFormat = (data, type) => {
    if (type === 'modul') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ModulePK, label: sponsor.ModuleName, })
        )
        return result
    }
    if (type === 'screen') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.TableID, label: sponsor.Name, })
        )
        return result
    }
}
