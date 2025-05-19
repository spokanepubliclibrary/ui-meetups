import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext';

class GetListDynamicQuery extends React.Component {
  static contextType = MeetupContext;
  static manifest = Object.freeze({
    meetups: {
      type: 'okapi',
      accumulate: true,
    },
  });

  static propTypes = {
    query: PropTypes.object,
    meetups: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.lastQuery = this.context.queryString;
    this.fetchListDynamicQuery();
  };

  componentDidUpdate() {
    // compare to stored lastQuery
    if (this.context.queryString !== this.lastQuery) {
      this.fetchListDynamicQuery();
      this.lastQuery = this.context.queryString; //update stored value
    };
  };

  fetchListDynamicQuery() {
    const query = this.context.queryString;
    // console.log("@fetchListDynamicQuery - query: ", JSON.stringify(query, null, 2));

    this.context.setIsLoadingSearch(true);
    this.props.history.push(`meetups?${query}`);

    this.props.mutator.meetups.GET({ path: `meetups?${query}` })
    .then((records) => {
      // console.log("records: ", JSON.stringify(records, null, 2));
      this.context.setTotalResults(records.totalRecords);
      this.context.setMeetupsList(records.meetups);
      this.context.setIsLoadingSearch(false);
    })
    .catch((error) => {
      console.error('error fetching meetups: ', error);
      this.context.setIsLoadingSearch(false);
    })
  };

  render() {
    return <></>;
  };
};

GetListDynamicQuery.contextType = MeetupContext;
GetListDynamicQuery.propTypes = {
  mutator: PropTypes.shape({
    meetups: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(
  withRouter(GetListDynamicQuery),
  '@spokane-folio/meetups'
);