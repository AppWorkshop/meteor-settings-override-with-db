# Override Meteor Settings with Database

Allow your own Meteor.settings to be "overridden" using values from a database collection.

```
meteor add appworkshop:settings-override-with-db
```

This package does ***NOT*** attempt to clobber ```Meteor.settings```. Instead, it provides a function call, ```GetMeteorSettingsValue(key)```. It will return the value in the database if found, otherwise it will fall back to the value from Meteor.settings (i.e. settings.json).

For example, your settings.json might look like this:

```
{
  "public": {
    "somekey": "somevalue"
  }
}
```

Where you would previously have referenced Meteor.settings:

```
var myVar = Meteor.settings.public.somekey;
```

You would now instead do the following:

```
var myVar = GetMeteorSettingsValue('public.somekey');
```

You do not need to make any other changes. Later, when you discover that you need to change a value, you won't 
have to redeploy your app (you shouldn't even have to 
restart). Just update the value in your mongodb server, 
in the ```Meteor_Settings_Override``` collection.

TODO: 

1. Provide a way of generating a new settings.json file, by combining DB values with the existing settings.json file.



