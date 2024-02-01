import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { useRef } from 'react';
import DataTable from 'react-data-table-component';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { OffWeaponListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { ErrorStyleWeapon, ErrorTooltip, WeaponError } from '../ErrorNibrs';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Weapon = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { get_Offence_Count } = useContext(AgencyContext)
  const SelectedValue = useRef();
  const [status, setStatus] = useState(false);
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [WeaponData, setWeaponData] = useState();
  const [WeaponDrp, setWeaponDrp] = useState();
  const [WeaponID, setWeaponID] = useState();
  const [loder, setLoder] = useState(false)
  const [WeaponCode, setWeaponCode] = useState('')

  const [value, setValue] = useState({
    'WeaponTypeID': '',
    'WeaponID': '',
    'CrimeID': offenceID,
    'CreatedByUserFK': LoginPinID,
  })

  const [errors, setErrors] = useState({
    'MethodOfOperationError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'WeaponID': '',
    })
    setErrors({
      'MethodOfOperationError': '',
    });
  }

  const check_Validation_Error = (e) => {
    e.preventDefault()
    if (RequiredFieldIncident(value.WeaponTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationError']: RequiredFieldIncident(value.WeaponTypeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { MethodOfOperationError } = errors

  useEffect(() => {
    if (MethodOfOperationError === 'true') {
      if (!status) AddWeapon();
    }
  }, [MethodOfOperationError])


  useEffect(() => {
    get_Weapon_DropDown(offenceID);
    get_Weapon_Data(offenceID);
    getScreenPermision(LoginAgencyID, LoginPinID);
  }, [LoginAgencyID])

  const getScreenPermision = () => {
    ScreenPermision("O045", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const get_Weapon_Data = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseWeapon/GetData_OffenseWeapon', val).then((res) => {
      if (res) {
        setWeaponData(res); setLoder(true)
      } else {
        setWeaponData([]); setLoder(true)
      }
    })
  }

  const get_Weapon_DropDown = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseWeapon/GetData_InsertOffenseWeapon', val).then((data) => {
      if (data) {
        setWeaponDrp(threeColArray(data, 'WeaponID', 'Description', 'WeaponCode'));
      }
      else {
        setWeaponDrp([])
      }
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };


  const ChangeDropDown = (e, name) => {
    if (e) {
      setWeaponCode(e.id);
      setValue({ ...value, [name]: e.value });
    } else { setValue({ ...value, [name]: null }); setWeaponCode('') }
  }

  const AddWeapon = () => {
    AddDeleteUpadate('OffenseWeapon/Insert_OffenseWeapon', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_Weapon_Data(offenceID);
        get_Weapon_DropDown(offenceID);
        Reset();
        onClear();
        setErrors({ 'MethodOfOperationError': '' })
      } else {
        console.log("Somthing Wrong");
      }
    })
  };

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.Weapon_Description,
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
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setWeaponID(row.WeaponID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setWeaponID(row.WeaponID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

  const DeleteWeapon = () => {
    const val = {
      'WeaponID': WeaponID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('OffenseWeapon/Delete_OffenseWeapon', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_Weapon_Data(offenceID);
        get_Weapon_DropDown(offenceID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Weapon</p>
          <div style={{ marginLeft: 'auto' }}>
            {/* <Link to='' className="btn btn-sm bg-green text-white px-2 py-0">
              <i className="fa fa-plus"></i>
            </Link> */}
            <FindListDropDown
              array={OffWeaponListDropDownArray}
            />
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='WeaponTypeID'
                styles={ErrorStyleWeapon(WeaponCode)}
                isClearable
                options={WeaponDrp}
                onChange={(e) => { ChangeDropDown(e, 'WeaponTypeID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Weapon Type {WeaponCode === '99' && <ErrorTooltip Error={WeaponError} />}</label>
              {errors.MethodOfOperationError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MethodOfOperationError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={check_Validation_Error}>Save</button>
                </div>
                : <></>
                : <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={check_Validation_Error}>Save</button>
                </div>
            }
            {/* <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
            <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={check_Validation_Error}>Save</button>
          </div> */}
          </div>
        </div>
        <div className="col-12">
          {
            loder ?
              <DataTable
                columns={columns}
                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? WeaponData : '' : WeaponData}
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
      <DeletePopUpModal func={DeleteWeapon} />
    </>
  )
}

export default Weapon