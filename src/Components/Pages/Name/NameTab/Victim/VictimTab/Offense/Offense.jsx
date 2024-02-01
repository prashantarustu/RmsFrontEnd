import React, { useEffect, useState, memo, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { useRef } from 'react';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { ErrorStyle, ErrorTooltip, NameVictimOffenses } from '../../../../../../NIBRSError';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';

const Offense = (props) => {

  const { victimID, nameID, LoginPinID, incidentID, LoginAgencyID } = props
  const { localStoreArray, setLocalStoreArray, get_LocalStorage,get_NameVictim_Count, } = useContext(AgencyContext);
  const SelectedValue = useRef();
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [offenseDrp, setOffenseDrp] = useState();
  const [offenseNameData, setOffenseNameData] = useState([]);
  const [offenseNameID, setOffenseNameId] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)

  const [value, setValue] = useState({
    'OffenseID': '',
    'NameID': nameID,
    'VictimID': victimID,
    'CreatedByUserFK': LoginPinID,
  })

  useEffect(() => {
    setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'NameID': nameID, 'VictemTypeCode': null, } });
  }, [LoginPinID])

  const [errors, setErrors] = useState({
    'DropError': '',
  })

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.OffenseID)) {
      setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.OffenseID) } })
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
    get_Offense_DropDown(victimID);
    get_OffenseName_Data(victimID);
  }, [victimID])

  const get_OffenseName_Data = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimOffense/GetData_VictimOffense', val).then((res) => {
      if (res) {
        setOffenseNameData(res)
        get_NameVictim_Count(victimID)
      } else {
        setOffenseNameData([]);
      }
    })
  }

  const get_Offense_DropDown = (victimID) => {
    const val = {
      'IncidentID': incidentID,
      'VictimID': victimID,
    }
    fetchPostData('VictimOffense/GetData_InsertVictimOffense', val).then((data) => {
      if (data) {
        setOffenseDrp(Comman_changeArrayFormat(data, 'CrimeID', 'Offense_Description'))
      } else {
        setOffenseDrp([])
      }
    })
  }

  const Add_Victim_Offense = () => {
    AddDeleteUpadate('VictimOffense/Insert_VictimOffense', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offense_DropDown(victimID, incidentID);
        get_OffenseName_Data(victimID);
        get_NameVictim_Count(victimID)
        onClear(); setErrors({ ...value['DropError'] })
      }
    })
  }

  const DeleteVictimOffense = () => {
    const val = {
      'VictimOffenseID': offenseNameID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('VictimOffense/Delete_VictimOffense', val).then((res) => {
      toastifySuccess(res.Message); setDeleteStatus(false)
      get_Offense_DropDown(victimID, incidentID);
      get_OffenseName_Data(victimID);
      get_NameVictim_Count(victimID)
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

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.Offense_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenseNameId(row.VictimOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenseNameId(row.VictimOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]


  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">Offense</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className='dropdown__box'>
              <Select
                name='OffenseID'
                styles={(offenseNameData.length > 0 && value?.OffenseID) ? ErrorStyle(true) : ErrorStyle(false)}
                isClearable
                options={offenseDrp}
                onChange={(e) => { ChangeDropDown(e, 'OffenseID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Offense {offenseNameData.length > 0 && value?.OffenseID ? ErrorTooltip(NameVictimOffenses) : <></>}</label>
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
          data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? offenseNameData : '' : offenseNameData}
          dense
          pagination
          paginationPerPage={'3'}
          paginationRowsPerPageOptions={[3]}
          selectableRowsHighlight
          highlightOnHover
        // noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeleteVictimOffense} />
          : ''
      }
    </>
  )
}

export default memo(Offense)