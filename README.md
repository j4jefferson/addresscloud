# Addresscloud

The addresscloud module simplifies the inclusion of the API services offered by [Addresscloud](https://addresscloud.com). You must have a commercial agreement with Addresscloud in order to use their location, postcode lookup and buildings data services. Once you have this you will have the client keys you need to provide in the setup to this module. Otherwise the module makes it easy to set up and consume any endpoint you wish. Addresscloud API documentation is very good and comprehensive and the team do a great job. So browse the [docs](https://docs.addresscloud.com) and follow the instructions below to make your query results available in your application.

## Download the module

In your project directory run the following command line instruction:
`npm install addresscloud`

## Setup

To configure the module simply require the module in your script and pass it a configuration object (options below).

For example, include (require) the module in your index.js like so:

```
const Addresscloud = require('@j4jefferson/addresscloud')
/**
 * Initiate a new addresscloud obj with your api key and client details
 */

const myAddresscloud = new Addresscloud('<your-api-string>', '<your-client-id>')
```

## Search properties at postcode

Address cloud match API allows a geocode search to be performed. Of particular use is to search for all properties at a given postcode or to get a single property by providing the name/number of the property with the postcode. The search in both cases provides a unique id for all properties that can then be used to do a further lookup on the property.

Example
The code below will return a list of properties

```
const postcodeLookup = myAddresscloud.match({
	endpoint: 'address/geocode',
	search: 'EX12PP',
}).then(response => {
	if (!response.status === 200) {
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		console.log(response.data)
		return response;
	}
}).catch (err => {
	console.log(err)
})
```

Whereas the following code will return a match of a single property

```
const postcodeLookup = myAddresscloud.match({
	endpoint: 'address/geocode',
	search: '66 EX12PP',
}).then(response => {
	if (!response.status === 200) {
		throw new Error(`HTTP error! status: ${response.status}`);
	} else {
		console.log(response.data)
		return response;
	}
}).catch (err => {
	console.log(err)
})
```

## Lookup by id

Once a postcode search has returned results, you can then use the unique id to search details on a single property. The example below shows how to retrieve the details of a given address by id. The results include a uprn (unique property reference number) which can then be used to query the intel API.

```
/**
 * Get details about a given address
 */
const addressLookup = myAddresscloud.match({
	endpoint: 'address/lookup/byId',
	search: '8e195822c5a8217:j3TUC5',
})

//retrieve the address lookup promise
const addressResult = addressLookup.then(response => {
  if (!response.status === 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    return response;
  }
})
```

## Query the intel API

Using a uprn code use the following code to get intel data for a given property. Of course you may also lookup the intel data by id or point data (as per the documentation)

```
/**
 * Get details about a given address
 */
const addressLookup = myAddresscloud.match({
	endpoint: 'address/lookup/byId',
	search: '8e195822c5a8217:j3TUC5',
})

//retrieve the address lookup promise
const addressResult = addressLookup.then(response => {
  if (!response.status === 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    return response;
  }
})

// Store data to do an additional search
// UPRN is a unique identifier for a property and can be
// used to do a more in depth detail search with the intel API
const propertyIdentifier = (obj, entry) => {
	console.log(`The property identifier is ${obj[entry]}`)
	return obj[entry]
}

// Store only the unique ref, but you can store the whole shebang if you need to
const addressID = addressResult.then(res => {
	const addressObj = res.data.result
	return propertyIdentifier(addressObj.properties, 'uprn')
}).catch(err => {
	console.log('I got an error: '+err)
})
```

## Retrieve intel data

The example below takes the uprn code stored previously and looks up all available intel data from the intel API using the byUPRN endpoint

```
const intel = addressDetails.then(res => {
	return myAddresscloud.intel({
		target: 'address',
		lookup: 'byUPRN',
		search: res
	})
}).catch(err => {
	console.log(err)
})

//print out the response to the console to see what we got
const intelRes = intel.then(response => {
	console.log(JSON.stringify(response.data, null, 4))
}).catch(err => {
	console.log(err)
})
```

For more information on the API visit the [Addresscloud docs](https://docs.addresscloud.com/)
