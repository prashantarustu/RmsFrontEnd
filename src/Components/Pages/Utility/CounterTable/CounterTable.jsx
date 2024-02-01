import React from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { fetchData } from '../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../Common/Utility';
import { Filter, One_Value_Search_Filter } from '../../../Filter/Filter';
import CounterTable_Add_Up from './CounterTable_Add_up';

const CounterTable = () => {

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [DataList, setDataList] = useState();
  const [EditList, setEditList] = useState();
  const [dataListFillter, setDataListFillter] = useState([])
  const [filterOption, setfilterOption] = useState('Contains');
  const [searchValue, setSearchValue] = useState('')
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)

  // const [tabstatus, setTabStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1")
  const [modal, setModal] = useState(false)
  // FilterData 



  useEffect(() => {
    get_Data_List();
  }, [])


  const get_Data_List = () => {
    fetchData('Counter/GetData_SysCounter')
      .then((res) => {
        if (res) {
          setDataList(res)
          setDataListFillter(res);
        }
        else { setDataList(); setDataListFillter(); }
      })
  }


  // Table Columns Array
  const columns = [
    {
      name: 'Counter Desc',
      selector: (row) => row.CounterDesc,
      sortable: true
    },
    {
      name: 'Counter_Format',
      selector: (row) => row.Counter_Format,
      sortable: true
    },
    // {
    //   name: 'ResetYearEnd',
    //   selector: (row) => row.ResetYearEnd,
    //   sortable: true
    // },
    {
      name: 'WhenReset',
      selector: (row) => row.WhenReset,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 0, right: 40 }}>
          <Link to="/CounterTable" data-toggle="modal" data-target="#CounterModal" onClick={(e) => { setEditValue(e, row); }}
            className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
          </Link>
        </div>
      </>
    }
  ]

  // to set Button add or update condition
  const setEditValue = (e, row) => {
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setEditList(row)
    setStatus(true);
  }

  const setStatusFalse = (e) => {
    setStatus(false);
    setModal(true)
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
                          <p className="p-0 m-0">Counter Table</p>
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
                  <div className="table-responsive mt-2">
                    <div className="col-12">
                      <div className="row ">
                        <div className="col-12">
                          <DataTable
                            columns={columns}
                            data={dataListFillter}
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
      <CounterTable_Add_Up {...{ modal, status, EditList, setModal, get_Data_List, updateStatus }} />
    </>
  )
}

export default CounterTable