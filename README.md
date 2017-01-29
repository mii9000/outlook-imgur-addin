# OutlookImgur #

Access your imgur directly from Outlook Mail.

## Running the addin ##

1. `git clone` the project
2. Run `npm install`
3. Run `gulp` to build the app
4. Once building complete, run `gulp server` to deploy the app in a separate console
5. Logon to [Outlook Web Access](https://outlook.com). Click on the gear cog in the upper right corner of the page and click on `Manage apps`.
6. On the `Manage apps` page, click on the '+' icon, select `Add from file`. Browse to the `dist/manifest.xml` file included in the project.
7. Return to the Mail view in Outlook Web Access.
8. To use the add-in, create a new message/email.
9. You should see an icon of the addin at the bottom of the mail body box. Click on it to activate the addin.