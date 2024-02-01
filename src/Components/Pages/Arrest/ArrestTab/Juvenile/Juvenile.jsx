import React from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useEffect } from 'react';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { ArrPoliceForceListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Juvenile_Add_Up from './Juvenile_Add_Up';

const Juvenile = () => {

  const { localStoreArray, get_LocalStorage, get_Arrest_Count } = useContext(AgencyContext);

  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [JuvenileData, setJuvenileData] = useState();
  const [ArrestJuvenileID, setArrestJuvenileID] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const [loder, setLoder] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(0)

  const [LoginAgencyID, setLoginAgencyID] = useState('')
  const [ArrestID, setArrestID] = useState('')
  const [LoginPinID, setLoginPinID] = useState('');
  const [MainIncidentID, setMainIncidentID] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", IncidentID: '', ArrestID: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // useEffect(() => {
  //   if (MainIncidentID) {
  //     get_Data_Juvenile(MainIncidentID);
  //   }
  //   // setOffenceShowPage('home')
  // }, [MainIncidentID]);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        // setIncidentID(localStoreArray?.IncidentID);
        if (localStoreArray.ArrestID) {
          setArrestID(localStoreArray?.ArrestID);
          // get_Data_Juvenile(localStoreArray?.ArrestID);
          // get_Arrest_Count(localStoreArray?.ArrestID);
        } else {
          setArrestID('')
        }
        // getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  useEffect(() => {
    if (ArrestID) {
      get_Data_Juvenile(ArrestID);
    }
  }, [ArrestID])

  const get_Data_Juvenile = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID,
    }
    fetchPostData('ArrestJuvenile/GetData_ArrestJuvenile', val).then((res) => {
      if (res) {
        setJuvenileData(res); setLoder(true)
      } else {
        setJuvenileData(); setLoder(true)
      }
    })
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i></Link>
          }

        </div>
      </>
    },
    {
      name: 'Date/Time',
      selector: (row) => getShowingWithOutTime(row.ParentContactDtTm),
      sortable: true
    },
    {
      name: 'Parent Name',
      selector: (row) => row.ParentName,
      sortable: true
    },
    {
      name: 'Parent Phone',
      selector: (row) => row.ParentPhone,
      sortable: true
    },
    {
      name: 'Contacted By',
      selector: (row) => row.ContactBy_Name,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setArrestJuvenileID(row.ArrestJuvenileID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setArrestJuvenileID(row.ArrestJuvenileID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    // setModal(true); 
    setStatus(true);
    // setArrestJuvenileID(row.ArrestJuvenileID);
    setModal(true);
    setUpdateStatus(updateStatus + 1);
    setArrestJuvenileID(row.ArrestJuvenileID);
    get_Arrest_Count(row.ArrestID)

  }

  const DeleteJuvenile = () => {
    const val = {
      'ArrestJuvenileID': ArrestJuvenileID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ArrestJuvenile/Delete_ArrestJuvenile', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_Juvenile(ArrestID);
        get_Arrest_Count(ArrestID)
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setModal(true); setStatus(false);
    setUpdateStatus(updateStatus + 1);

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

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Juvenile</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={''} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" onClick={setStatusFalse} data-target="#PinModal" style={{ marginTop: '-6px' }}>
              <i className="fa fa-plus"></i>
            </Link>
            <FindListDropDown
              array={ArrPoliceForceListDropDownArray}
            />
          </div>
        </div>
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? JuvenileData : '' : JuvenileData}
              pagination
              highlightOnHover
              noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />

        }
      </div>
      <Juvenile_Add_Up  {...{ LoginPinID, ArrestID, LoginAgencyID, ArrestJuvenileID, status, setStatus, modal, setModal, get_Data_Juvenile, updateStatus }} />
      <DeletePopUpModal func={DeleteJuvenile} />
    </>
  )
}

export default Juvenile