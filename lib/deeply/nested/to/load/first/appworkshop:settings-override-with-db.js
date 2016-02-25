
var COLLECTION_NAME = 'Meteor_Settings_Override'; // also used as publication and subscription name
// Return a grounded Meteor.Collection, so (public) settings are available offline.
Settings = new Ground.Collection(COLLECTION_NAME);

if (Meteor.isServer) {
  Meteor.startup(function() {
    console.log("Meteor.settings:"); console.log(Meteor.settings);
    // Do we have any settings in our DB?
    // If not, seed the DB with Meteor.settings
    var settingsObj = Settings.findOne();
    if (!settingsObj) {
      // seed our DB with Meteor.settings
      Settings.insert(Meteor.settings,
        // called with an error object as the first argument and, if no error, the _id as the second.
        function(error, _id) {
          if (error) {
            console.error("couldn't insert Meteor.settings into DB");
          } else {
            console.log("Added Meteor.settings into DB");
          }
        }
      )
    }

    var truefunc = function() { return true;}
    // disallow modifications by the client.
    Settings.deny({insert: truefunc, update: truefunc, remove: truefunc});
  });

  // publish public settings to client, nothing else.
  Meteor.publish(COLLECTION_NAME,function(){
    return  Settings.find({},{fields: {public: 1}});
  });
}

if (Meteor.isClient) {
  // subscribe
  Meteor.subscribe(COLLECTION_NAME);
}

/**
 * gets a dot-delimited property from an object
 * @param {object} obj - the object from which to get the value
 * @param {string} propString - a property string that describes the path to
 * the object's property value that we are interested in, separated by dots
 * @param {boolean} isRelativePropertyPath - true if the propString should be
 * treated as relative
 * @param {string} propertyPathContext - the current context from which
 * relative property paths should be calculated
 * @returns the value of the property, if it is found.
 */
function getPropByString(obj, propString) {
  var i, iLen;
  if (!propString)
    return obj;

  // get the target property from obj, based on the path provided by propString.
  var prop, props = propString.split('.');

  for (iLen = props.length - 1, i = 0; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

/**
 * Try to get the specified key from DB (if possible), otherwise attempt to get it from Meteor.settings
 * @param {string} key - e.g. "public.appName" (equivalent to Meteor.settings.public.appName)
 * @returns {*} the meteor setting, from DB if possible, otherwise from Meteor.settings. Undefined if not found.
 */
GetMeteorSettingsValue = function(key) {
  var settingsObj = Settings.findOne();
  // first look in our DB settings, then in Meteor.settings, then ...
  if (settingsObj) { // No DB settings found (somehow?) at all. use Meteor.settings
   // we did find a settings object. But does it have this key?
    var prop = getPropByString(settingsObj, key);

    if (prop) {
      // hooray!
      return prop;
    }
  }
  // fallback to trying to get the property from Meteor.settings
  var prop = getPropByString(Meteor.settings, key);
  if (prop) {
    return prop;
  }
};

Meteor_Settings_Override = Settings;