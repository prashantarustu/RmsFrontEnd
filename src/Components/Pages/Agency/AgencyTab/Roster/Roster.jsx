// Import Component
import React, { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchData, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';

const Roster = (props) => {
    const { aId, pinId } = props
    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    // Hooks Initialization
    const [unitList, setUnitList] = useState([]);
    const [unitUserList, setUnitUserList] = useState([]);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

    const [value, setValue] = useState({
        'AgencyID': aId,
        'UnitId': ''
    })

    // Onload Function
    useEffect(() => {
        if (aId) {
            getScreenPermision(aId, pinId)
            get_Unit_List(aId)
        }
    }, [aId])

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A011", aId, pinId).then(res => {
            if (res) { console.log(res); setEffectiveScreenPermission(res) }
            else setEffectiveScreenPermission()
        });
    }

    const get_Unit_List = (aId) => {
        const value = {
            AgencyID: aId,
        }
        fetchPostData('Unit/UnitGetData', value).then((res) => {
            if (res) { setUnitList(changeArrayFormat(res, 'group')) }
            else setUnitList();
        })
    }

    const unitChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['UnitId']: e.value
            })
            unitUser(e.value)
        } else {
            setUnitUserList()
        }
    }

    const unitUser = (id) => {
        const data = {
            UnitID: id,
            AgencyId: aId
        }
        // console.log(data)
        fetchPostData('RoasterUnit/GetDataUnitUser', data)
            .then(result => {
                if (result) {
                    setUnitUserList(result)
                } else {
                    setUnitUserList()
                }
            })
    }

    const column = [
        {
            name: 'Assigned/Unassigned',
            selector: (row) => <input type="checkbox" disabled={
                EffectiveScreenPermission ?
                    EffectiveScreenPermission[0]?.Changeok === 0 ? true
                        : false
                    : false
            }
                checked={row.Assign} onClick={(e) => update_Assigned_Roster(row.PINID, row.Assign ? 0 : 1)} />,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: (row) => row.WorkPhoneNumber,
            sortable: true
        },

    ]

    // Update Roster
    const update_Assigned_Roster = (PINID, type) => {
        const val = {
            UnitID: value.UnitId,
            PINID: PINID
        }
        AddDeleteUpadate('RoasterUnit/InsertAssignUnitUser', val)
            .then(res => {
                if (res) {
                    unitUser(value.UnitId)
                    if (type === 1) {
                        toastifySuccess("Unit is assigned !")
                    }
                    if (type === 0) {
                        toastifySuccess("Unit is Unassigned !")
                    }
                }
            })
    }

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
                <div className="col-12  p-0 mt-1">
                    {/* <legend >Unit Assignment</legend> */}
                    <div className="row">
                        <div className="col-1">
                            <label htmlFor="" className='mt-2 ' style={{ padding: '0px 4px' }}>Unit:</label>
                        </div>
                        <div className="col-3 mt-1">
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="UnitId"
                                // defaultValue={value?.GroupName}
                                options={unitList}
                                isClearable
                                onChange={unitChange}
                            />
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-12">
                            <div className="col-12 bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Unit user's
                                </p>
                            </div>
                            <DataTable
                                columns={column}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? unitUserList : '' : ''}
                                // onRowClicked={handleRowClicked_UnAss}
                                // conditionalRowStyles={conditionalRowStyles}
                                dense
                                // paginationPerPage={'5'}
                                paginationRowsPerPageOptions={[10, 15]}
                                highlightOnHover
                                noContextMenu
                                // selectableRows
                                // onSelectedRowsChange={handleChange}
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

export default Roster

export const changeArrayFormat = (data, type) => {
    if (type === 'group') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UnitId, label: sponsor.UnitName, })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
    if (type === 'group') {
        const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
            ({ value: sponsor.UnitId, label: sponsor.UnitName })
        )
        return result[0]
    }
}
