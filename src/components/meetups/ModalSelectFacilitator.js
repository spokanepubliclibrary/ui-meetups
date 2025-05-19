import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Button,
  LoadingPane,
  Modal,
  MultiColumnList,
  Pane,
  Paneset,
  PaneHeader,
  SearchField,
} from '@folio/stripes/components';
import css from './ModalStyle.css';
import { useMeetups } from '../../contexts/MeetupsContext.js';
import SearchFacilitator from './connectedComponents/SearchFacilitator.js';

const ModalSelectFacilitator = ({ handleAddFacilitator }) => {
  const {
    isModalFacilitator, 
    setIsModalFacilitator,
    isLoadingSearch,
    facilitatorList,
    setFacilitatorList
  } = useMeetups();
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const intl = useIntl();
  const placeholderText = intl.formatMessage({
    id: 'modal-select-facilitator.search-field.placeholder',
  });

  if (!isModalFacilitator) {
    return null;
  };

  let endOfListTotal = 0;
  if (facilitatorList) {
    endOfListTotal = facilitatorList.length; 
  };

  const handleDismiss = () => {
    setIsModalFacilitator(false)
    // can do other things...
  };

  const handleChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = () => {
    setSearch(searchTerm.trim());
  };

  const columnWidths = {
    name: '200px'
  };

  const handleRowClick = (event, item) => {
    handleAddFacilitator(item);
    setIsModalFacilitator(false);
    setFacilitatorList([]);
  };

  const resultsFormatter = {
    active: (item) => {
      return <p>{item.active ? 
      <FormattedMessage id="meetups.active-value-true" /> 
      : <FormattedMessage id="meetups.active-value-false" />}</p>
    },
    name: (item) => {
      return `${item.lastName}, ${item.firstName}`;
    }
  };

  const renderHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="modal-select-facilitator.paneHeader" />}
    />
  );

  return (
    <Modal
      style={{ 
        minHeight: '550px',
        height: '80%', 
        maxHeight: '300vh', 
        maxWidth: '400vw', 
        width: '70%' 
      }}
      open
      dismissible
      closeOnBackgroundClick
      label={<FormattedMessage id="modal-select-facilitator.paneTitle" />}
      onClose={handleDismiss}
      contentClass={css.modalContent}
    >
      <div className={css.modalBody}>
        {search && <SearchFacilitator term={search}/>}

        <Paneset>
          <Pane
            defaultWidth='30%'
          >
          <SearchField
            placeholder={placeholderText}
            value=""
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleSearchSubmit}
            >
            <FormattedMessage id="meetups-paneset.search-pane.search-button" />
          </Button>
          </Pane>

      {isLoadingSearch ? (
          <LoadingPane
            defaultWidth="70%"
            paneTitle={
              <FormattedMessage id="modal-select-facilitator.loading-pane.paneTitle" />
            }
          />
        ) : (
          <Pane
            paneTitle={
              <FormattedMessage id="modal-select-facilitator.results-pane.paneTitle" />
            }
            defaultWidth="70%"
            style={{ overflowY: 'auto', flexGrow: 1  }}
            renderHeader={renderHeader}
          >
            <div className={css.mclContainer}>
              <MultiColumnList
                autosize
                virtualize
                onRowClick={handleRowClick}
                columnWidths={columnWidths}
                totalCount={endOfListTotal}
                contentData={facilitatorList}
                visibleColumns={['name', 'active', 'barcode']}
                columnMapping={{
                  name: <FormattedMessage id="column-mapping.name" />,
                  active: <FormattedMessage id="column-mapping.active" />,
                  barcode: <FormattedMessage id="column-mapping.barcode" />
                }}
                formatter={resultsFormatter}
              />
            </div>
          </Pane>
        )}
        </Paneset>
      </div>
    </Modal>
  );
};

export default ModalSelectFacilitator;