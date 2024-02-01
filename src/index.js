// Import Component
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
// import './interceptors/axios'
import AgencyData, { AgencyContext } from './Context/Agency/Index';
import AxiosCom from './interceptors/axios';

// Active user check
export const INACTIVE_USER_TIME_THRESHOLD = 600000;
export const USER_ACTIVITY_THROTTLER_TIME = 600000;

let userActivityTimeout = null;
let userActivityThrottlerTimeout = null;
let isInactive = true;

const Deactivate = () => {
  window.location.href = '/'
  localStorage.clear()
}

activateActivityTracker();
function activateActivityTracker() {
  window.addEventListener("load", userActivityThrottler);
  window.addEventListener("mousemove", userActivityThrottler);
  window.addEventListener("click", userActivityThrottler);
  window.addEventListener("scroll", userActivityThrottler);
  window.addEventListener("keydown", userActivityThrottler);
  window.addEventListener("resize", userActivityThrottler);
  window.addEventListener("beforeunload", deactivateActivityTracker);
}

function deactivateActivityTracker() {
  window.removeEventListener("mousemove", userActivityThrottler);
  window.removeEventListener("scroll", userActivityThrottler);
  window.removeEventListener("keydown", userActivityThrottler);
  window.removeEventListener("resize", userActivityThrottler);
  window.removeEventListener("beforeunload", deactivateActivityTracker);
}

function resetUserActivityTimeout() {
  clearTimeout(userActivityTimeout);

  userActivityTimeout = setTimeout(() => {
    userActivityThrottler();
    inactiveUserAction();
  }, INACTIVE_USER_TIME_THRESHOLD);
}

function userActivityThrottler() {
  
  if (isInactive) {
    ReactDOM.render(
      <AgencyData>
        <App />
        <AxiosCom />
      </AgencyData>
      ,
      document.getElementById('root')
    );
    // isInactive = false;
    resetUserActivityTimeout();
  }

  if (!userActivityThrottlerTimeout) {
    userActivityThrottlerTimeout = setTimeout(() => {
      resetUserActivityTimeout();
      clearTimeout(userActivityThrottlerTimeout);
    }, USER_ACTIVITY_THROTTLER_TIME);
  }
}

// Render Component
function inactiveUserAction() {
  ReactDOM.render(
    <Deactivate />,
    document.getElementById('root')
  );

}

// for dark theme
// const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

// function switchTheme(e) {
//   if (e.target.checked) {
//     document.documentElement.setAttribute('data-theme', 'dark');
//     localStorage.setItem('theme', 'dark');
//   }
//   else {
//     document.documentElement.setAttribute('data-theme', 'light');
//     localStorage.setItem('theme', 'light');
//   }
// }

// toggleSwitch.addEventListener('change', switchTheme, false);