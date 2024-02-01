import React, { useContext, useEffect, useRef, useState } from 'react'
import Select from "react-select";
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Link } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { ArrCriminalListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const CriminalActivity = () => {

  const { get_Arrest_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)
  const SelectedValue = useRef();
  const [status, setStatus] = useState(false);
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [CriminalActivityData, setCriminalActivityData] = useState();
  const [CriminalActivityDrp, setCriminalActivityDrp] = useState();
  const [ArrestCriminalActivityID, setArrestCriminalActivityID] = useState();
  const [loder, setLoder] = useState(false)

  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');
  const [ArrestID, setArrestID] = useState('');

  //screen permission 
  const [value, setValue] = useState({
    'CriminalID': '',
    'ArrestID': '',
    'CreatedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'CriminalIDError': '',
  })

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", ArrestID: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        get_CriminalActi_DropDown(localStoreArray?.ArrestID); get_CriminalActi_Data(localStoreArray?.ArrestID);
        setArrestID(localStoreArray?.ArrestID)
        setValue({ ...value, 'CreatedByUserFK': localStoreArray?.PINID, 'ArrestID': localStoreArray?.ArrestID })
        //  getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID );
      }
    }
  }, [localStoreArray])

  const Reset = () => {
    setValue({
      ...value,
      'CriminalID': '',
    })
    setErrors({
      'CriminalIDError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.CriminalID)) {
      setErrors(prevValues => { return { ...prevValues, ['CriminalIDError']: RequiredFieldIncident(value.CriminalID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { CriminalIDError } = errors

  useEffect(() => {
    if (CriminalIDError === 'true') {
      if (!status) AddCriminalActi();
    }
  }, [CriminalIDError])


  // useEffect(() => {
  //   get_CriminalActi_DropDown();
  //   get_CriminalActi_Data();
  // }, [ArrestID])


  const get_CriminalActi_Data = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID,
    }
    fetchPostData('ArrestCriminalActivity/GetData_ArrestCriminalActivity', val).then((res) => {
      if (res) {
        setCriminalActivityData(res); setLoder(true)
      } else {
        setCriminalActivityData([]); setLoder(true)
      }
    })
  }

  const get_CriminalActi_DropDown = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID,
    }
    fetchPostData('ArrestCriminalActivity/GetData_InsertArrestCriminalActivity', val).then((data) => {
      if (data) {
        setCriminalActivityDrp(Comman_changeArrayFormat(data, 'CriminalActivityID', 'Description',));
      }
      else {
        setCriminalActivityDrp([])
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

  const AddCriminalActi = () => {
    AddDeleteUpadate('ArrestCriminalActivity/Insert_ArrestCriminalActivity', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message); setErrors({ 'CriminalIDError': '' })
        get_CriminalActi_Data(ArrestID);
        get_Arrest_Count(ArrestID);
        get_CriminalActi_DropDown(ArrestID);
        Reset();
        onClear();
        setErrors({
          ['CriminalIDError']: '',
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
      selector: (row) => row.CriminalActivity_Description,
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
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setArrestCriminalActivityID(row.ArrestCriminalActivityID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setArrestCriminalActivityID(row.ArrestCriminalActivityID); }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

  const DeleteCriminalActi = () => {
    const val = {
      'ArrestCriminalActivityID': ArrestCriminalActivityID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ArrestCriminalActivity/Delete_ArrestCriminalActivity', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_CriminalActi_Data(ArrestID);
        get_Arrest_Count(ArrestID);
        get_CriminalActi_DropDown(ArrestID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Criminal Activity</p>
          <div style={{ marginLeft: 'auto' }}>
            <FindListDropDown
              array={ArrCriminalListDropDownArray}
            />
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='CriminalID'
                styles={colourStyles}
                isClearable
                options={CriminalActivityDrp}
                onChange={(e) => { ChangeDropDown(e, 'CriminalID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Criminal Activity</label>
              {errors.CriminalIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CriminalIDError}</span>
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
                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? CriminalActivityData : '' : CriminalActivityData}
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
      <DeletePopUpModal func={DeleteCriminalActi} />
    </>
  )
}

export default CriminalActivity