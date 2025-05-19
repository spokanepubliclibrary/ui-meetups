import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext';

class SearchFacilitator extends React.Component {
  static contextType = MeetupContext;
  static manifest = Object.freeze({
    facilitator: {
      type: 'okapi',
      accumulate: true,
    },
  });

  static propTypes = {
    term: PropTypes.string,
    facilitator: PropTypes.shape({
      records: PropTypes.object,
    }),
    mutator: PropTypes.shape({
      facilitator: PropTypes.shape({
        GET: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.fetchFacilitator();
  };

  componentDidUpdate(prevProps) {
    if (this.props.term !== prevProps.term) {
      this.fetchFacilitator(this.props.term);
    };
  };

  /* 
    Note the use of CQL (Contextual Query Language, FKA Common Query Language) in the query strings that are built conditionally in the code block below. It is a standardized, natural-language syntax used to formulate queries in many information retrieval systems, including FOLIO's OKAPI API. It lets you specify conditions on different fields using logical operators and wildcards, among other features. 

    Please see the Library of Congress documentation here:
    https://www.loc.gov/standards/sru/cql/

    A Gentle Introduction to CQL here:
    https://zing.z3950.org/cql/intro.html
  */
  fetchFacilitator() {
    if (this.props.term) {
      this.context.setIsLoadingSearch(true);
      const terms = this.props.term.split(',');
      let completeQuery = ''

      if (terms.length === 2) {
        // query string for two name values (first and last name)
        // case of "lastName, firstName" or "firstName lastName"
        const [part1, part2] = terms;
        completeQuery = `( 
        (personal.firstName="${encodeURIComponent(part1)}*" and personal.lastName="${encodeURIComponent(part2)}*") 
        or (personal.firstName="${encodeURIComponent(part2)}*" and personal.lastName="${encodeURIComponent(part1)}*")
        )`
      } else {
        // query string for one term or more than two
        const subTerms = this.props.term.split(' ').map(encodeURIComponent);
        if (subTerms.length === 1) {
          // single term, search by both first and last name
          const [term] = subTerms;
          completeQuery = `(personal.firstName="${term}*" or personal.lastName="${term}*" or barcode="${term}*")`
        } else {
          // multiple terms, flexible first or last name search
          const nameQueries = subTerms.map(t => `(personal.firstName="${t}*" or personal.lastName="${t}*" or barcode="${t}*")`);
          completeQuery = nameQueries.join(' and ');
        };
      };
        
      const finalQuery = `(${completeQuery}) sortby personal.lastName personal.firstName`;
      // *** Ready logging for reference ***
      // console.log(`@SearchFacilitator - fetchFacilitator - finalQuery: ${finalQuery}`)

      this.props.mutator.facilitator
        .GET({ path: `users?query=${finalQuery}&limit=1000` })
        .then((records) => {
          const list = records.users;
          const refinedList = list.map((user) => {
            return {
              // ...user, // for reference, do not explicitly need full user object for Meetups application
              id: user.id,
              barcode: user.barcode,
              firstName: user.personal.firstName,
              lastName: user.personal.lastName,
            };
          });
          // *** Ready logging for reference ***
          // console.log("@SearchFacilitator - refinedList: ", JSON.stringify(refinedList, null, 2))
          this.context.setFacilitatorList(refinedList);
          this.context.setIsLoadingSearch(false);
        });
    } else {
      console.log('@fetchFacilitator - something went wrong - no data');
    };
  };
  render() {
    return <></>;
  };
};

SearchFacilitator.contextType = MeetupContext;
SearchFacilitator.propTypes = {
  term: PropTypes.string,
  facilitator: PropTypes.shape({
    records: PropTypes.object,
  }),
  mutator: PropTypes.shape({
    facilitator: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(SearchFacilitator, '@spokane-folio/meetups');