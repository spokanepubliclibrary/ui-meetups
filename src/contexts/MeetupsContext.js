import React, { createContext, useState, useContext, useEffect } from 'react';
// export for class components:
export const MeetupContext = createContext(); 
// export for function components:
export const useMeetups = () => useContext(MeetupContext); 

export const MeetupProvider = ({ children }) => {

  // data
  const [meetupsList, setMeetupsList] = useState([]);
  const [singleMeetup, setSingleMeetup] = useState([]);
  const [attachmentsData, setAttachmentsData] = useState([]); 
  const [idForMediaCreate, setIdForMediaCreate] = useState(null);
  const [formDataArrayForMediaCreate, setFormDataArrayForMediaCreate] = useState(null);
  const [configMediaOption, setConfigMediaOption] = useState(null);
  const [facilitatorList, setFacilitatorList] = useState({});
  const [self, setSelf] = useState({})
  
  // toggle
  const [isDetailsPaneOpen, setIsDetailsPaneOpen] = useState(false);
  const [isEditPaneOpen, setIsEditPaneOpen] = useState(false);
  const [isCreatePaneOpen, setIsCreatePaneOpen] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCreatingMeetup, setIsCreatingMeetup] = useState(false);
  const [isUpdatingMeetup, setIsUpdatingMeetup] = useState(false);
  const [isModalFacilitator, setIsModalFacilitator] = useState();
  const [isModalAddMedia, setIsModalAddMedia] = useState(false);
  const [isImageArrayLoading, setIsImageArrayLoading] = useState(false);
  const [isModalViewImage, setIsModalViewImage] = useState(false);

  // query
  const [useGetList, setUseGetList] = useState(false);//boolean to run <GetListByDynamicQuery/>
  const [queryString, setQueryString] = useState("");// value passed to <GetListByDynamicQuery/>
  const [totalResults, setTotalResults] = useState(0);//value of response total records

  // nav
  // const [mode, setMode] = useState('');
  const [limit, setLimit] = useState(20);//limit value for query params, pagination
  const [offset, setOffset] = useState(0);//offset value for query params, pagination

  return (
    <MeetupContext.Provider value={{

      // data
      meetupsList, setMeetupsList,
      singleMeetup, setSingleMeetup,
      attachmentsData, setAttachmentsData,
      idForMediaCreate, setIdForMediaCreate,
      formDataArrayForMediaCreate, setFormDataArrayForMediaCreate,
      configMediaOption, setConfigMediaOption,
      facilitatorList, setFacilitatorList,
      self, setSelf,
      
      // toggle
      isDetailsPaneOpen,
      setIsDetailsPaneOpen,

      isEditPaneOpen,
      setIsEditPaneOpen,

      isCreatePaneOpen,
      setIsCreatePaneOpen, 

      isLoadingSearch, 
      setIsLoadingSearch,

      isLoadingDetails,
      setIsLoadingDetails,

      isUpdatingMeetup, 
      setIsUpdatingMeetup,

      isCreatingMeetup, 
      setIsCreatingMeetup,

      isModalFacilitator, 
      setIsModalFacilitator,

      isModalAddMedia, 
      setIsModalAddMedia,

      isImageArrayLoading,
      setIsImageArrayLoading, 

      isModalViewImage, 
      setIsModalViewImage,

      // nav
      limit, setLimit, 
      offset, setOffset, 

      // query
      useGetList, setUseGetList,
      queryString, setQueryString,
      totalResults, setTotalResults

    }}>
      {children}
    </MeetupContext.Provider>
  );
};