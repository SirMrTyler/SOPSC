# Google Calendar Setup

The backend uses a Google service account to manage events on a Google Workspace calendar. Configure the service account and Workspace permissions before deploying:

1. **Enable domain-wide delegation**
   - Enabling domain-wide delegation will allow the user to authorize the auto-generation of video chat navigation addresses in the Calendar via the google hangouts API. To do so, we will need the Client ID of the google service account in our app. We will then use that Client ID by feeding it into our google workspace which will allow certain google API features to be enabled. Without this you will have to manually add web links.
   1. Linking the Google Service Accounts Client ID:
      - Go to Google Cloud Console `https://console.cloud.google.com/` and open the service account referenced by `GoogleCalendar:ServiceAccountCredentialsPath`
        in the
        `\SOPSC\Backend\SOPSC.Api\appsettings.json` and
        `\SOPSC\Backend\SOPSC.Api\appsettings.Development.json`
        files (**You must have already downloaded this file and stored it into** `\SOPSC\Keys\`)
        1. Navigating to service account:
           1. Select App -> Select Hamburger menu at top left.
           2. Select IAM & Admin
           3. Select Service Accounts
           4. Create/Select Account
           5. Select Advanced Settings Dropdown
           6. Copy Client ID
           7. Click `View Google Workspace Admin Console`.
        2. Adding the Client ID to Workspace:
           1. Login to `https://admin.google.com` (_To login you must have a workspace account_)
              - **If it's your first time logging in you will have to alter some DNS settings by following it's instructions**
           2. Select `Security` dropdown.
           3. Select `Access and data control` dropdown.
           4. Select `API controls`.
              - **You will be at a screen called API controls.**
           5. Select `MANAGE DOMAIN WIDE DELEGATION` under the Domain wide delegation container/box.
           6. Select `Add new`.
           7. Paste Client ID from step 1.6 in `Client ID` line.
              - **ignore Overwrite box**
           8. Copy `https://www.googleapis.com/auth/calendar, https://www.googleapis.com/auth/calendar.events` into the `OAuth scopes` line.
2. **Set the impersonated user**
   - Ensure `GoogleCalendar:ImpersonatedUser` in `appsettings.json` is a Workspace user with access to the target calendar.
     - **This is the account email address you used for Google Workspace creation**
3. **Restart the API**
   - Redeploy or restart the backend after updating these permissions.

These steps allow the API to impersonate the Workspace user and create calendar events on their behalf.
