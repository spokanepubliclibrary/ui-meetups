import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext';

class GetSelf extends React.Component {
  static contextType = MeetupContext;
  static manifest = Object.freeze({
    self: {
      type: 'okapi',
      accumulate: true,
    },
  });

  static propTypes = {
    self: PropTypes.shape({
      records: PropTypes.object,
    }),
    mutator: PropTypes.shape({
      self: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.fetchSelf();
  };

  componentDidUpdate(prevProps) {
    if (this.props.self !== prevProps.self) {
      this.fetchSelf();
    };
  };


  /*
    fetchSelf makes request at '/bl-users/_self' which returns a 'user' object
    that has many properties. In this context we utilize 'id' and 'barcode' and the nested 'personal' object keys for 'lastName', 'firstName'. 

    You can reference the 'bl-users/_self' endpoint documentation here: 
    https://s3.amazonaws.com/foliodocs/api/mod-users-bl/r/mod-users-bl.html#bl_users__self_get

    FOLIO API documentation:
    https://dev.folio.org/reference/api/
  */
  fetchSelf() {
    this.props.mutator.self
      .GET({ path: `bl-users/_self` })
      .then((records) => {
        const self = records.user;
        /* 
         Exploring? Uncomment following log and review the full 'records.user':
         console.log("@GetSelf - fetchSelf - self: ", JSON.stringify(records.user, null, 2));
        */
        const refinedSelf = {
          id: self.id,
          lastName: self.personal.lastName,
          firstName: self.personal.firstName,
          barcode: self.barcode ? self.barcode : '',
        };
        this.context.setSelf(refinedSelf);
      })
      .catch((error) => {
        console.log(
          '@fetchSelf - something went wrong - no data. Error: ',
          JSON.stringify(error, null, 2)
        );
      });
  };

  render() {
    return <></>;
  };
};

GetSelf.contextType = MeetupContext;

export default stripesConnect(GetSelf, '@spokane-folio/meetups');