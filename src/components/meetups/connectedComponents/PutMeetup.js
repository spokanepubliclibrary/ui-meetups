import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext';

class PutMeetup extends React.Component {
  static contextType = MeetupContext;

  static manifest = Object.freeze({
    meetup: {
      type: 'okapi',
      records: 'meetups',
      PUT: {
        path: 'meetups/!{id}',
      },
      accumulate: true,
    },
  });

  // console.log("manifest _resourceData:", JSON.stringify(_resourceData, null, 2));

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    mutator: PropTypes.shape({
      meetup: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    handleCloseEdit: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data && this.props.id) {
      this.updateMeetup(this.props.id, this.props.data);
    }
  }

  updateMeetup = (id, data) => {
    this.context.setIsUpdatingMeetup(true);

    // handle update meetup record w/ attachments
    if (this.context.attachmentsData && this.context.attachmentsData.length > 0) { 
      this.props.mutator.meetup
      .PUT(data)
      .then(() => {
        this.context.setIdForMediaCreate(this.props.id);
        this.context.setFormDataArrayForMediaCreate(this.context.attachmentsData);
      })
      .catch((error) => {
        this.context.setUseGetList(false);
        console.error(
          '@updateMeetup - WITH Attachments - Error occurred: ',
          error
        );
      });
    } else {
      // handle update meetup record w/out attachments
      this.props.mutator.meetup
        .PUT(data)
        .then(() => {
          this.context.setIsLoadingDetails(false);
          this.context.setIsUpdatingMeetup(false);
          this.props.handleCloseEdit();
          this.context.setUseGetList(false);
          console.log('update successful');
        })
        .catch((error) => {
          this.context.setUseGetList(false);
          console.error(
            '@updateMeetup - NO Attachments - Error occurred: ',
            error
          );
        });
    }
  };

  render() {
    return <></>;
  }
}

PutMeetup.contextType = MeetupContext;

export default stripesConnect(PutMeetup, '@spokane-folio/meetups');