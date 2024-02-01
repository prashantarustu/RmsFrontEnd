import React, { useContext } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { useRef } from 'react';
import DataTable from 'react-data-table-component';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { OffMethodOFOpListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const MethodOfOperation = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const {get_Offence_Count} = useContext (AgencyContext)
  const SelectedValue = useRef();
  const [status, setStatus] = useState(false);
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [MethodOfOperationData, setMethodOfOperationData] = useState();
  const [MethodOfOperationDrp, setMethodOfOperationDrp] = useState();
  const [MethodOfOperationID, setMethodOfOperationID] = useState();
  const [loder, setLoder] = useState(false)

  const [value, setValue] = useState({
    'CrimeMethodOfOpeationID': '',
    'MethodOfOperationID': '',
    'CrimeID': offenceID,
    'CreatedByUserFK': LoginPinID,
  })

  const [errors, setErrors] = useState({
    'MethodOfOperationError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'MethodOfOperationID': '',
    })
    setErrors({
      ...errors,
      'MethodOfOperationError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.CrimeMethodOfOpeationID)) {
      setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationError']: RequiredFieldIncident(value.CrimeMethodOfOpeationID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { MethodOfOperationError } = errors

  useEffect(() => {
    if (MethodOfOperationError === 'true') {
     AddMethodOfOperation();
    }
  }, [MethodOfOperationError])


  useEffect(() => {
    get_MethodOfOperation_DropDown(offenceID);
    get_MethodOfOperation_Data(offenceID);
    getScreenPermision(LoginAgencyID, LoginPinID);
  }, [offenceID])

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("O039", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const get_MethodOfOperation_Data = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseMethodOfOperation/GetData_OffenseMethodOfOperation', val).then((res) => {
      if (res) {
        setMethodOfOperationData(res); setLoder(true)
      } else {
        setMethodOfOperationData([]); setLoder(true)
      }
    })
  }

  const get_MethodOfOperation_DropDown = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseMethodOfOperation/GetData_InsertGetData_OffenseMethodOfOperation', val).then((data) => {
      if (data) {
        setMethodOfOperationDrp(Comman_changeArrayFormat(data, 'MethodOfOperationID', 'Description'));
      }
      else {
        setMethodOfOperationDrp([])
      }
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else setValue({
      ...value,
      [name]: null
    })
  }

  const AddMethodOfOperation = () => {
    AddDeleteUpadate('OffenseMethodOfOperation/Insert_OffenseMethodOfOperation', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_MethodOfOperation_Data(offenceID);
        get_MethodOfOperation_DropDown(offenceID);
        Reset();
        onClear();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

 
  
  // Custom Style   
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };
  // custuom style withoutColor
  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.MethodOfOperation_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        {/* {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
             <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditVal(row) }}>
              <i className="fa fa-edit"></i>
            </Link> 
            : <></>
            : <></>
        } */}
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setMethodOfOperationID(row.MethodOfOperationID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setMethodOfOperationID(row.MethodOfOperationID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

  const DeleteMethodOfOperation = () => {
    const val = {
      'MethodOfOperationID': MethodOfOperationID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('OffenseMethodOfOperation/Delete_OffenseMethodOfOperation', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_MethodOfOperation_Data(offenceID);
        get_MethodOfOperation_DropDown(offenceID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Method Of Operation</p>
          <div style={{ marginLeft: 'auto' }}>
            {/* <Link to='' className="btn btn-sm bg-green text-white px-2 py-0">
              <i className="fa fa-plus"></i>
            </Link> */}
            <FindListDropDown
              array={OffMethodOFOpListDropDownArray}
            />
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='CrimeMethodOfOpeationID'
                styles={colourStyles}
                isClearable
                options={MethodOfOperationDrp}
                onChange={(e) => { ChangeDropDown(e, 'CrimeMethodOfOpeationID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Method Of Operation</label>
              {errors.MethodOfOperationError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MethodOfOperationError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
                : <></>
                : <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
            }
          </div>
        </div>
        <div className="col-12">
          {
            loder ?
              <DataTable
                columns={columns}
                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? MethodOfOperationData : '' : MethodOfOperationData}
                dense
                pagination
                selectableRowsHighlight
                highlightOnHover
                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              />
              :
              <Loader />
          }
        </div>
      </div>
      <DeletePopUpModal func={DeleteMethodOfOperation} />
    </>
  )
}

export default MethodOfOperation