import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Identification_Add_Up from './Identification_Add_Up';
import { NaIdentificationListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Identification = () => {

  const { get_Name_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [IdentificationData, setIdentificationData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [PinActivityID, setPinActivityID] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  const [IdentificationNumberID, setIdentificationNumberID] = useState('');
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [MasterNameID, setMasterNameID,] = useState('');
  const [nameID, setNameID] = useState();

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", MasterNameID: '', NameID: '', Agency_Name: "", }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);
        Get_IdentificationData(localStoreArray?.NameID, localStoreArray?.MasterNameID);
      }
      getScreenPermision();
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   Get_IdentificationData();
  //   getScreenPermision();
  // }, [])

  const Get_IdentificationData = (nameID, MasterNameID) => {
    const val = {
      'NameID': nameID,
    }
    const req = {
      'MasterNameID': MasterNameID,
    }
    fetchPostData(openPage === 'mastername' ? 'MainMasterNameIdentificationNumber/GetData_MainMasterNameIdentificationNumber' : 'NameIdentificationNumber/GetData_NameIdentificationNumber', openPage === 'mastername' ? req : val).then((res) => {
      if (res) {
        console.log(res);
        setIdentificationData(res)
      } else {
        setIdentificationData([]);
      }
    })
  }

  const getScreenPermision = () => {
    // ScreenPermision("I028", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
    //   if (res) {
    //     setEffectiveScreenPermission(res)
    //   } else {
    //     setEffectiveScreenPermission()
    //   }
    // });
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i></Link>
          }
          {/* {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          } */}

        </div>
      </>
    },
    {
      width: '250px',
      name: 'Identification Type',
      selector: (row) => row.IdType_Description,
      sortable: true
    },
    // {
    //   name: 'DL Number',
    //   selector: (row) => row.DLNumber,
    //   sortable: true
    // },
    {
      name: 'ID Number',
      selector: (row) => row.IdentificationNumber,
      sortable: true
    },
    // {
    //   name: 'IS Current ',
    //   selector: (row) => <input type="checkbox" checked={row.IsCurrent} />,
    //   sortable: true
    // },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 8 }}>
          {/* {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i></Link>
          } */}
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }

        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setIdentificationNumberID(row.IdentificationNumberID);
  }

  const DeleteIdentification = () => {
    const val = {
      'IdentificationNumberID': IdentificationNumberID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('NameIdentificationNumber/Delete_NameIdentificationNumber', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Name_Count(nameID);
        Get_IdentificationData(nameID, MasterNameID);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setModal(true)
    setUpdateStatus(updateStatus + 1);

  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Identification
          </p>
          <div>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-7px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-7px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
            }
            <FindListDropDown
              array={NaIdentificationListDropDownArray}
            />
          </div>
        </div>
        <DataTable
          dense
          columns={columns}
          data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? IdentificationData : '' : IdentificationData}
          pagination
          highlightOnHover
          noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteIdentification} />
      <Identification_Add_Up {...{ nameID, MasterNameID, LoginPinID, LoginAgencyID, status, setStatus, IdentificationNumberID, setModal, modal, Get_IdentificationData, updateStatus }} />
    </>
  )
}
export default Identification; 