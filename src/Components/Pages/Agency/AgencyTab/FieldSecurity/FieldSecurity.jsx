// Import Component
import React, { useState, useEffect } from 'react'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const FieldSecurity = ({ agencyId }) => {
    // Hooks Initialization
    const { get_Field_Permision } = useContext(AgencyContext)
    const [moduleFK, setModuleFK] = useState([])
    const [applicationScreen, setApplicationScreen] = useState([])
    const [fieldSecurityList, setFieldSecurityList] = useState([])
    const [fieldSecurityGeropList, setFieldSecurityGeropList] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([])

    const [value, setValue] = useState({
        'ApplicationId': '',
        'ModuleFK': '',
        'AgencyID': agencyId,
        'screenid': '',
        'FieldID': ''
    })

    // Onload Function
    useEffect(() => {
        // fetchData("DropDown/GetData_Application").then((data) => {
        //    if(data) setAppliation(data)
        // })
        get_ModuleFK('1')
        getScreenPermision()
    }, [])

    // onChange Hooks Function 
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
            setFieldSecurityGeropList()
        } else {
            setValue({
                ...value,
                ['screenid']: null
            })
            setFieldSecurityGeropList()
            setApplicationScreen()
            setFieldSecurityList()
        }
    }

    const screenChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['screenid']: e.value
            })
            get_Field_Security(e.value)
        } else {
            setFieldSecurityGeropList()
            setFieldSecurityList()
        }
    }

    const fieldChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['FieldID']: e.value
            })
            get_Field_Security_Group(e.value)
        } else {
            setFieldSecurityGeropList()
        }
    }

    // Get Effective Screeen Permission
    const getScreenPermision = () => {
        ScreenPermision("A012", agencyId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Get Field Security Group List
    const get_Field_Security_Group = (FieldID) => {
        const val = {
            'AgencyID': agencyId,
            'FieldID': FieldID,
        }
        fetchPostData('ScreenPermission/GroupFieldPermissions_GetData', val)
            .then(res => {
                if (res) setFieldSecurityGeropList(res);
                else setFieldSecurityGeropList()
            })
    }

    // Get Appliction Screen List 
    const get_ApplicationScreen = (id) => {
        const val = {
            ModuleFK: id,
            IsChield: 1
        }
        fetchPostData('ScreenPermission/GetData_ApplicationScreen', val)
            .then(res => {
                if (res) {
                    setApplicationScreen(changeArrayFormat(res, 'screen'))
                }
                else {
                    // const collection = document.getElementsByClassName("css-qc6sy-singleValue");
                    // collection[1].innerHTML = " ";
                    // collection[2].innerHTML = " ";
                    setApplicationScreen();
                    setFieldSecurityList();
                }
            })
    }

    // Get Module List 
    const get_ModuleFK = (id) => {
        const val = {
            ApplicationId: id
        }
        fetchPostData('ScreenPermission/GetData_Module', val)
            .then(res => {
                if (res) setModuleFK(changeArrayFormat(res, 'modul'))
                else {
                    setModuleFK()
                }
            })
    }

    // Get Field Security List
    const get_Field_Security = (id) => {
        const val = {
            screenid: id
        }
        fetchPostData('ScreenPermission/GroupField_GetData', val)
            .then(res => {
                if (res) setFieldSecurityList(changeArrayFormat(res, 'Field'))
                else setFieldSecurityList()
            })
    }

    // Update Permission List
    const update_FieldSecurity_Permission = (e, row) => {
        e.preventDefault()
        const { FieldID, AgencyID } = value
        const val = {
            'Display': e.target.name === 'Display' ? e.target.checked : row.Display,
            'Add': e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            'Change': e.target.name === 'Change' ? e.target.checked : row.Change,
            'Delete': e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            'GroupID': row.GroupID,
            'FieldID': row.FieldID,
            'GroupFieldId': row.GroupFieldId,
            'AgencyId': AgencyID,
            'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        AddDeleteUpadate('ScreenPermission/UpdateGroupFieldPermissions', val)
            .then(res => {
                toastifySuccess(res.data);
                get_Field_Security_Group(FieldID)
                get_Field_Permision(agencyId)
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'GroupName',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" checked={row.Display} value={row.GroupID} name='Display' onChange={(e) => update_FieldSecurity_Permission(e, row)} disabled={
                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : ''
            } />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" disabled={
                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : ''
            } checked={row.AddOK} value={row.GroupID} name='AddOK' onChange={(e) => update_FieldSecurity_Permission(e, row)} />,
            sortable: true
        },
        {
            name: 'Modify',
            selector: (row) => <input type="checkbox" disabled={
                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : ''
            } checked={row.Change} value={row.GroupID} name='Change' onChange={(e) => update_FieldSecurity_Permission(e, row)} />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" disabled={
                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok === 1 ? false : true : ''
            } checked={row.DeleteOK} value={row.GroupID} name='DeleteOK' onChange={(e) => update_FieldSecurity_Permission(e, row)} />,
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
                    <div className="row">
                        <div className="col-4 mt-0 dropdown__box">
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
                        <div className="col-4 mt-0 dropdown__box">
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="screenid"
                                options={applicationScreen}
                                isClearable
                                onChange={screenChange}
                            />
                            <label htmlFor="">Application Screen</label>
                        </div>
                        <div className="col-4 mt-0 dropdown__box">
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="FieldID"
                                options={fieldSecurityList}
                                isClearable
                                onChange={fieldChange}
                            />
                            <label htmlFor="">Field Security List</label>
                        </div>
                    </div>
                    <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Field Security
                        </p>

                    </div>
                    <div className="row ">
                        <div className="col-12 mt-2">
                            <DataTable
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? fieldSecurityGeropList : '' : ''}
                                dense
                                paginationPerPage={'5'}
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
        </>
    )
}

export default FieldSecurity

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
    if (type === 'Field') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.FieldID, label: sponsor.Description, })
        )
        return result
    }
}