import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../../../Common/Utility'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate } from '../../../../hooks/Api'
import DeletePopUpModal from '../../../../Common/DeleteModal'
// import { ArrChargeListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray'
// import FindListDropDown from '../../../../Common/FindListDropDown'

const Charges = () => {

  const { setIncStatus, ArrestID, get_Warrent_Count, get_ArrestCharge_Count, get_Arrest_Count, updateCount, setUpdateCount, warrantChargeData, get_Data_Warrant_Charge, localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData } = useContext(AgencyContext);

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [ChargeID, setChargeID] = useState();
  const [WarrantID, setWarrantID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');


  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", ChargeID: '' }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginPinID(localStoreArray?.PINID);
        setWarrantID(localStoreArray?.WarrantID)
      } get_Warrent_Count(localStoreArray?.WarrantID)
    }
  }, [localStoreArray])

  useEffect(() => {
    if (WarrantID) {
      get_Data_Warrant_Charge(WarrantID);
    }
  }, [WarrantID])

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={'/warrant-chargetab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={'/warrant-chargetab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      </>
    },
    {
      name: 'Warrant Number',
      selector: (row) => row.WarrantNumber,
      sortable: true
    },
    {
      name: 'NIBRS Description',
      selector: (row) => row.NIBRS_Description,
      sortable: true
    },
    {
      name: 'UCRClear Description',
      selector: (row) => row.UCRClear_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setChargeID(row.ChargeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setChargeID(row.ChargeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    get_Warrent_Count(row.WarrantID)
    get_ArrestCharge_Count(row.ChargeID)
    if (row.ChargeID) {
      // setChargeID(row.ChargeID);
      storeData({ 'ChargeID': row.ChargeID, 'ArrestChargeStatus': true })
    }
  }



  const DeleteArrestCharge = () => {
    const val = {
      'ChargeID': ChargeID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_Warrant_Charge(WarrantID);
        get_Warrent_Count(WarrantID);
        get_Arrest_Count(ArrestID)
        setUpdateCount(updateCount + 1);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Charges</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={'/warrant-chargetab'} onClick={() => {
              setIncStatus(false);
              // get_ArrestCharge_Count(null);
              deleteStoreData({ 'ChargeID': '', 'ArrestChargeStatus': '', });
              storeData({ 'ArrestChargeStatus': false });
            }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#" style={{ marginTop: '-6px' }}>
              <i className="fa fa-plus"></i>
            </Link>
            {/* <FindListDropDown
              array={ArrChargeListDropDownArray}       
            /> */}
          </div>
        </div>
        <DataTable
          dense
          columns={columns}
          data={warrantChargeData}
          pagination
          selectableRowsHighlight
          highlightOnHover
        />
      </div>
      <DeletePopUpModal func={DeleteArrestCharge} />
    </>
  )
}

export default Charges