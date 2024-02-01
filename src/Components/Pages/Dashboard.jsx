// Import Component
import React, { useState, useEffect } from "react";
import { Decrypt_Id_Name } from "../Common/Utility";
import { Link } from "react-router-dom";
import arrest from '../../img/dash-arrest.png';
import warrant from '../../img/dash-warrant.png';
import { useContext } from "react";
import { AgencyContext } from "../../Context/Agency/Index";

const Dashboard = () => {

  const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const [greet, setGreet] = useState('');
  const [userName, setUserName] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: '', PINID: '', IncidentStatus: '', UserName: '', IncidentID: '', IncidentNumber: '', MasterNameID: '', NameID: '', IsSuperadmin: '', LocalAgencyID: '', ArrestID: '', ChargeID: '', arrestStatus: '', Agency_Name: '', NameStatus: '', OffenceID: '', propertyStatus: '', VehicleID: '', VehicleStatus: '', MasterPropertyID: '', WarrantID: '', WarrantStatus: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.UserName || !localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.UserName) {
        setUserName(localStoreArray?.UserName);
      }
    }
  }, [localStoreArray])

  const myDate = new Date();
  const hrs = myDate.getHours();

  useEffect(() => {
    if (hrs < 12) {
      setGreet('Good Morning')
    } else if (hrs >= 12 && hrs <= 17) {
      setGreet('Good Afternoon')
    } else if (hrs >= 17 && hrs <= 24) {
      setGreet('Good Evening')
    } else {
      setGreet('')
    }
  }, []);

  return (
    <>
      <div className="section-body mt-4">
        <div className="container-fluid">
          <div className="row clearfix">
            <div className="card">
              <div className="md">
                <h6 className="d-inline-block form-set p-2" >
                  Welcome ,{userName ? userName : ''}
                  {/* {Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName')} */}
                </h6>
                <h4 className="d-inline-block ml-2">{greet} </h4>
                <small className="d-block">
                </small>
              </div>
              <div className="main-dashboard col-12 mb-2">
                <fieldset className="Main-field">
                  <legend>Module</legend>
                  <div className="box-container ">
                    <div className="box">
                      <Link to={'/incident'}>
                        <i className="fa fa-stack-exchange size-fa-32px" aria-hidden="true"></i>
                        <p>Incident</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/name'>
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        <p>Name</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/property'>
                        <i className="fa fa-building "></i>
                        <p>Property</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/vehicle'>
                        <i className="fa fa-car "></i>
                        <p>Vehicle</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/warrant'>
                        <img src={warrant} alt="" className=" " style={{ width: '30px', paddingTop: '15px' }} />
                        {/* <i className="fa fa-" aria-hidden="true"></i> */}
                        <p>Warrant</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/newreports'>
                        <img src={arrest} alt="" className=" " style={{ width: '30px', paddingTop: '15px' }} />
                        {/* <i className="fa fa-" aria-hidden="true"></i> */}
                        <p>Arrest</p>
                      </Link>
                    </div>

                  </div>
                </fieldset>
                <fieldset className="Main-field ">
                  <legend>Reports</legend>
                  <div className="box-container">
                    <div className="box " >
                      <Link to='/Reports' >
                        <i className="fa fa-stack-exchange size-fa-32px" aria-hidden="true"></i>

                        <p>Incident</p>
                      </Link>
                    </div>
                    <div className="box " >
                      <Link to='/Reports'>
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        <p>Name</p>
                      </Link>
                    </div>
                    <div className="box " >
                      <Link to='/Reports'>
                        <i className="fa fa-building "></i>
                        <p>Property</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/Reports'>
                        <i className="fa fa-car "></i>
                        <p>Vehicle</p>
                      </Link>
                    </div>
                    <div className="box ">

                      <img src={warrant} alt="" className="img-icon " style={{ width: '30px', paddingTop: '15px' }} />
                      <p>Warrant</p>
                    </div>
                    <div className="box " >
                      <Link to='/Reports'>
                        <img src={arrest} alt="" className=" " style={{ width: '30px', paddingTop: '15px' }} />

                        <p>Arrest</p>
                      </Link>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="Main-field">
                  <legend >Search</legend>
                  <div className="box-container">
                    <div className="box " >
                      <Link to='/incident-advanceSearch?page=incidentAdvanceSearch'>
                        <i className="fa fa-stack-exchange size-fa-32px" aria-hidden="true"></i>
                        <p>Incident</p>
                      </Link>
                    </div>
                    <div className="box " >
                      <Link to='/name-advanceSearch?page=nameAdvanceSearch'>
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        <p>Name</p>
                      </Link>
                    </div>
                    <div className="box " >
                      <Link to='/property-advanceSearch?page=propertyAdvanceSearch'>
                        <i className="fa fa-building "></i>
                        <p>Property</p>
                      </Link>
                    </div>
                    <div className="box">
                      <Link to='/vehicle-advanceSearch?page=vehicleAdvanceSearch'>
                        <i className="fa fa-car "></i>
                        <p>Vehicle</p>
                      </Link>
                    </div>
                    <div className="box " >
                      <img src={warrant} alt="" className="img-icon " style={{ width: '30px', paddingTop: '15px' }} />
                      <p>Warrant</p>
                    </div>
                    <div className="box " >
                      <Link to='/arrest-advanceSearch?page=arrestAdvanceSearch'>
                        <img src={arrest} alt="" className=" " style={{ width: '30px', paddingTop: '15px' }} />
                        <p>Arrest</p>
                      </Link>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* for dark theme */}
      {/* <div>
        <nav>
          <div className="theme-switch-wrapper">
            <label className="theme-switch" htmlFor="checkbox">
              <input type="checkbox" id="checkbox" />
              <div className="slider round" />
            </label>
            <em>Switch</em>
          </div>
        </nav>
        <section>
          <article className="post">
            <h1>What is lorem ipsum</h1>
            <p> simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </article>
        </section>
      </div> */}

    </>
  );
};

export default Dashboard;
