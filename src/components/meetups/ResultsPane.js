import React from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
// import { useStripes } from '@folio/stripes/core';
import {
  LoadingPane,
  MultiColumnList,
  Pane,
  PaneHeader,
  Button,
} from '@folio/stripes/components';
import tempData from '../../data/meetupsList';
import { useMeetups } from '../../contexts/MeetupsContext.js';


const ResultsPane = ({setIsDetailsOpen, handlePagination, ...props}) => {
  const history = useHistory();
  // const stripes = useStripes();
  const {
    setIsDetailsPaneOpen,
    meetupsList,
    setIsCreatePaneOpen,
    isLoadingSearch
  } = useMeetups();

  let endOfListTotal = 0;
  if (meetupsList) {
    endOfListTotal = meetupsList.length; 
  };
  
  const handleViewDetails = (event, row) => {
    const id = row.id;
    setIsDetailsPaneOpen(true);
    history.push(`/meetups/${id}`);
  };

  const handleOpenCreate = () => {
    setIsCreatePaneOpen(true)
    history.push(`/meetups/create`);
  };

  const getActionMenu = ({ onToggle }) => (
    <Button
      buttonStyle='primary'
      onClick={() => handleOpenCreate()}
    >
      <FormattedMessage id="meetups.action-menu.create-button" />
    </Button>
  );
  
  /* 
   *** Utilize Stripes object method hasPerm() ***
   If logged in user has that permission, show actionMenu (Action - Create)
   else undefined (do not render actionMenu)

   Will need to use import useStripes and reference to it, see at top of file.

   hasPerm(arg) = a comma-delimited string of permissions to check

   Possible implementation:
   const actionMenu = stripes.hasPerm('ui-meetups.edit')
      ?
      getActionMenu
      : undefined;

  */   

  const resultsFormatter = {
    facilitator: (item) => {
      const {lastName, firstName} = item.facilitator;
      return `${lastName}, ${firstName}`
    }
  };

  return (
   isLoadingSearch ? (
    <LoadingPane 
      defaultWidth="80%" 
      paneTitle={<FormattedMessage id="results-pane.loading-pane-results" />} 
    />
   ) : (
     <Pane
      defaultWidth='80%'
      paneTitle={<FormattedMessage id="meetups.results-pane.paneTitle" />}
      {...props}
      renderHeader={(...renderProps) => (
        <PaneHeader 
          {...renderProps}
          paneTitle={<FormattedMessage id="meetups.results-pane.paneTitle" />}
          actionMenu={getActionMenu} // pass actionMenu instead if implementing hasPerm()
        />
      )}>
      <div style={{ height: '80vh', width: 'auto' }}>
        {/* 
          If refactoring the MCL, be sure to reference to documentation:
          https://github.com/folio-org/stripes-components/tree/master/lib/MultiColumnList
        */}
        <MultiColumnList 
         autosize
         virtualize
         /* 
          *** contentData prop ***
          Not yet working with OKAPI/server responses? Use 'tempData'. 
          Else, use 'meetupsList' (React Context API for get list response)
         */ 
         contentData={tempData} 
         totalCount={endOfListTotal}
         formatter={resultsFormatter}
         visibleColumns={[
            'name',
            'location',
            'facilitator'
          ]}
         columnMapping={{
            name: <FormattedMessage id="column-mapping.name" />,
            location: <FormattedMessage id="column-mapping.location" />,
            facilitator: <FormattedMessage id="column-mapping.facilitator" />
          }}
          onRowClick={handleViewDetails}
          emptyMessage={<FormattedMessage id="mcl.is-empty-message" />}

        />
      </div>
    </Pane>
   ) 
  );
};

export default ResultsPane; 