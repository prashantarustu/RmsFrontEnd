import React from 'react'
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { useContext } from 'react';

const JustifiableHomicide = (props) => {
  const { localStoreArray, setLocalStoreArray, get_LocalStorage, get_NameVictim_Count, } = useContext(AgencyContext);

  const { victimID, nameID, LoginPinID, incidentID, LoginAgencyID, } = props
  const SelectedValue = useRef();
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [JustifiableHomiDrp, setJustifiableHomiDrp] = useState();
  const [JustifiableHomiData, setJustifiableHomiData] = useState();
  const [VictimJustifiableHomicideID, setVictimJustifiableHomicideID] = useState();

  const [value, setValue] = useState({
    'JustifiableHomicideID': '',
    'NameID': nameID,
    'VictimID': victimID,
    'CreatedByUserFK': LoginPinID,
  })

  const [errors, setErrors] = useState({
    'DropError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'JustifiableHomicideID': '',
    })
    setErrors({
      ...errors,
      'DropError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.JustifiableHomicideID)) {
      setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.JustifiableHomicideID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DropError } = errors

  useEffect(() => {
    if (DropError === 'true') {
      Add_Victim_Offense();
    }
  }, [DropError])

  useEffect(() => {
    get_Data_RelationShip_Drp(victimID);
    get_RelationShip_Data(victimID);
  }, [victimID])

  const get_RelationShip_Data = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimJustifiableHomicide/GetData_VictimJustifiableHomicide', val).then((res) => {
      if (res) {
        setJustifiableHomiData(res)
      } else {
        setJustifiableHomiData([]);
      }
    })
  }

  const get_Data_RelationShip_Drp = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimJustifiableHomicide/GetData_InsertJustifiableHomicide', val).then((data) => {
      if (data) {
        setJustifiableHomiDrp(Comman_changeArrayFormat(data, 'JustifiableHomicideID', 'Description', "JustifiableHomicideCode",))
      } else {
        setJustifiableHomiDrp([])
      }
    })
  }

  const Add_Victim_Offense = () => {
    AddDeleteUpadate('VictimJustifiableHomicide/Insert_VictimJustifiableHomicide', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message)
        get_RelationShip_Data(victimID);
        get_Data_RelationShip_Drp(victimID);
        get_NameVictim_Count(victimID)
        onClear()
        Reset();
        setErrors({
          'DropError': '',
        });
      }
    })
  }

  const DeleteMethodOfOperation = () => {
    const val = {
      'VictimJustifiableHomicideID': VictimJustifiableHomicideID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('VictimJustifiableHomicide/Delete_VictimJustifiableHomicide', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_RelationShip_Drp(victimID);
        get_RelationShip_Data(victimID);
        get_NameVictim_Count(victimID)

      } else console.log("Somthing Wrong");
    })
  }
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

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.JustifiableHomicide_Description
      ,
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
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setVictimJustifiableHomicideID(row.VictimJustifiableHomicideID) }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setVictimJustifiableHomicideID(row.VictimJustifiableHomicideID) }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

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

  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">Justifiable Homicide</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className='dropdown__box'>
              <Select
                name='JustifiableHomicideID'
                styles={colourStyles}
                isClearable
                options={JustifiableHomiDrp}
                onChange={(e) => { ChangeDropDown(e, 'JustifiableHomicideID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Justifiable Homicide</label>
              {errors.DropError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-2 col-md-6 col-lg-8    pl-3" style={{ marginTop: '22px' }}>
            <Link to=''>
              <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12">
        <DataTable
          columns={columns}
          data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? JustifiableHomiData : '' : JustifiableHomiData}
          dense
          pagination
          paginationPerPage={'3'}
          paginationRowsPerPageOptions={[3]}
          selectableRowsHighlight
          highlightOnHover
          noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteMethodOfOperation} />
    </>
  )
}

export default JustifiableHomicide