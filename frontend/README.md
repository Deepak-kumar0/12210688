# URL Shortener Web App

This project is a user-friendly URL Shortener application built with React, designed to provide core URL shortening functionality and display analytical insights. The application manages all features client-side, with API interactions for core functionalities.

-----

## Table of Contents

  * [Features](https://www.google.com/search?q=%23features)
  * [Technical Specifications](https://www.google.com/search?q=%23technical-specifications)
  * [Getting Started](https://www.google.com/search?q=%23getting-started)
  * [Usage](https://www.google.com/search?q=%23usage)
  * [Pages](https://www.google.com/search?q=%23pages)
  * [Error Handling](https://www.google.com/search?q=%23error-handling)
  * [Styling](https://www.google.com/search?q=%23styling)
  

-----

## Features

  * **URL Shortening**: Shorten long URLs into concise, manageable links.
  * **Custom Shortcodes**: Users can provide preferred custom shortcodes.
  * **Default Validity**: Shortened URLs default to a 30-minute validity if not specified.
  * **Redirection**: Seamlessly redirects users from shortened URLs to their original destinations.
  * **Client-Side Validation**: Robust validation of user inputs before API calls.
  * **URL Shortener Statistics**: View detailed statistics for each shortened URL, including click data and geographical location.
  * **Concurrency**: Shorten up to 5 URLs concurrently on the main page.

-----

## Technical Specifications

  * **Application Architecture**: Developed as a **React application**.
  * **Running Environment**: The application must run exclusively on `http://localhost:3000`.
  * **Short Link Uniqueness**: All generated short links within the application are unique. The application manages this uniqueness.
  * **Redirection**: Client-side routing and management of URL mappings.

-----

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js and npm (or yarn)
  * The Logging Middleware created in the Pre-Test Setup stage.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd 12210688
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

-----

## Usage

To run the application:

```bash
npm start
# or
yarn start
```

The application will be accessible at `http://localhost:3000`.

-----

## Pages

The application consists of the following pages:

### URL Shortener Page

  * **Functionality**: Allows users to shorten up to 5 URLs concurrently. For each URL, users can provide:
      * The original long URL.
      * An optional validity period (in minutes).
      * An optional preferred shortcode.
  * **Client-Side Validation**: Inputs are validated based on constraints (e.g., valid URL format, validity as an integer) prior to API calls.
  * **Display Results**: Upon successful creation, shortened links and their respective expiry dates are clearly displayed, associated with each original URL.


-----

## Error Handling

  * **Robust client-side error handling** is implemented.
  * **User-friendly messages** are displayed for invalid inputs (e.g., malformed URL, shortcode collision) and other operational issues.

