import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext.js';

class GetName extends React.Component {
  static contextType = MeetupContext;

  static manifest = Object.freeze({
    customer: {
      type: 'okapi',
      accumulate: true,
    },
  });

  static propTypes = {
    context: PropTypes.string, 
    uuid: PropTypes.string,
    customer: PropTypes.shape({
      record: PropTypes.object,
    }),
    mutator: PropTypes.shape({
      customer: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.fetchName();
  };

  componentDidUpdate(prevProps) {
    if (this.props.uuid !== prevProps.uuid) {
      this.fetchName(this.props.uuid);
    }
  };

  fetchName() {
    if (this.props.uuid) {    
      this.props.mutator.customer
      .GET({ path: `users/${this.props.uuid}` })
      .then((record) => {
        /* 
          Exploring? Uncomment following log and review the full 'record':
          console.log("@GetName - fetchName - record: ", JSON.stringify(record, null, 2));
        */ 
        const refinedRecord = {
          id: record.id, // for reference, not currently leveraged directly in UI
          barcode: record.barcode, // for reference, not currently leveraged directly in UI
          firstName: record.personal.firstName,
          lastName: record.personal.lastName,
        };
        if (this.props.context === 'createdByName') {
          this.props.handleGetCreatedByName(refinedRecord);
        } else if (this.props.context === 'updatedByName') {
          this.props.handleGetUpdatedByName(refinedRecord);
        };
      });
    } else {
      console.log('@fetchName - something went wrong - no data');
    };
  };
 render() {
    return <></>;
  };
};

GetName.contextType = MeetupContext;
GetName.propTypes = {
  uuid: PropTypes.string,
  customer: PropTypes.shape({
    record: PropTypes.object,
  }),
  mutator: PropTypes.shape({
    customer: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(GetName, '@spokane-folio/meetups');