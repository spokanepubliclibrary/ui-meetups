import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext.js';
/*
  Essential --> The Stripes Connect API:
  https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#the-stripes-connect-api
*/

class GetDetails extends React.Component {
  static contextType = MeetupContext;
  /*
    Learn about the Stripes Connect manifest here:
    https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#the-connection-manifest

    Helpful to keep in mind during development:
    https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#note
  */
  static manifest = Object.freeze({
    meetup: {
      type: 'okapi',
      path: 'meetups/:{id}',
      accumulate: true,
    },
  });

  static propTypes = {
    id: PropTypes.string,
    meetup: PropTypes.shape({
      records: PropTypes.object,
    }),
  };

  componentDidMount() {
    this.fetchMeetupDetails(this.props.id);
  };

  componentDidUpdate(prevProps) {
    if(this.props.id !== prevProps.id) {
      this.fetchMeetupDetails(this.props.id)
    }
  };

  fetchMeetupDetails(id) {
    this.props.mutator.meetup
      .GET({ path: `meetups/${id}` })
      .then((records) => {
        // console.log("@fetchMeetupDetails - records: ", JSON.stringify(records, null, 2))
        this.context.setSingleMeetup(records);
        this.context.setIsLoadingDetails(false);
      })
      .catch((error) => {
        console.log('@fetchMeetupDetails - error: ', error);
        this.context.setIsLoadingDetails(false);
      });
  };
  /*
    Good information about Stripes Connect error handling:
    https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#error-handling
  */
  render() {
    return <></>;
  };
};

GetDetails.contextType = MeetupContext;
GetDetails.propTypes = {
  mutator: PropTypes.shape({
    meetup: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(GetDetails, '@spokane-folio/meetups');