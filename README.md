# ui-meetups
Copyright (C) 2023 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.


## Introduction
Welcome to **ui-meetups**, an example Stripes UI module that showcases the potential of a FOLIO full-stack application. This sample is not intended to replace any FOLIO documentation or the FOLIO Stripes Hello World UI module. In fact, **mod-meetups** and **ui-meetups** work together to provide a full-stack boilerplate for jumpstarting your own FOLIO application. Many of the ui-meetups files have comments on certain FOLIO Stripes processes, possible gotchas, logging for inspection (commented out), and links to relevant documentation. However --> it is advised to continue to reference FOLIO documentation as you browse or refactor this sample.

This sample is not intended for production use. Instead, it demonstrates various FOLIO features and practices in module development. Key features include:

- **Connected Components:** 
Integrate UI components with FOLIO's backend services using OKAPI.

- **Stripes Library Components:** 
Leverage pre-built UI elements from the Stripes framework to build consistent, reusable interfaces.

- **OKAPI Requests:** 
Explore approaches to OKAPI requests, including methods for POSTing media.

- **Flexible Paneset Layout:** 
Experience a FOLIO Stripes paneset pattern for an intuitive user interface. 

- **Application Settings Configurations:** 
Demonstrates a simple example using a monolithic-saving pattern for managing application settings. This approach helps make the application more library-agnostic and flexible for setup and use.

- **Interoperability between React Class and Function Components:** Demonstrates a pattern that leverages the robust lifecycle methods and integration provided by class components (ideal for connected components using Stripes Connect) alongside the hooks-based approach of function components for UI elements.


## Humble suggestions on where to start in this application 
- **Comfortable with React and want to fiddle with some UI components?**
Access the MultiColumnList (a crucial FOLIO Stripes component) and refactor it to render additional columns from the example data list, such as 'description' and 'active'. The MCL can be found at the ResultsPane (./src/components/meetups/ResultsPane.js). Be sure to reference the MCL documentation and make use of the resultsFormatter. 

- **Comfortable with React and ready to work with OKAPI?**
Gain an understanding of the OKAPI basics and connected components (stripesConnect). A basic example can be found in GetDetails.js (./src/components/meetups/GetDetails.js) and reference the Stripes Connect documentation. 

- **New to React?**
Be sure to get a comfortable understanding of React as FOLIO Stripes component library is a library of React components and utility functions. 
[FOLIO Stripes components](https://github.com/folio-org/stripes-components)
[Jump in to React](https://react.dev/learn)

- **Lots of experience onboarding into new platforms and ecosystems?**
While this guide may serve as a handy reference, you're fully prepared to take on your first FOLIO project. Go ahead and set up the Stripes CLI, then run stripes create project-name to quickly scaffold a project. 
[Stripes CLI User Guide](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#app-development)
[Creating your app](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#creating-your-app)


## Additional info

- **Your app icon**
Head to the top level 'icons' folder and replace the png and svg with your new application's icons of your choice. These new files will need to be named as they are currently (app.png, app.svg). 

- **Permissions** 
  FOLIO's permission system is built on a role-based access control model that separates server-side and UI-level permissions, although these are often coordinated. The permission system handles many aspects and there are many important knowledge points, but the key idea is to define what actions are allowed, such as viewing, editing, or deleting records. Required reading here: [Permissions in Stripes and FOLIO](https://github.com/folio-org/stripes-core/blob/master/doc/permissions.md#permissions-in-stripes-and-folio)

  **Conditional rendering based on permissions in the UI**
  Leveraging useStripes() from stripes-core, you can access the hasPerm() method for ensuring clean, conditional rendering based on access control. In our example, we do not render the 'Action - Create' button at ResultsPane.js for the current logged in user if they do not have the 'ui-meetups.edit' permission, as that permission encapsulates create and edit permissions. Additionally, we have this sample set up in the DetailsPane.js for conditionally rendering the 'Edit' button for those same reasons. (./src/components/meetups/ResultsPane.js) (./src/components/meetups/DetailsPane.js)

  [src Stripes.js hasPerm](https://github.com/folio-org/stripes-core/blob/c7d0b58ffd93e093db302facd1b2df7d5f2e370c/src/Stripes.js#L101)

  [Another example at ui-users](https://github.com/folio-org/ui-users/blob/34ccba54bcd5f32dc0a543502543fea242ab0e39/src/views/UserEdit/UserForm.js#L278)


- **Refactoring from consuming and rendering local file temp data to wiring up real req/res cycles**
  Use your code editor's search feature with key word 'TODO'. Many of these listed will be related to moving from use of local temp data to using 
  request/response cycle functionality. Certain data setters (component state and global React Context), loading flags, connected components are not in use while initially using the app with its local temp data. **Nice place to start** When wiring to using request/response cycle, it may be best to start with the straightforward MediaPaneset and its related connected components, GetMediaOption and PutMediaOption.

- **CI/CD pipeline template** 
File: 
.gitlab-ci.example.yml

This example defines a pipeline that:
  1. Generates the module descriptor (module-descriptor.json)
  2. Builds the application package (a tarball)

Usage: 
To enable CI/CD, copy or rename the file (remove the '.example' suffix) 
and update the placeholder values. Note that the pipeline as it is currently, is configured to run only on the main branch. 

- **Stripes configuration template**
File: 
stripes.config.example.js

This example provides a generic configuration for you application with 
placeholders for:
 1. OKAPI url (your-url)
 2. Tenant (your-tenant)

Usage: 
Rename the file to 'stripes.config.js' and update the values as needed. 


## Prerequisites
- **Set up your Stripes CLI**
[Stripes CLI User Guide](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#stripes-cli-user-guide)


## Important resources
[FOLIO Stripes hello world](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#app-development)

[FOLIO Stripes component library](https://github.com/folio-org/stripes-components/tree/master/lib)

[Stripes component library Storybook](https://dev.folio.org/stripes-components/?path=/story/guides-about-stripes-components--page)

[FOLIO API References - recommended!](https://dev.folio.org/reference/api/)

[Stripes-util](https://github.com/folio-org/stripes-util)


## Run your new app

Run the following from the ui-meetups directory to serve your new app using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than `http://localhost:9130` pass the `--okapi` and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```


## What to do next?

Read the [Stripes Module Developer's Guide](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md).

When your new UI app is ready and being built by CI, then adjust its Jenkinsfile to remove the `npmDeploy = 'no'` parameter (which is then superfluous).