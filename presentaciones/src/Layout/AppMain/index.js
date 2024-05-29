import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment, useEffect } from "react";
import Loader from "react-loaders";

import { ToastContainer } from "react-toastify";
import { localStorageKeys } from "../../utils/constants";
import { useAuthService } from "../../services/auth.service";
import { connect } from "react-redux";
import { setAuthToken, setLoading } from "../../reducers/Auth";

const UserPages = lazy(() => import("../../DemoPages/UserPages"));
const Principales = lazy(() => import("../../DemoPages/Principales"));

const Components = lazy(() => import("../../DemoPages/Components"));
const Tables = lazy(() => import("../../DemoPages/Tables"));

const AppMain = ({setAuthToken, setLoading}) => {
  const authService = useAuthService();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthToken(token);
    } else {
      fetchToken();
    }
  }, [localStorage.getItem(localStorageKeys.TOKEN)]);

  const fetchToken = async () => {
    try {
      setLoading(true);
      const res = await authService.getToken();
      setAuthToken(res.access_token);
      const item = {
        token: res.access_token,
        expiry: new Date().getTime() + res.expires_in * 10000,
      };
      localStorage.setItem(localStorageKeys.TOKEN, JSON.stringify(item));
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    const itemStr = localStorage.getItem(localStorageKeys.TOKEN);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return "";
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      return "";
    }
    return item.token;
  };

  return (
    <Fragment>
      {/* Components */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="ball-pulse-rise" />
              </div>
              <h6 className="mt-5">
                Please wait while we load all the Components examples
                <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/components" component={Components} />
      </Suspense>

    
     

      {/* Tables */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="ball-pulse-rise" />
              </div>
              <h6 className="mt-5">
                Please wait while we load all the Tables examples
                <small>Because this is a demonstration we load at once all the Tables examples. This wouldn't happen in a real live app!</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/tables" component={Tables} />
      </Suspense>

      
      
      {/* Pages */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all the Pages examples
                <small>Because this is a demonstration we load at once all the Pages examples. This wouldn't happen in a real live app!</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/pages" component={UserPages} />
      </Suspense>

      

      {/* Principales */}

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="ball-grid-cy" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all the Principales examples
                <small>Because this is a demonstration, we load at once all the Principales examples. This wouldn't happen in a real live app!</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/principales" component={Principales} />
      </Suspense>

      <Route exact path="/" render={() => <Redirect to="/principales/crm" />} />
      <ToastContainer />
    </Fragment>
  );
};

const mapStateToProps = state => ({
  token: state.authReducer.token,
  loading: state.authReducer.loading,
})

const mapDispatchToProps = dispatch => ({
  setAuthToken: token => dispatch(setAuthToken(token)),
  setLoading: loading => dispatch(setLoading(loading)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppMain);
