#! /usr/bin/env node
const axios = require('axios')

console.log(`
Addresscloud - consume your location data
To find documentation go to https://github.com/j4jefferson/addresscloud
`)

class Addresscloud {

  /**
   * Class constructor
   * Initialise the module with the required auth details provided by Addresscloud
   * @param {*} api_key 
   * @param {*} client_id 
   */
  constructor(api_key='', client_id=''){
    if (!/.+.+/.test(api_key)) {
          throw new Error('missing or invalid api key: ' + api_key)
        }
      
        if (!/.+.+/.test(client_id)) {
          throw new Error('missing or invalid client id: ' + client_id)
        }
      
        this.__api_key = api_key
        this.__client_id = client_id
        this.__base_url = "https://api.addresscloud.com/match/v1"
        this.__fetchConfig = {
          baseURL: this.__base_url,
          headers: {
            'x-api-key': this.__api_key,
            'x-client-id': this.__client_id,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      
  }

  /**
   * Define the request base url
   */
  setBaseURL(url) {
    this.__base_url = url
  }

  /**
   * Match API Request
   */
  async match(options) {
    const {endpoint, search} = options
    this.setBaseURL("https://api.addresscloud.com/match/v1")

    // check the request being made is allowed by the API
    if(!endpoint || !search) {
      throw new Error('Please specify your required operations as per the docs')
    }
    
    //validate endpoints
    const endpoint_fragments = endpoint.split('/')
    if(endpoint_fragments[1] === 'lookup' && endpoint_fragments[2] === undefined) {
      throw new Error('Lookups must define ID or UPRN search type in the endpoint URL')
    }
    
    // set up the search query
    let fetchSearchString = endpoint_fragments[1] === 'lookup' 
      ? `${this.__base_url}/${endpoint}/${search}`
      : `${this.__base_url}/${endpoint}?query=${search}`

    // execute the request
    try {
      const fetchData = await axios.get(fetchSearchString, this.__fetchConfig)
      return fetchData
    } catch (error) {
      throw new Error('Oh no! Addresscloud error: ' + error + + this.getErrorMessage(error.response.status))
    }

  }

  /**
   * Intel API Request
   */
  async intel (options) {
    //set up the query endpoints
    const {target, lookup, search} = options
    this.setBaseURL("https://api.addresscloud.com/intel/v1")

    let fetchSearchString = `${this.__base_url}/${target}/intel/${lookup}/${search}`

    //execute the query
    try {
      const fetchData = await axios.get(fetchSearchString, this.__fetchConfig)
      return fetchData
    } catch (error) {
      throw new Error('Oh no! Addresscloud error: ' + error + this.getErrorMessage(error.response.status))
    }
  }

  /**
   * Provide developer with additional error descriptions as defined by Addresscloud API docs
   */
  getErrorMessage (status ) {
    let msg 
    switch (status) {
      case 400:
        msg = 'Bad Request -- Normally caused by an incorrect query parameter e.g. child "country" fails because "country" must be one of [gb, im, je, gg, ie]'
        break
      case 403:
        msg = 'Forbidden -- The API key is incorrect for the endpoint being called'
        break
      case 404:
        msg = 'Not Found -- The resource was not found, this may indicate an incorrect endpoint or trying to retrieve a record for example, an address, which does not exist'
        break
      case 429:
        msg = 'Too Many Requests -- You have exceeded your per second or per day quota of requests'
        break
      case 500:
        msg = 'Internal Server Error -- A catch-all error indicating that something has failed server side'
        break
      case 503:
        msg = 'Service Unavailable -- The service is down and cannot respond to requests'
        break
  
      default: 
       msg = 'No extra info is available for this error'
    }
    return ' \n***** Additional info: ' + msg + ' *****\n'
  }
}

module.exports = exports = Addresscloud;