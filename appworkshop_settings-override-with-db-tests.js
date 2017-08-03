// NOTE: run tests with:
//  meteor test-packages appworkshop:settings-override-with-db --settings ./packages/appworkshop_settings-override-with-db/test-settings.json

// meteor method just for test use, to get server (private) settings
Meteor.methods({
  'getServerSettingVal': function (key) {
    console.log("getServerSettingVal(" + key + "):" + GetMeteorSettingsValue(key));
    return GetMeteorSettingsValue(key);
  }
});

var testValuesObj = {
  "other": "someotherprivateval",
  "public": {
    "somepublickey": "someoverriddenpublicval"
  }
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Do we have any settings in our DB? If so, attempt to update Meteor.settings from json.
    // If not, seed the DB with Meteor.settings
    var settingsObj = Meteor_Settings_Override.findOne();
    if (!settingsObj) {
      // seed our DB with Meteor.settings
      Meteor_Settings_Override.insert(testValusObj,
        // called with an error object as the first argument and, if no error, the _id as the second.
        function (error, _id) {
          if (error) {
            console.error("couldn't insert Meteor.settings into DB");
          } else {
            console.log("Added Meteor.settings into DB");
          }
        }
      )
    } else {
      Meteor_Settings_Override.update(settingsObj._id, {$set: testValuesObj},
        // called with an error object as the first argument and, if no error, the _id as the second.
        function (error, _id) {
          if (error) {
            console.error("couldn't update Meteor.settings in DB");
          } else {
            console.log("Updated Meteor.settings into DB");
          }
        }
      )
    }
  });
}

if (Meteor.isClient) {
  Tinytest.add("getPublicOverride", function (test) {


    //console.log('GetMeteorSettingsValue("public.somepublickey")');
    //console.log(GetMeteorSettingsValue("public.somepublickey"));
    //console.log('GetMeteorSettingsValue("other")');
    //console.log(GetMeteorSettingsValue("other"));
    //console.log('GetMeteorSettingsValue("private.someprivatekey")');
    //console.log(GetMeteorSettingsValue("private.someprivatekey"));

    test.equal(GetMeteorSettingsValue("public.somepublickey"), "someoverriddenpublicval");
  });

  Tinytest.add("getPrivateOverrideClient", function (test) {

    test.isUndefined(GetMeteorSettingsValue("private.someprivatekey"), "private keys should not be available to client:" + GetMeteorSettingsValue("private.someprivatekey"));
    test.isUndefined(GetMeteorSettingsValue("other"), "private keys should not be available to client:" + GetMeteorSettingsValue("other"));
  });
}

Tinytest.addAsync("getPrivateOverrideServer", function (test, next) {
  // private.someprivatekey is specified in settings.json, not in the DB
  Meteor.call('getServerSettingVal', 'private.someprivatekey', function (error, val) {
    test.equal(val, 'someprivateval');
    // other is a private key specified the DB, not in settings.json
    Meteor.call('getServerSettingVal', 'other', function (error, val) {
      test.equal(val, 'someotherprivateval');
      next();
    });
  });


});
