import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Components/Inc/Sidebar';
import Header from './Components/Inc/Header';
import { AgencyContext } from './Context/Agency/Index';
var CryptoJS = require("crypto-js");

const Auth = (props) => {

  const { cmp, listManagementSideBar, agencySideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, progressData, progressStatus, reportSidebar, searchSidebar } = props
  const Com = cmp;


  const navigate = useNavigate()

  const { authSession, getAuthSession, setAuthSession, isLogout, logByOtp, setLogByOtp, setIsLogout } = useContext(AgencyContext);

  const IsLoginSession = sessionStorage.getItem('is-login') ? sessionStorage.getItem('is-login') : false;

  const currentLocation = window.location.pathname + window.location.search + window.location.hash;

  //----for disable browser backButton after login ----Devkashyap 17/01/2024

  useEffect(() => {
    if (IsLoginSession && window.location.pathname === "/dashboard-page") {
      preventBack();
    }
  }, [window.location.pathname]);

  function preventBack() {
    window.onpopstate = function (event) {
      // console.log(event.state)
      // console.log(event.state.url)
      // console.log(currentLocation)
      if (event.state && event.state.url === currentLocation || currentLocation === window.location.pathname) {
        window.history.go(1);
      }
    };
    window.history.pushState({ url: currentLocation }, '');
  }

  //----- above code ---Devkashyap 17/01/2024

  useEffect(() => {
    // console.log(IsLoginSession !== 'true' || IsLoginSession !== true)
    if (IsLoginSession === 'true' || IsLoginSession === true) {
      console.log("Login Sucess")
    } else {
      setIsLogout(false);
      setLogByOtp(false)
      setAuthSession('');
      navigate('/');
    }
    // old code By Deepak
    // if (!IsLoginSession) {
    //   setIsLogout(false);
    //   setLogByOtp(false)
    //   setAuthSession('');
    //   navigate('/');
    // }
  }, [])

  useEffect(() => {
    if (IsLoginSession === 'true' || IsLoginSession === true) {
      // console.log("Login Sucess")
    } else {
      setIsLogout(false);
      setLogByOtp(false)
      setAuthSession('');
      navigate('/');
    }
    // old code By Deepak
    // if (IsLoginSession !== 'true' || IsLoginSession !== true) {
    //   setIsLogout(false);
    //   setLogByOtp(false)
    //   setAuthSession('');
    //   navigate('/');
    // } else {
    //   // connect_Web()
    // }
  }, [IsLoginSession])

  // const connect_Web = () => {
  //   const wsClient = new WebSocket('wss://rmswebsocket.com:54183');

  //   wsClient.onopen = () => { console.log('e.data','ws opened'); setWs(wsClient); login('testing', wsClient) };

  //   wsClient.onclose = () => { console.log('e.data','ws closed'); setTimeout(connect_Web, 3000); }

  //   return () => { wsClient.close(); }
  // }

  // useEffect(() => {
  //   if (!ws) return;
  //   ws.onmessage = e => {
  //     if (isPaused) return;
  //     var plain = decrypt(e.data);
  //     var json = JSON.parse(plain);
  //     // console.log('e.data', json);
  //     // if (json.Messages) {
  //     //   const Content = JSON.parse(json.Messages[0].Content.replace(/&quot;/ig, '"'))
  //     //   console.log('e.data', Content);
  //     //   console.log('e.data', JSON.parse(Content.Messages));
  //     //  }
  //   };
  // }, [isPaused, ws]);

  // var globalIndex = 0;

  // const login = (UserName, wsClient) => {
  //   var reqLogin = {
  //     Method: "Login",
  //     FromUserName: UserName,
  //     GlobalIndex: globalIndex
  //   };
  //   var plain = JSON.stringify(reqLogin);
  //   var secret = encrypt(plain);
  //   wsClient.send(secret);
  //   // navigate('/chat')
  // };

  // const send_Notification = (data) => {
  // console.log('e.data', data);
  // alert('call')
  //     var reqSend = {
  //       Method: "Send",
  //       FromUserName: 'admin',
  //       ToUserNameList: 'Global'.split(','),
  //       Type: '0',
  //       GroupName: '',
  //       // Content:textMessage
  //       Content: JSON.stringify({
  //         Message: data
  //       })
  //     };
  //     var plain = JSON.stringify(reqSend);
  //     var secret = encrypt(plain);
  //     ws.send(secret);
  //   }

  return (
    <>
      {/* Sidebar */}
      {
        !IsLoginSession ? navigate('/')
          : <>
            <Sidebar {...{ listManagementSideBar, agencySideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, reportSidebar, searchSidebar }} />
            <div className="page">
              <Header {...{ listManagementSideBar, agencySideBar, personnelSideBar }} />
              {/* Component */}
              <Com {...{ progressData, progressStatus }} />
            </div>
          </>
      }
      {/* //--- previous code------ */}
      {
        // authSession?.auth_token == undefined ? navigate('/')
        //   : <>
        //     <Sidebar {...{ listManagementSideBar, agencySideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, reportSidebar, searchSidebar }} />
        //     <div className="page">
        //       <Header {...{ listManagementSideBar, agencySideBar, personnelSideBar }} />
        //       {/* Component */}
        //       <Com {...{ progressData, progressStatus }} />
        //     </div>
        //   </>
      }
    </>
  )
}

export default Auth


export function encrypt(plain) {
  var aesKey = '0ca175b9c0f726a831d895e269332461';
  var key = CryptoJS.enc.Utf8.parse(aesKey);
  var encryptedData = CryptoJS.AES.encrypt(plain, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedData.ciphertext.toString()));
}


export function decrypt(secret) {
  var aesKey = '0ca175b9c0f726a831d895e269332461';
  var key = CryptoJS.enc.Utf8.parse(aesKey);
  var decryptedData = CryptoJS.AES.decrypt(secret, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}