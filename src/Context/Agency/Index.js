import React, { createContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, encrypt } from '../../Components/Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../Components/hooks/Api'
import { Comman_changeArrayFormat, sixColArray, threeColArray, threeColArrayWithCode } from '../../Components/Common/ChangeArrayFormat'
import { toastifyError } from '../../Components/Common/AlertMsg'

export const AgencyContext = createContext()

const AgencyData = ({ children }) => {

    // All Use
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState({});
    const [loder, setLoder] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [allowMultipleLogin, setAllowMultipleLogin] = useState(0);
    const [updateCount, setUpdateCount] = useState(0);
    // ------------>| password |<-------------------  
    const [forgetPasswordArray, setForgetPasswordArray] = useState([]);
    // ------------>| Agency |<-------------------       
    const [loding, setLoding] = useState(false);
    const [agencyData, setAgencyData] = useState([]);
    const [agencyFilterData, setAgencyFilterData] = useState([]);
    const [editStatus, setEditStatus] = useState(false);
    const [count, setCount] = useState({});
    const [agencyID, setAgencyID] = useState('');
    const [agnecyName, setAgencyName] = useState('');
    const [status, setStatus] = useState(false);
    const [showPage, setShowPage] = React.useState('home');
    const [changesStatus, setChangesStatus] = useState(false);
    const [changesStatusCount, setChangesStatusCount] = useState(0);
    const [inActiveStatus, setInActiveStatus] = useState(false);

    // ------------>| Personnel |<-------------------
    const [personnelList, setPersonnelList] = useState([]);
    const [showPagePersonnel, setShowPagePersonnel] = React.useState('home');
    const [personnelStatus, setPersonnelStatus] = useState(false);
    const [personnelFilterData, setPersonnelFilterData] = useState('');
    const [PersonnelEffectiveScreenPermission, setPersonnelEffectiveScreenPermission] = useState();

    // for Screen Permission -- Utility -> Personnel
    const [utilityTable, setUtilityTable] = useState({});

    // ------------>| Incident |<-------------------
    const [incidentStatus, setIncidentStatus] = useState(false);
    const [showIncPage, setShowIncPage] = useState('home');
    const [incidentNumber, setIncidentNumber] = useState();
    const [crimeId, setCrimeId] = useState('');
    const [incStatus, setIncStatus] = useState();
    const [offenceData, setOffenceData] = useState([]);
    const [offenceFillterData, setOffenceFillterData] = useState([]);
    const [exceptionalClearID, setEceptionalClearID] = useState([]);
    const [rmsDisposition, setRmsDisposition] = useState([]);
    const [incidentCount, setIncidentCount] = useState([]);
    const [tabCount, setTabCount] = useState([]);
    const [nameCount, setNameCount] = useState([]);

    //----arrest-----
    const [arrestData, setArrestData] = useState([]);
    const [arrestFilterData, setArrestFilterData] = useState([]);
    const [arrestChargeData, setArrestChargeData] = useState();
    const [policeForceDrpData, setPoliceForceDrpData] = useState([]);
    const [arresteeDrpData, setArresteeDrpData] = useState([]);
    const [arrestStatus, setArrestStatus] = useState();
    const [arrestSearch, setarrestSearch] = useState([]);
    const [ArresteName, setArrestName] = useState('');

    // const [incidentReportedDate, setIncidentReportedDate] = useState();
    const [incidentRecentData, setIncidentRecentData] = useState([]);
    const [incidentRmsCfs, setIncidentRmsCfs] = useState('');

    // Offense
    const [offenceShowPage, setOffenceShowPage] = useState('home');
    const [offenceStatus, setOffenceStatus] = useState();

    // Name
    const [nameData, setNameData] = useState([]);
    const [nameFilterData, setNameFilterData] = useState([]);
    const [nameStatus, setNameStatus] = useState();
    const [nameSearchData, setNameSearchData] = useState([]);
    const [nameSearchStatus, setNameSearchStatus] = useState(false);
    const [nameSingleData, setNameSingleData] = useState([]);
    const [nameShowPage, setNameShowPage] = useState('home');

    //property
    const [propertyData, setPropertyData] = useState([]);
    const [propertyFilterData, setPropertyFilterData] = useState([]);
    const [propertyStolenValue, setPropertyStolenValue] = useState('');
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [propertyStatus, setPropertyStatus] = useState(false);

    //Vehicle
    const [VehicleData, setVehicleData] = useState([]);
    const [VehicleFilterData, setVehicleFilterData] = useState([]);
    const [vehicleStatus, setVehicleStatus] = useState(false);

    const [vehicleSingleData, setVehicleSingleData] = useState([]);

    // Warent
    const [warentData, setwarentData] = useState([]);
    const [warentFilterData, setwarentFilterData] = useState([]);
    const [warentStatus, setWarentStatus] = useState();
    const [warrantChargeData, setWarrantChargeData] = useState();

    //Data Searches
    const [incidentSearchData, setIncidentSearchData] = useState([]);
    const [nameSearch, setnameSearch] = useState([]);
    const [arrestSearchData, setArrestSearchData] = useState([]);
    const [propertySearchData, setPropertySearchData] = useState([]);
    const [vehicleSearchData, setVehicleSearchData] = useState([]);
    const [VehicleSearch, setVehicleSearch] = useState([]);

    // WebSocket
    const [ws, setWs] = useState(null)

    //Local Storage
    const [localStoreArray, setLocalStoreArray] = useState({});
    const [tokenArray, setTokenArray] = useState([]);

    //------------------- Local Storage ------------------>
    const get_LocalStorageToken = (localStoreObj) => {
        fetchPostData('LocalStorage/GetData_MultipleKeyLocalStorage', localStoreObj).then((res) => {
            if (res) {
                // console.log("Token", res)
                setTokenArray(res[0]);
            }
        })
    }

    const AlllocalStore = {
        // Value: '',
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        // Key: JSON.stringify({ AgencyID: '', PINID: '', IncidentStatus: '', UserName: '', IncidentID: '', IncidentNumber: '', MasterNameID: '', NameID: '', IsSuperadmin: '', LocalAgencyID: '', ArrestID: '', ChargeID: '', arrestStatus: '', Agency_Name: '', NameStatus: '', OffenceID: '', propertyStatus: '', VehicleID: '', VehicleStatus: '', MasterPropertyID: '', WarrantID: '', WarrantStatus: '', LocalAgencyName: '', })
    }

    // if (!localStoreArray) console.log(localStoreArray)

    //----------get the All  local Array data  with unique ID ------------Dk-> 
    const get_LocalStorage = () => {
        // console.log("Calll  get local Array Data")
        fetchPostData('LocalStorage/GetData_UniqueLocalStorage', AlllocalStore).then((res) => {
            // console.log("Normal", res)
            if (res) {
                setLocalStoreArray(res[0]);
            }
        })
    }

    //----------get the local Array data of specific key with object ------------Dk-> 
    // const get_LocalStorage = (AlllocalStore) => { 
    //     fetchPostData('LocalStorage/GetData_MultipleKeyLocalStorage', AlllocalStore).then((res) => {
    //         // console.log("Normal", res)
    //         if (res) {
    //             setLocalStoreArray(res[0]);
    //         }
    //     })
    // }

    //----------delete the local Array data of specific key with object ------------Dk-> 
    const deleteStoreData = (LocalStoreObj) => {
        // console.log("Call delete array")
        let arr = Object.keys(LocalStoreObj)
        arr.forEach(prop => delete localStoreArray[prop])

        // setLocalStoreArray({ ...localStoreArray, ...LocalStoreObj });
        const val = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify(LocalStoreObj),
        }
        AddDeleteUpadate('LocalStorage/DeleteLocalStorageWithKey', val).then((res) => {
            if (res.success) {
                // setLocalStoreArray(pre => { return { ...pre, ...LocalStoreObj } });
            }
        })
    }

    // const storeData = async (LocalStoreObj) => {
    //     setLocalStoreArray({ ...localStoreArray, ...LocalStoreObj });
    //     const val = {
    //         Value: "",
    //         UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    //         Key: JSON.stringify(LocalStoreObj),
    //     }
    //     AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
    //         if (res.success) {
    //             console.log({ ...localStoreArray, ...LocalStoreObj })
    //         }
    //     })
    // }

    //----------Add Data in local Array  of specific key with object ------------Dk------> 
    const storeData = async (LocalStoreObj) => {
        // for (let key in LocalStoreObj) {
        //     localStoreArray[key] = LocalStoreObj[key];
        // }
        // console.log("Call store array")
        const val = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify(LocalStoreObj),
        }
        AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
            if (res.success) {
                setLocalStoreArray({ ...localStoreArray, ...LocalStoreObj });
                // setLocalStoreArray(pre => { return { ...pre, LocalStoreObj } });
            }
        })
    }

    const [authSession, setAuthSession] = useState({})
    const [isLogout, setIsLogout] = useState(false)
    const [logByOtp, setLogByOtp] = useState(false)

    const getAuthSession = () => {
        const param = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify({ auth_token: "" }),
        };
        fetchPostData('LocalStorage/GetData_MultipleKeyLocalStorage', param).then((res) => {
            // console.log(res);
            if (res?.length > 0) {
                setAuthSession(res[0]);
            }
        })
    }

    const getAgency = async (AgencyID, PinID) => {
        const value = {
            AgencyID: LoginAgencyID ? LoginAgencyID : AgencyID,
            PINID: LoginPinID ? LoginPinID : PinID,
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(data)
                setAgencyFilterData(data)
            } else {
                setAgencyData([]);
                setAgencyFilterData([]);
            }
        })
    }

    const getInActiveAgency = async () => {
        fetchData("Agency/GetData_InActiveAgency").then((data) => {
            if (data) {
                setAgencyData(data)
                setAgencyFilterData(data)
            } else {
                setAgencyData([]);
                setAgencyFilterData([]);
            }
        })
    }

    const get_CountList = (updAgencyID, PINID) => {
        const val = {
            AgencyID: updAgencyID,
            PINID: PINID ? PINID : 0
        }
        fetchPostData('HomeApi/GetData_AgencyCount', val)
            .then((res) => {
                // console.log(res[0]);
                setCount(res[0])
            })
    }

    const get_Personnel_Lists = (id) => {
        const val = {
            AgencyID: id
        }
        fetchPostData('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); setPersonnelFilterData(res) }
                else { setPersonnelList([]); setPersonnelFilterData([]) }
            })
    }

    const getInActive_Personnel = (id) => {
        const val = {
            AgencyID: id
        }
        fetchPostData('Personnel/GetData_InActivePersonnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); setPersonnelFilterData(res) }
                else { setPersonnelList([]); setPersonnelFilterData([]) }
            })
    }

    // ------------>| Incident |<-------------------
    // Offence
    const get_Offence_Data = (IncidentId) => {
        const val = {
            'IncidentId': IncidentId,
            // 'IncidentId': Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId')
        }
        fetchPostData('Crime/GetData_Offense', val)
            .then(res => {
                if (res) {
                    // console.log(res);
                    setOffenceData(res); setOffenceFillterData(res)
                }
                else { setOffenceData([]); setOffenceFillterData([]) }
            })
    };

    const get_Warent_Data = (IncidentId) => {
        const val = {
            'IncidentId': IncidentId,
        }
        fetchPostData('Warrant/GetData_Warrant', val)
            .then(res => {
                if (res) {
                    setwarentData(res); setwarentFilterData(res)
                }
                else { setwarentData([]); setwarentFilterData([]) }
            })
    };

    const GetDataExceptionalClearanceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_ExceptionalClearance', val).then((data) => {
            if (data) {
                // console.log(data)
                setEceptionalClearID(threeColArrayWithCode(data, 'ClearanceID', 'Description', 'ClearanceCode'))
            } else {
                setEceptionalClearID([]);
            }
        })
    }

    const getRmsDispositionID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_RMSDisposition', val).then((data) => {
            if (data) {
                setRmsDisposition(threeColArray(data, 'RMSDispositionId', 'RMSDispositionCode', 'DispositionCode'))
            } else {
                setRmsDisposition([]);
            }
        })
    }

    // Name
    const get_Data_Name = (NameID) => {
        const val = {
            'IncidentID': NameID ? NameID : 0,
        }
        fetchPostData('MasterName/GetData_MasterName', val).then((res) => {
            if (res) {
                setNameData(res); setNameFilterData(res)
            } else {
                setNameData([]); setNameFilterData([])
            }
        })
    }

    // Arrest Data
    const get_Data_Arrest = (IncidentID) => {
        const val = {
            'IncidentID': IncidentID
        }
        fetchPostData('Arrest/GetData_Arrest', val).then((res) => {
            if (res) {
                setArrestData(res); setArrestFilterData(res)
            } else {
                setArrestData([]); setArrestFilterData([])
            }
        })
    }

    const get_Arrestee_Drp_Data = (openPage, MasterNameID, IncidentID) => {
        const val = {
            'MasterNameID': '0',
            'IncidentID': IncidentID,
        }
        const val1 = {
            'IncidentID': '0',
            'MasterNameID': MasterNameID,
        }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', openPage === 'ArrestSearch' ? val1 : val).then((data) => {
            if (data) {
                setArresteeDrpData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
            }
            else {
                setArresteeDrpData([])
            }
        })
    };

    const get_Police_Force = () => {
        fetchData('DropDown/GetDataDropDown_RightsGiven').then((data) => {
            if (data) {
                setPoliceForceDrpData(threeColArray(data, 'RightGivenID', 'Description', 'Code'));
            }
            else {
                setPoliceForceDrpData([])
            }
        })
    };

    // Arrest subTab  Charge Data
    const get_Data_Arrest_Charge = (ArrestID) => {
        const val = {
            'ArrestID': ArrestID,
        }
        fetchPostData('ArrestCharge/GetData_ArrestCharge', val).then((res) => {
            // console.log(res)
            if (res) {
                setArrestChargeData(res)
            } else {
                setArrestChargeData([]);
            }
        })
    }

    const get_Data_Warrant_Charge = (WarrantID) => {
        const val = {
            'WarrantID': WarrantID,
        }
        fetchPostData('ArrestCharge/GetData_ArrestChargeWarrant', val).then((res) => {
            console.log(res)
            if (res) {
                setWarrantChargeData(res)
            } else {
                setWarrantChargeData([]);
            }
        })
    }

    // get Data Property 
    const get_Data_Property = (IncidentID) => {
        const val = {
            'IncidentID': IncidentID
        }
        fetchPostData('Property/GetData_Property', val).then((res) => {
            if (res) {
                setPropertyData(res); setPropertyFilterData(res); setLoder(true);
            } else {
                setPropertyData([]); setPropertyFilterData([]); setLoder(true);
            }
        })
    }

    const get_PropertyLossCode = (LoginAgencyID, IsArticleReason, IsBoatReason, IsSecurityReason, IsOtherReason, IsDrugReason, IsGunReason) => {
        // alert("Call LossDrp");
        const val = {
            // AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
            AgencyID: LoginAgencyID,
            IsArticleReason: IsArticleReason ? IsArticleReason : 0,
            IsBoatReason: IsBoatReason ? IsBoatReason : 0,
            IsSecurityReason: IsSecurityReason ? IsSecurityReason : 0,
            IsOtherReason: IsOtherReason ? IsOtherReason : 0,
            IsDrugReason: IsDrugReason ? IsDrugReason : 0,
            IsGunReason: IsGunReason ? IsGunReason : 0,
        }
        // console.log(val);
        fetchPostData('PropertyReasonCode/GetDataDropDown_PropertyReasonCode', val).then((data) => {
            if (data) {
                // console.log(data)
                setPropertyLossCodeData(threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode'))
            } else {
                setPropertyLossCodeData([]);
            }
        })
    }

    // get Data vehicle 
    const get_Data_Vehicle = (IncidentId) => {
        const val = {
            'IncidentId': IncidentId,
        }
        fetchPostData('PropertyVehicle/GetData_PropertyVehicle', val).then((res) => {
            if (res) {
                setVehicleData(res); setVehicleFilterData(res)
            } else {
                setVehicleData([]); setVehicleFilterData([])
            }
        })
    }

    const get_Incident_Count = (IncidentID) => {
        const val = {
            'IncidentID': IncidentID,
        }
        fetchPostData('HomeApi/GetData_IncidentCount', val).then((res) => {
            if (res) {
                // console.log(res)
                setIncidentCount(res);
            } else {
                setIncidentCount([]);
            }
        })
    }

    const get_IncidentTab_Count = (IncidentID) => {
        const val = {
            'IncidentID': IncidentID,
        }
        fetchPostData('HomeApi/GetData_IncidentTabCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //-----------------offence-Tab-Count------------------------------
    const get_Offence_Count = (CrimeID) => {
        const val = {
            'CrimeID': CrimeID,
        }
        fetchPostData('HomeApi/GetData_OffenseCount', val).then((res) => {
            // console.log(res);
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //-----------------------------Name-Count------------------
    const get_Name_Count = (NameID) => {
        const val = {
            'NameID': NameID,
        }
        fetchPostData('HomeApi/GetData_NameCount', val).then((res) => {
            if (res) {
                console.log(res);
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    const get_NameVictim_Count = (VictimID) => {
        const val = {
            'VictimID': VictimID,
        }
        fetchPostData('NameVictimCount/GetData_NameVictimCount', val).then((res) => {
            console.log(res);
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }
    const get_NameOffender_Count = (NameID) => {
        const val = {
            'NameID': NameID,
        }
        fetchPostData('NameVictimCount/GetData_NameOffenderCount', val).then((res) => {
            console.log(res);
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //-----------------------------Property-Count-----------------------
    const get_Property_Count = (PropertyID) => {
        const val = {
            'PropertyID': PropertyID,
        }
        fetchPostData('HomeApi/GetData_PropertyCount', val).then((res) => {
            if (res) {
                // console.log(res);
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //------------------------------------------Vicile-Count--------------------------------------
    const get_vehicle_Count = (VehicleID) => {
        const val = {
            // 'VehicleID': VehicleID ? VehicleID : sessionStorage.getItem('VehicleID') && Decrypt_Id_Name(sessionStorage.getItem('VehicleID'), 'VForVehicleID'),
            'VehicleID': VehicleID
        }
        fetchPostData('HomeApi/GetData_VehicleCount', val).then((res) => {
            // console.log(res);
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //------------Arrest-Count--------------------------
    const get_Arrest_Count = (ArrestID) => {
        const val = {
            'ArrestID': ArrestID
        }
        // console.log(val)
        fetchPostData('HomeApi/GetData_ArrestCount', val).then((res) => {
            if (res) {
                // console.log(res);
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    const get_ArrestCharge_Count = (ChargeID) => {
        const val = {
            'ChargeID': ChargeID
        }
        fetchPostData('ArrestCharge/GetData_ArrestChargeCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //------------------------------Warrent_Count---------------------------
    const get_Warrent_Count = (WarrantID) => {
        const val = {
            'WarrantID': WarrantID,
        }
        fetchPostData('HomeApi/GetData_WarrantCount', val).then((res) => {
            // console.log(res)
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    // Login WebSocket
    const login_Web_Socket = (wsClient, user, globalIndex) => {
        var reqLogin = {
            Method: "Login",
            FromUserName: user ? user : localStorage.getItem('UserName') && Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName'),
            GlobalIndex: globalIndex
        };
        var plain = JSON.stringify(reqLogin);
        var secret = encrypt(plain);
        wsClient.send(secret);
        // navigate('/chat')
    };

    // Send Message Assgin list
    const sendMessage = (wsClient, username, textMessage) => {
        console.log(username);
        var reqSend = {
            Method: "Send",
            FromUserName: localStorage.getItem('UserName') && Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName'),
            // FromUserName: localStorage.getItem('UserName') && Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName') + '$@' + new Date().getTime(),
            ToUserNameList: username?.split(','),
            Type: '0',
            GroupName: '',
            Content: textMessage
        };
        var plain = JSON.stringify(reqSend);
        var secret = encrypt(plain);
        console.log(reqSend);
        wsClient.send(secret);
    }

    const [personnelData, setPersonnelData] = useState([]);

    const getPersonnelList = async () => {
        fetchData('CADIncidentStatus/GetData_CurrentStatus').then((res) => {
            if (res.length > 0) {
                setPersonnelData(res);
            } else {
                toastifyError("Data Not Available"); setPersonnelData([]);
            }
        });
    };

    return (
        <AgencyContext.Provider value={{
            // forgetPassword
            forgetPasswordArray, setForgetPasswordArray,
            // All use
            loder, setLoder, LoginPinID, setLoginPinID, LoginAgencyID, setLoginAgencyID, allowMultipleLogin, setAllowMultipleLogin,

            agencyData, agencyFilterData, setAgencyFilterData, getAgency, setEditStatus, editStatus, get_CountList, count, loding, setCount, inActiveStatus, setInActiveStatus, getInActiveAgency, getInActive_Personnel,
            // Agency
            setAgencyID, agencyID, agnecyName, setAgencyName, setShowPage, showPage, status, setStatus, changesStatus, setChangesStatus, setChangesStatusCount, changesStatusCount,

            //  Personnel
            get_Personnel_Lists, personnelList, showPagePersonnel, setShowPagePersonnel, personnelStatus, setPersonnelStatus, personnelFilterData, setPersonnelFilterData, PersonnelEffectiveScreenPermission, setPersonnelEffectiveScreenPermission, personnelData, getPersonnelList,

            // for Screen Permission
            setUtilityTable, utilityTable,

            // Incident
            incidentStatus, setIncidentStatus, showIncPage, setShowIncPage, incidentNumber, setIncidentNumber, crimeId, setCrimeId, incStatus, setIncStatus, updateCount, setUpdateCount, offenceData, get_Offence_Data, get_Data_Name, incidentRmsCfs, setIncidentRmsCfs, exceptionalClearID, setEceptionalClearID, GetDataExceptionalClearanceID, rmsDisposition, setRmsDisposition, getRmsDispositionID, incidentRecentData, setIncidentRecentData,
            // arrest
            arrestData, get_Data_Arrest, arrestChargeData, get_Data_Arrest_Charge, policeForceDrpData, get_Police_Force, get_Arrestee_Drp_Data, arresteeDrpData, setArresteeDrpData, arrestStatus, setArrestStatus, ArresteName, setArrestName,
            //Offence
            offenceStatus, setOffenceStatus,
            // Incident property
            propertyData, setPropertyData, get_Data_Property, propertyStolenValue, setPropertyStolenValue,
            // Name
            nameData, nameSearchData, setNameSearchData, nameStatus, setNameStatus, nameSearchStatus, setNameSearchStatus,
            // vehicle
            get_Data_Vehicle, VehicleData, setVehicleData, vehicleStatus, setVehicleStatus, nameSearchStatus, setNameSearchStatus, setVehicleSingleData, VehicleSearch, setVehicleSearch,
            // Property
            propertyTypeData, setPropertyTypeData, propertyLossCodeData, setPropertyLossCodeData, get_PropertyLossCode, propertyStatus, setPropertyStatus,
            // Warent 
            warentData, setwarentData, warrantChargeData, get_Data_Warrant_Charge, get_Warent_Data, warentStatus, setWarentStatus, nameSingleData, setNameSingleData, offenceFillterData, setOffenceFillterData, setNameFilterData, nameFilterData, propertyFilterData, setPropertyFilterData, VehicleFilterData, setVehicleFilterData, arrestFilterData, setArrestFilterData, warentFilterData, setwarentFilterData,
            //Count
            get_Incident_Count, incidentCount, setIncidentCount, tabCount, setTabCount, get_Offence_Count, tabCount, get_Name_Count, get_NameVictim_Count, get_NameOffender_Count, nameCount, get_Property_Count, get_vehicle_Count, get_Arrest_Count, get_Warrent_Count, get_ArrestCharge_Count,
            //Data Searches
            incidentSearchData, setIncidentSearchData, nameSearch, setnameSearch, arrestSearchData, setArrestSearchData, propertySearchData, setPropertySearchData, arrestSearch, setarrestSearch, vehicleSearchData, setVehicleSearchData,
            //-incidentCount
            get_IncidentTab_Count,
            nameShowPage, setNameShowPage, offenceShowPage, setOffenceShowPage,
            // Web Shocket
            login_Web_Socket, ws, setWs,
            // Incident ShowPages
            nameShowPage, setNameShowPage, offenceShowPage, setOffenceShowPage, sendMessage,
            // localStoreArray
            localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData,
            // Session Auth Token
            tokenArray, setTokenArray, get_LocalStorageToken, authSession, setAuthSession, getAuthSession,
            isLogout, setIsLogout, logByOtp, setLogByOtp
        }}>
            {children}
        </AgencyContext.Provider>
    )
}

export default AgencyData