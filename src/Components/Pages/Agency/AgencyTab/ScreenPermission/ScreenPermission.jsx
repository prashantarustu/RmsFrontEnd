// Import Component
import React, { useState, useEffect } from 'react'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const ScreenPermission = ({ aId }) => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // Hooks Initialization
    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [application, setAppliation] = useState([])
    const [moduleFK, setModuleFK] = useState([])
    const [applicationScreen, setApplicationScreen] = useState([])
    const [groupFieldPermissions, setGroupFieldPermissions] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([])
    const [pinId, setPinID] = useState('');

    const [value, setValue] = useState({
        'ApplicationId': '',
        'ModuleFK': '',
        'AgencyID': aId,
        'screenid': '',
        'GroupId': ''
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", LocalAgencyID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID  || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setPinID(localStoreArray?.PINID);
                get_ModuleFK('1');
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    // useEffect(() => {
    //     // Application Group
    //     // fetchData("DropDown/GetData_Application").then((data) => {
    //     //    if(data) setAppliation(data)
    //     // })
    //     get_ModuleFK('1');
    //     getScreenPermision(aId, pinId)
    // }, [aId])

    // onChange Hooks Function
    const handleChange = (e, row) => {
        setValue({
            ...value,
            ['GroupId']: e.target.value
        });
        update_GroupField_Permissions(e, row)
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A008", aId, pinId).then(res => {
            if (res) { console.log(res); setEffectiveScreenPermission(res); }
            else setEffectiveScreenPermission()
        });
    }

    const ApplicationChange = (e) => {
        setValue({
            ...value,
            ['ApplicationId']: e.ApplicationId
        })
        get_ModuleFK(e.ApplicationId);
    }

    const ModuleFKChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['ModuleFK']: e.value
            })
            get_ApplicationScreen(e.value);
            setApplicationScreen();
            setGroupFieldPermissions()
        } else {
            setApplicationScreen();
            setGroupFieldPermissions()
        }
    }

    const ApplicationScreenChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['screenid']: e.value
            })
            get_GroupField_Permissions(e.value);
        } else {
            setGroupFieldPermissions()
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
                else setModuleFK()
            })
    }

    // css-qc6sy-singleValue
    const get_ApplicationScreen = (id) => {
        const val = {
            ModuleFK: id,
            IsChield: 0
        }
        fetchPostData('ScreenPermission/GetData_ApplicationScreen', val)
            .then(res => {
                if (res) {
                    console.log(res);
                    setApplicationScreen(changeArrayFormat(res, 'screen'))
                }
                else {
                    // const collection = document.getElementsByClassName("css-qc6sy-singleValue");
                    // collection[1].innerHTML = " ";
                    setApplicationScreen();
                    setGroupFieldPermissions()
                }
            })
    }

    const get_GroupField_Permissions = (screenid) => {
        const val = {
            'AgencyID': aId,
            'screenid': screenid
        }
        fetchPostData('ScreenPermission/GetData_GroupScreenPermissions', val)
            .then(res => {
                if (res) {
                    setGroupFieldPermissions(res);
                    console.log(res);
                } else {
                    setGroupFieldPermissions()
                }
            })
    }

    // Update group field permission
    const update_GroupField_Permissions = (e, row) => {
        const { screenid, AgencyID } = value
        const val = {
            'Display': e.target.name === 'Display' ? e.target.checked : row.Display,
            'Add': e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            'Change': e.target.name === 'Change' ? e.target.checked : row.Change,
            'Delete': e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            'GroupID': e.target.value,
            'screenid': screenid,
            'AgencyId': AgencyID,
            'ModifiedByUserFK': pinId,
        }
        AddDeleteUpadate('ScreenPermission/UpdateGroupScreenPermissions', val)
            .then(res => {
                toastifySuccess(res.data);
                get_GroupField_Permissions(screenid)
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
            selector: (row) => <input type="checkbox" checked={row.Display} value={row.GroupId} name='Display'
                disabled={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.GroupId} name='AddOK'
                disabled={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Change} value={row.GroupId} name='Change'
                disabled={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.GroupId} name='DeleteOK'
                disabled={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        }

    ]

    // Custom Style
    const customStyles = {
        option: (styles, { isFocused }) => {

            return {
                ...styles,
                backgroundColor: isFocused ? "#e0ebf3" : null,
                color: "#333333"
            };
        }
    };

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="row ">
                        <div className="col-6 mt-2 dropdown__box">
                            <Select
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
                                className="basic-single"
                                classNamePrefix="select"
                                name="screenid"
                                options={applicationScreen}
                                isClearable
                                onChange={ApplicationScreenChange}
                            />
                            <label htmlFor="">Application Screen</label>
                        </div>
                    </div>
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Screen Permission
                        </p>
                    </div>
                    <div className="row ">
                        <div className="col-12 mt-2">
                            <DataTable
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? groupFieldPermissions : '' : ''}
                                dense
                                // paginationPerPage={'5'}
                                paginationRowsPerPageOptions={[10, 15]}
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
            ({ value: sponsor.ScreenID, label: sponsor.Description, })
        )
        return result
    }
}
