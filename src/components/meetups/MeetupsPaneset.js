import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Icon,
  Paneset,
  Pane,
  SearchField,
  Button,
  Row,
  Col,
} from '@folio/stripes/components';
import ResultsPane from './ResultsPane';
import DetailsPane from './DetailsPane';
import EditPane from './EditPane.js';
import buildQueryString from './helpers/buildQueryString';
import GetListDynamicQuery from './connectedComponents/GetListDynamicQuery.js';
import CreatePane from './CreatePane.js';
import { useMeetups } from '../../contexts/MeetupsContext.js';

const MeetupsPaneset = ({ ...props }) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const {
    isDetailsPaneOpen,
    isEditPaneOpen,
    isCreatePaneOpen,
    limit, setLimit,
    offset, setOffset,
    setQueryString,
    queryString,
    setMeetupsList,
    useGetList,
    setUseGetList,
    setTotalResults
  } = useMeetups();
  const [resetKey, setResetKey] = useState(0); 
  const [formSearchParams, setFormSearchParams] = useState({
    searchType: 'keyword', // Default search type
    term: '' // User input of search term
  });

  const [appliedSearchParams, setAppliedSearchParams] = useState({}); // Stable, cleaned fields for local persist

  const searchableIndexes = [
    { 
      label: intl.formatMessage({ 
        id: "meetups-paneset.searchable-indexes.keyword" 
      }), 
      value: 'keyword' 
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search); 
    const paramObj = {};
    for (const [key, value] of params.entries()) {
      paramObj[key] = value;
    };
    const limitParam = params.get('limit') ?? '20'; 
    const offsetParam = params.get('offset') ?? '0';
    setLimit(Number(limitParam));
    setOffset(Number(offsetParam));
    setAppliedSearchParams(paramObj);
    setUseGetList(true);
  }, []); // For both on render and nav from dismissDetails when viewing details of query results

  // Invoked for both new/unique user inputted params and invoked by handlePagination for session of pagination use 
  const handleUserQuery = (paramsObject) => {
    const queryObj = {
      ...paramsObject,
      limit: limit, // from Context
      offset: offset // from Context
    };
    const finalQuery = buildQueryString(queryObj);
    setQueryString(finalQuery) // Accepts a ready, final query string per use - doesn't mutate etc, only delivers to querying connected component
    setUseGetList(true) // Boolean, when true can use querying connected component 
  };

  /* 
   Note that pagination is not set up out-of-the-box in this sample application. Although, there is some logic and useful pattern hanging around. Please give pagination a try and reference the MultiColumnList props necessary for pagination in order to leverage this existing handler. 
  */
  const handlePagination = (askAmount, index) => {
    const newOffset = index;
    if (newOffset >= 0 && newOffset !== offset) {
      setOffset(newOffset);
      handleUserQuery(appliedSearchParams) // appliedSearchParams = use stable, clean fields of latest query
    }
  };

  useEffect(() => {
    handleUserQuery(appliedSearchParams)
  }, [offset, appliedSearchParams]);

  // *** Ready logging for reference *** 
  // useEffect(() => {
  //   console.log("appliedSearchParams: ", JSON.stringify(appliedSearchParams, null, 2))
  // }, [appliedSearchParams]);

  const handleSubmit = () => {
    const trimmedTerm = formSearchParams.term?.trim();
    const cleanedSearchParams = Object.keys(formSearchParams).reduce((acc, key) => {
      // check for searchType without term
      if (key === 'searchType' && !trimmedTerm) {
        return acc; //skip adding 'searchType' without 'term'
      };
      acc[key] = formSearchParams[key];
      return acc; 
    }, {});

    // *** Ready logging for reference *** 
    console.log("@handleSubmit - cleanedSearchParams: ", JSON.stringify(cleanedSearchParams, null, 2));
    /*
      *** TODO *** 
      When wiring up real req/res cycle,
      uncomment the setter for applied search params
      and the user query handler
    */
    // setAppliedSearchParams(cleanedSearchParams);
    // handleUserQuery(cleanedSearchParams);

    // setOffset(0)
  };

  // reset to on-app render baseline results (most recent)
  const handleResetAll = () => {
    setAppliedSearchParams(''); 
    setFormSearchParams({
      searchType: formSearchParams.searchType,
      term: ''
    });
    setMeetupsList([]);
    // handles reset <Select/> 'searchableIndexes' default value to 'keyword'
    setResetKey((prevKey) => prevKey + 1); 
    setUseGetList(false);
    setTotalResults(0);
    history.push(`/meetups`);
  };

  const handleClearSearchField = () => {
    setFormSearchParams((prev) => {
      return {
        ...prev,
        term: '',
      };
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleParamsValueChange = (event) => {
    const { name, value } = event.target;
    setFormSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // *** Ready logging for reference *** 
  // useEffect(() => {
  //   console.log("formSearchParams: ", JSON.stringify(formSearchParams, null, 2));
  // }, [formSearchParams]);

  return (
    <Paneset>
      <Pane
        defaultWidth='20%'
        paneTitle={<FormattedMessage id="meetups-paneset.search-pane.paneTitle"/>}
        >
        {useGetList && <GetListDynamicQuery query={queryString} />}

        <Row style={{ marginTop: '25px' }}>
          <Col xs={12}>
          <SearchField
            key={resetKey}
            onChange={handleParamsValueChange}
            name="term"
            value={formSearchParams.term}
            searchableIndexes={searchableIndexes}
            onClear={handleClearSearchField}
            onKeyDown={handleKeyDown}
          />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
          <Button
            fullWidth
            buttonStyle='primary'
            onClick={handleSubmit}
          >
            <FormattedMessage id="meetups-paneset.search-pane.search-button"/>
          </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Button
              fullWidth
              style={{ backgroundColor: 'rgb(222, 221, 217)' }}
              buttonStyle="disabled"
              // *** TODO ***
              // Uncomment on click prop and its function:
              // onClick={handleResetAll}
            >
              <Icon icon="times-circle-solid">
                <FormattedMessage id="meetups-paneset.search-pane.reset-button" />
              </Icon>
            </Button>
          </Col>
        </Row>
      </Pane>

      <ResultsPane 
        {...props}
        handlePagination={handlePagination} 
      />
      {isDetailsPaneOpen && <DetailsPane {...props} />}
      {isEditPaneOpen && <EditPane {...props}/>}
      {isCreatePaneOpen && <CreatePane />}
    </Paneset>
  );
};

export default MeetupsPaneset; 