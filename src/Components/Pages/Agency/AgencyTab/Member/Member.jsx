// Import Component
import React, { useState, useEffect } from 'react'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Member = ({ aId }) => {

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // Hooks Initialization
    const [application, setAppliation] = useState([])
    const [groupList, setGroupList] = useState([])
    const [groupMemberListData, setGroupMemberListData] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [pinId, setPinID] = useState('');

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
                application_List();
                setPinID(localStoreArray?.PINID);
                get_Group_List(aId);
                get_EffectiveScreen_Permission(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])
    
    const [value, setValue] = useState({
        'ApplicationId': '',
        'GroupName': '',
        'GroupID': '',
    })

    // Onload Function
    // useEffect(() => {
    //     application_List();
    //     get_Group_List(aId);
    //     get_EffectiveScreen_Permission(aId, pinId)
    // }, [aId])

    // Get Appliction List 
    const application_List = () => {
        fetchData("DropDown/GetData_Application").then((data) => {
            if (data) setAppliation(data)
        })
    }

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinId) => {
        const val = {
            PINID: pinId,
            ApplicationID: '1',
            code: 'A003',
            AgencyID: aId
        }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) setEffectiveScreenPermission(res)
                else setEffectiveScreenPermission()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Get Group list
    const get_Group_List = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                // console.log(changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID));
                if (res[0]?.GroupID) get_Group_Member_List(res[0]?.GroupID); setValue({ ...value, ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID) })
            } else {
                setGroupList()
            }
        })
    }

    // onChange Hooks Function
    const groupChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['GroupID']: e.value
            })
            get_Group_Member_List(e.value)
        } else setGroupMemberListData()
    }

    // Group member List
    const get_Group_Member_List = (GroupID) => {
        const value = {
            GroupID: GroupID,
            AgencyID: aId
        }
        fetchPostData("SecurityGroupUserMembers/GetGroupMemberListData", value).then((data) => {
            if (data) setGroupMemberListData(data)
            else setGroupMemberListData()
        })
    }

    // Update Group Member
    const update_Group_Member_List = (e, id) => {
        e.preventDefault()
        const value = {
            "GroupID": id.GroupID,
            "PINID": id.PINID,
            "ModifiedByUserFK": pinId,
        }
        AddDeleteUpadate("SecurityGroupUserMembers/UpdateGroupMembers", value).then((data) => {
            if (data) toastifySuccess(data.Message); get_Group_Member_List(value.GroupID);
        })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Group IN',
            selector: (row) => <input type="checkbox" checked={row.GroupIN} disabled={
                EffectiveScreenPermission ?
                    EffectiveScreenPermission[0]?.Changeok === 0 ? true
                        : false
                    : false
            } onClick={(e) => update_Group_Member_List(e, row)} />,
            sortable: true
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Agency Name',
            selector: (row) => row.Agency_Name,
            sortable: true
        }
    ]

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Member
                        </p>
                    </div>
                    <div className="row mt-2">
                        <div className="col-6 mt-4 dropdown__box">
                            {/* <Select 
                            styles={customStyles} name="GroupID"
                                options={groupList?.map((sponsor) =>
                                (
                                    { label: sponsor.GroupName, GroupID: sponsor.GroupID })
                                )}
                                placeholder={value.GroupName}
                                onChange={groupChange}
                            /> */}
                            {
                                value?.GroupName ?
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        defaultValue={value?.GroupName}
                                        options={groupList}
                                        isClearable
                                        onChange={groupChange}
                                    /> : <><Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        options={groupList}
                                        isClearable
                                        onChange={groupChange} /></>
                            }
                            <label htmlFor="">Group Name</label>

                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-12">
                            <DataTable
                                dense
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? groupMemberListData : '' : ''}
                                // paginationPerPage={'5'}
                                // fixedHeader
                                // fixedHeaderScrollHeight="195px"
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

export default Member;

export const changeArrayFormat = (data, type) => {
    if (type === 'group') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.GroupID, label: sponsor.GroupName, })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
    if (type === 'group') {
        const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
            ({ value: sponsor.GroupID, label: sponsor.GroupName })
        )
        return result[0]
    }
}
