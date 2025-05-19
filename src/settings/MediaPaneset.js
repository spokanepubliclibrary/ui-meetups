import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Col,
  MessageBanner,
  Pane,
  PaneHeader,
  Paneset,
  Row,
  Spinner
} from '@folio/stripes/components';
import PutMediaOption from './connectedComponents/PutMediaOption.js';
import GetMediaOption from './connectedComponents/GetMediaOption.js';
import { useMeetups } from '../contexts/MeetupsContext.js';


const MediaPaneset = () => {
  const { configMediaOption } = useMeetups();
  const [showBanner, setShowBanner] = useState({
    show: false,
    type: 'success', // default else warn in console due to empty str
    message: ''
  });
  const [sendPut, setSendPut] = useState(false);
  const [putData, setPutData] = useState({});
  const [formData, setFormData] = useState({
    allowMedia: false,
  });

  useEffect(() => {
    setFormData(() => ({ allowMedia: !!configMediaOption }));
  }, [configMediaOption]);

  const handleChange = (event) => {
    let { checked } = event.target;    
    setFormData(() => ({
      allowMedia: checked 
    }));
  };

  const handleSubmit = () => {
    const formattedReadyData = {
      value: JSON.stringify({ mediaOption: formData.allowMedia})
    };

    console.log("formattedReadyData: ", JSON.stringify(formattedReadyData, null, 2));

    /* 
      *** TODO ***
      When wiring up real req/res cycle,
      uncomment the below setter for PUT data and the 
      flag condition for using the related connected component
    */
    // setPutData(formattedReadyData);
    // setSendPut(true);
  };

  return (
    <Paneset>
      <Pane
        paneTitle={<FormattedMessage id="settings.allowMedia.paneTitle" />}
        defaultWidth="fill"
        renderHeader={(renderProps) => <PaneHeader {...renderProps} />}
      >
        {sendPut && 
          <PutMediaOption 
            data={putData}
            setShowBanner={setShowBanner}
            />}
        <GetMediaOption />

        <Row style={{ marginTop: '25px'}}>
          <Col xs={6}>
           {configMediaOption === null ? (
            <Spinner />
           ) : (
            <Checkbox 
              name='allowMedia'
              checked={formData.allowMedia}
              label='Allow media upload'
              onChange={handleChange}
            />
           )}
          </Col>
        </Row>

         <Row style={{ marginTop: '50px'}}>
          <Col xs={6}>
           <Button
            buttonStyle='primary'
            onClick={handleSubmit}
           >
            Save
           </Button>
          </Col>
        </Row>

       <Row>
        <Col xs={8}>
          <MessageBanner 
            dismissible
            type={showBanner.type}
            show={showBanner.show}
            >
            {showBanner.message}
          </MessageBanner>
        </Col>
       </Row>
      </Pane>
    </Paneset>
  );
};

export default MediaPaneset;