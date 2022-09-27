# Addresscloud

The addresscloud module simplifies the inclusion of the API services offered by [Addresscloud](https://addresscloud.com). You must have a commercial agreement with Addresscloud in order to use their location, postcode lookup and buildings data services. Once you have this you will have the client keys you need to provide in the setup to this module. Otherwise the module makes it easy to set up and consume any endpoint you wish. Addresscloud API documentation is very good and comprehensive and the team do a great job. So browse the [docs](https://docs.addresscloud.com) and follow the instructions below to make your query results available in your application.

## Download the module

In your project directory run the following command line instruction:
`npm install addresscloud`

## Setup

To configure the module simply require the module in your script and pass it a configuration object (options below).

For example, include (require) the module in your index.js like so:

```
const addresscloud = require('@j4jefferson/addresscloud')
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

If you have an intel package Addresscloud will allow you to retrieve all the intel with a specific property. You may add an optional third parameter to the match options object: 'intel' which is a boolean (default false). Obviously, you must have intel privileges set up with Addresscloud for this to bring any data.

## Lookup by id

Once a postcode search has returned results, you can then use the unique id to search details on a single property. The example below shows how to retrieve the details of a given address by id. The results include a uprn (unique property reference number) which can then be used to query the intel API.

```
/**
 * Get details about a given address
 */
async function getAddress() {
 	const { data } = await myAddresscloud.match({
		endpoint: 'address/lookup/byId',
		search: '8e195822c5a8217:j3TUC5',
	})

	return data
}
```

## Query the intel API

Using a uprn code use the following code to get intel data for a given property. Of course you may also lookup the intel data by id or point data (as per the documentation). Additionally you may use the query string on the match api as described above to automatically get intel data with the address lookup - saving you the extra call (nice work AC!).

```
/**
 * Get details about a given address
 */
async function getAddress() {
	const { data } = await myAddresscloud.match({
		endpoint: 'address/lookup/byId',
		search: '8e195822c5a8217:j3TUC5',
	})
	return data
}

// Store data to do an additional search
// UPRN is a unique identifier for a property and can be
// used to do a more in depth detail search with the intel API

const addressData = getAddress()
const uprn = addressData.properties['uprn']
```

## Retrieve intel data

The example below takes the uprn code stored previously and looks up all available intel data from the intel API using the byUPRN endpoint

```
/**
 * 
 */
async function getIntel(uprn) {
	const { data } = await myAddresscloud.intel({
		target: 'address',
		lookup: 'byUPRN',
		search: uprn
	})
	return data
}

```

For more information on the API visit the [Addresscloud docs](https://docs.addresscloud.com/)
