// Import Component
import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData, fetch_Post_Data } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { Link } from 'react-router-dom';
import ListPermissionEdit from './ListPermissionEdit';
import Dropdown from 'react-bootstrap/Dropdown';
import { One_Value_Search_Filter } from '../../Filter/Filter';
import { AgencyContext } from '../../../Context/Agency/Index';

const ListPermission = () => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, incidentNumber, setIncidentNumber, } = useContext(AgencyContext);
    // Hooks Initialization
    const [moduleList, setModuleList] = useState([])
    const [dataListFillter, setDataListFillter] = useState([])
    const [EditList, setEditList] = useState([])
    const [dataList, setDataList] = useState([])
    const [modal, setModal] = useState(false)
    const [status, setStatus] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [filterOption, setfilterOption] = useState('Contains');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

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


    const [value, setValue] = useState({
        'ApplicationId': '',
        'ModuleFK': '',
        'TableID': ''
    })

    // Onload Function
    useEffect(() => {
        get_ModuleFK('1');
    }, [])

    const ModuleFKChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['ModuleFK']: e.value,
            })
            get_List_Table(e.value);
        } else {
            setValue({
                ...value,
                ['ModuleFK']: null
            })
            setDataListFillter(); setDataList()
        }
    }

    const get_List_Table = (id) => {
        const val = {
            ModuleId: id
        }
        fetch_Post_Data('TablePermission/GetData_ListPersmission', val)
            .then(res => {
                if (res) { setDataList(res?.Data); setDataListFillter(res?.Data) }
                else { setDataList(); setDataListFillter() }
            })
    }

    // Get Module and Application Screen And Group Field permission
    const Update_List = (id) => {
        const val = {
            'ModuleId': value.ModuleFK,
            'TableId': id,
            'Name': '',
            'ModifiedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('TablePermission/Update_ListPermission', val)
            .then(res => {
                if (res) {
                    toastifySuccess(res.Message)
                    get_List_Table(value.ModuleFK)
                }
                else { }
            })
    }

    const get_ModuleFK = (id) => {
        const val = {
            ApplicationId: id
        }
        fetch_Post_Data('ScreenPermission/GetData_Module', val)
            .then(res => {
                if (res) { setModuleList(changeArrayFormat(res?.Data, 'modul')) }
                else { setModuleList() }
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Status',
            selector: (row) => <>
                <input type="checkbox" checked={row.Status} onChange={(e) => { Update_List(row.TableID) }} />
            </>
            ,
            sortable: true
        },
        {
            name: 'Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    <Link to="/ListPermission" data-toggle="modal" data-target="#EditTypeModal" onClick={(e) => { setEditValue(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i></Link>
                </div>
            </>
        },
    ]

    const setEditValue = (e, row) => {
        setEditList(row)
        setModal(true)
        setStatus(true);
    }

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
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="ModuleFK"
                                                    options={moduleList}
                                                    isClearable
                                                    onChange={ModuleFKChange}
                                                />
                                                <label htmlFor="">Module</label>
                                            </div>
                                        </div>
                                        <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">
                                                List-Module Manager
                                            </p>
                                        </div>
                                        <div className="col-12 mt-2 ">
                                            <div className="row">
                                                <div className="col-5">
                                                    <input type="text" onChange={(e) => {
                                                        setSearchValue(e.target.value);
                                                        const result = One_Value_Search_Filter(dataList, e.target.value, filterOption, 'Name')
                                                        setDataListFillter(result)
                                                    }}
                                                        className='form-control' placeholder='Search By Name...' />
                                                </div>
                                                <div className='col-1'>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fa fa-filter"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => setfilterOption('Contains')}>Contains</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setfilterOption('is equal to')}>is equal to</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setfilterOption('is not equal to')}>is not equal to </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setfilterOption('Starts With')}>Starts With</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setfilterOption('End with')}>End with</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-12 mt-2">
                                                <DataTable
                                                    columns={columns}
                                                    data={dataListFillter}
                                                    dense
                                                    paginationRowsPerPageOptions={[10, 15]}
                                                    highlightOnHover
                                                    noContextMenu
                                                    pagination
                                                    responsive
                                                    subHeaderAlign="right"
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
            <ListPermissionEdit {...{ LoginPinID, modal, setModal, EditList, status, get_List_Table }} ModuleFK={value.ModuleFK} />
        </>
    )
}

export default ListPermission

export const changeArrayFormat = (data, type) => {
    if (type === 'modul') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ModulePK, label: sponsor.ModuleName, })
        )
        return result
    }
}




