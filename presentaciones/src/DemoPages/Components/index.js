import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// COMPONENTS


// Accordeon

import AccordionExample from "./Accordion/";

// Notifications

import NotificationsExamples from "./Notifications/";


// Layout

import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";

// Theme Options

import ThemeOptions from "../../Layout/ThemeOptions/";

const Components = ({ match }) => (
  <Fragment>
    <ThemeOptions />
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          {/* Components */}



          {/* Accordion*/}

          <Route path={`${match.url}/accordions`} component={AccordionExample}/>

          {/* Notifications */}

          <Route path={`${match.url}/notifications`} component={NotificationsExamples}/>
          
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default Components;
