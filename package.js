Package.describe({
  name: 'appworkshop:settings-override-with-db',
  version: '1.0.6',
  // Brief, one-line summary of the package.
  summary: 'Allow override of Meteor.settings with DB.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/AppWorkshop/meteor-settings-override-with-db.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');
  api.use('ecmascript');
  api.use('ground:db@2.0.0-rc.5');
  var path = Npm.require('path');
  api.addFiles(path.join('lib','appworkshop_settings-override-with-db.js'), ['client','server']);
  api.export('GetMeteorSettingsValue');
  api.export('Meteor_Settings_Override');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('appworkshop:settings-override-with-db');
  api.addFiles('appworkshop_settings-override-with-db-tests.js');
});
