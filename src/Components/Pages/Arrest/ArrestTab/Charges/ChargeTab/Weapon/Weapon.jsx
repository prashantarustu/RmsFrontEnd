import React, { useEffect, useRef, useState } from 'react'
import Select from "react-select";
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { Link } from 'react-router-dom';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { ArrChargeWeaponListDropDownArray } from '../../../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../../../Common/FindListDropDown';
import Loader from '../../../../../../Common/Loader';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { useContext } from 'react';


const Weapon = () => {

  const { get_ArrestCharge_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const SelectedValue = useRef();
  const [status, setStatus] = useState(false);
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [WeaponData, setWeaponData] = useState();
  const [WeaponDrp, setWeaponDrp] = useState();
  const [ChargeWeaponID, setChargeWeaponID] = useState();
  const [loder, setLoder] = useState(false);
  const [ChargeID, setChargeID] = useState();
  const [ArrestID, setArrestID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');

  const [value, setValue] = useState({
    'ChargeWeaponTypeID': '',
    'ChargeID': '',
    'CreatedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'ChargeWeaponTypeIDError': '',
  })

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage();
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginPinID(localStoreArray?.PINID);
        setArrestID(localStoreArray?.ArrestID);
        if (localStoreArray.ChargeID) {
          setChargeID(localStoreArray?.ChargeID);
          setValue({ ...value, 'ChargeID': localStoreArray?.ChargeID, 'CreatedByUserFK': localStoreArray?.PINID })
        } else { setChargeID('') }
      }
    }
  }, [localStoreArray])

  const Reset = () => {
    setValue({
      ...value,
      'WeaponID': '',
    })
    setErrors({
      ...errors,
      'ChargeWeaponTypeIDError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ChargeWeaponTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ChargeWeaponTypeIDError']: RequiredFieldIncident(value.ChargeWeaponTypeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { ChargeWeaponTypeIDError } = errors

  useEffect(() => {
    if (ChargeWeaponTypeIDError === 'true') {
      if (!status) { AddWeapon(); }
    }
  }, [ChargeWeaponTypeIDError])


  useEffect(() => {
    get_Weapon_DropDown(ChargeID);
    get_Weapon_Data(ChargeID);
  }, [ChargeID])

  const get_Weapon_Data = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID
    }
    fetchPostData('ChargeWeaponType/GetData_ChargeWeaponType', val).then((res) => {
      if (res) {
        setWeaponData(res); setLoder(true)
      } else {
        setWeaponData([]); setLoder(true)
      }
    })
  }

  const get_Weapon_DropDown = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID
    }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setWeaponDrp(Comman_changeArrayFormat(data, 'WeaponID', 'Description'));
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
      setValue({
        ...value,
        [name]: e.value
      })
    } else setValue({
      ...value,
      [name]: null
    })
  }

  const AddWeapon = () => {
    AddDeleteUpadate('ChargeWeaponType/Insert_ChargeWeaponType', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message); setErrors({ 'ChargeWeaponTypeIDError': '' })
        get_Weapon_Data(ChargeID);
        get_ArrestCharge_Count(ChargeID)
        get_Weapon_DropDown(ChargeID);
        Reset();
        onClear();
        setErrors({
          ['ChargeWeaponTypeIDError']: '',
        });
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
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setChargeWeaponID(row.ChargeWeaponID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setChargeWeaponID(row.ChargeWeaponID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

  const DeleteWeapon = () => {
    const val = {
      'ChargeWeaponID': ChargeWeaponID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ChargeWeaponType/Delete_ChargeWeaponType', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Weapon_Data(ChargeID);
        get_ArrestCharge_Count(ChargeID)
        get_Weapon_DropDown(ChargeID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Weapon</p>
          <div style={{ marginLeft: 'auto' }}>
            <FindListDropDown
              array={ArrChargeWeaponListDropDownArray}
            />
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='ChargeWeaponTypeID'
                styles={colourStyles}
                isClearable
                options={WeaponDrp}
                onChange={(e) => { ChangeDropDown(e, 'ChargeWeaponTypeID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Weapon Type</label>
              {errors.ChargeWeaponTypeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeWeaponTypeIDError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
            <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
              <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
            </div>
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