import React from 'react';
import { useState, useEffect } from 'react'
import { fetchData, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';

const Effectivepermission = ({ pId, aId, pinId }) => {
    // Hooks Initialization

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    // let pId = useQuery().get('pd').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [application, setApplication] = useState([])
    const [effectiveScreenList, setEffectiveScreenList] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

    const [value, setValue] = useState({
        'ApplicationID': " ",
    })

    // Onload Function
    useEffect(() => {
        // get_Application()
        get_EffectiveScreen_Permission(aId, pinId)
        getScreenPermision(aId, pinId)
    }, [aId])

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("P016", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Get Application
    const get_Application = () => {
        fetchData('DropDown/GetData_Application').then((data) => {
            if (data) setApplication(data)
            else setApplication(data)
        })
    }

    // onChange Hooks Function
    const ApplicationChange = (e) => {
        setValue({
            ...value,
            ['ApplicationID']: e.ApplicationID,
        })
    }

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinId) => {
        // e.preventDefault()
        const val = {
            PINID: pinId,
            AgencyID: aId,
            // ApplicationID: value.ApplicationID
            ApplicationID: '1',
            code: '',
        }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) setEffectiveScreenList(res)
                else setEffectiveScreenList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    //  // Table Columns Array
    const columns = [
        {
            name: 'Screen Name',
            selector: (row) => row.ScreenCode1,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" disabled checked={row.DisplayOK} value={row.ScreenID} name='DisplayOK' />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.ScreenID} name='AddOK' disabled />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Changeok} value={row.ScreenID} name='Changeok' disabled />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.ScreenID} name='DeleteOK' disabled />,
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
        <div className="row px-3">
            <div className="col-12 ">
                <div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Screen Security
                    </p>
                </div>
                <DataTable
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? effectiveScreenList : '' : ''}
                    dense
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
    )
}

export default Effectivepermission