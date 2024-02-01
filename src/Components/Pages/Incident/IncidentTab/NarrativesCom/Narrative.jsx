import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import Narratives_Add_Up from './Narratives_Add_Up';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import DatePicker from 'react-datepicker';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { IncNarrativesListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Narrative = (props) => {

  const { incidentReportedDate, setIncidentReportedDate } = props

  const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const [NarrativeData, setNarrativeData] = useState([])
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [narrativeID, setNarrativeID] = useState('')
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [LoginAgencyID, setLoginAgencyID] = useState('')
  const [incidentID, setIncidentID] = useState('')
  const [LoginPinID, setLoginPinID] = useState('');
  const [userName, setUserName] = useState('')

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', UserName: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.UserName) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setIncidentID(localStoreArray?.IncidentID);
        setUserName(localStoreArray?.UserName)
        get_NarrativesData(localStoreArray?.IncidentID); getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      } else {
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   get_NarrativesData(); getScreenPermision();
  // }, [])

  const get_NarrativesData = (incidentID) => {
    const val = {
      IncidentId: incidentID,
    }
    fetchPostData('Narrative/GetData_Narrative', val)
      .then(res => {
        if (res) {
          setNarrativeData(res); setLoder(true)
        } else {
          setNarrativeData([]); setLoder(true)
        }
      })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I032", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const columns = [
    {
      width: '100px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      </>
    },
    {
      width: '150px',
      name: 'Date',
      selector: (row) => getShowingDateText(row.AsOfDate),
      sortable: true
    },
    {
      width: '250px',
      name: 'Narrative',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 60 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      width: '230px',
      name: 'Reported By',
      selector: (row) => row.ReportedBy_Description,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.NarrativeDescription,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 15 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const editNarratives = (e, val) => {
    e.preventDefault();
    setNarrativeID(val.NarrativeID); setUpDateCount(upDateCount + 1); setStatus(true)
    setModal(true);
  }

  const DeleteNarratives = () => {
    const val = {
      'narrativeID': narrativeID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('Narrative/Delete_Narrative', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_IncidentTab_Count(incidentID);
      } else console.log("Somthing Wrong");
      get_NarrativesData(incidentID);
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

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 50,
      minHeight: 50,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Narratives</p>
              <p className="p-0 m-0">
                {/* <Link to="" className="text-white">
                                    <i className="fa fa-filter mr-2"></i>
                                </Link>
                                <Link to="" className="text-white">
                                    <i className="fa fa-print mr-2"></i>
                                </Link> */}
                <div>
                  {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                  }
                  <FindListDropDown
                    array={IncNarrativesListDropDownArray}
                  />
                </div>
              </p>
            </div>
            <div className="col-12 pl-0 ml-0">
              <div className="row mt-2">
                {/* <div className="col-12 pl-0 ml-0">
                  <div className="row mt-2">
                    <div className="col-4">
                      <input type="text" value='' onChange='' className='form-control' placeholder='Search By DESC ...' />
                    </div>
                    <div className="col-4">
                      <input type="text" value='' onChange='' className='form-control' placeholder='Search By Reported ...' />
                    </div>
                    <div className="col-4">
                      <DatePicker
                        dateFormat="MM/dd/yyyy"
                        timeInputLabel
                        name='ReportedDate'
                        value=''
                        onChange=''
                        placeholderText='Search By Date ...'
                        showTimeInput
                        className='form-control datepicker-custom'
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-12 ">
              {
                loder ?
                  <DataTable
                    dense
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? NarrativeData : '' : NarrativeData}
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
        </div>
      </div>
      <DeletePopUpModal func={DeleteNarratives} />
      <Narratives_Add_Up {...{incidentReportedDate, userName, LoginPinID, incidentID, LoginAgencyID, upDateCount, narrativeID, status, modal, setModal, NarrativeData, get_NarrativesData }} />
    </>
  )
}

export default Narrative;