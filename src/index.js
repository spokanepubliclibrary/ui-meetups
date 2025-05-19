import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { IntlProvider } from 'react-intl';
import enUStranslations from '../translations/ui-meetups/en_US';
import Application from './routes/application';
import Settings from './settings';
import DetailsPane from './components/meetups/DetailsPane.js';
import EditPane from './components/meetups/EditPane.js';
import CreatePane from './components/meetups/CreatePane.js'
import { MeetupProvider } from './contexts/MeetupsContext';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Meetups extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func
    })
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      showSettings,
      match: {
        path
      }
    } = this.props;

    if (showSettings) {
      return (
        <IntlProvider
          locale="en" 
          messages={enUStranslations} 
        >
          <MeetupProvider>
            <Settings {...this.props} />
          </MeetupProvider>
        </IntlProvider>
      
      );
    }

    return (
    <IntlProvider
      locale="en" 
      messages={enUStranslations} 
    >
        <MeetupProvider>
        <Switch>
          <Route
            path={path}
            exact
            component={Application}
          />
           <Route
            path={`${path}/create`}
            exact component={CreatePane}
          />
          <Route
            path={`${path}/:id`}
            exact component={DetailsPane}
          />
          <Route
            path={`${path}/:id/edit`}
            exact component={EditPane}
          />
        </Switch>
      </MeetupProvider>
    </IntlProvider>
    );
  }
};

export default Meetups;