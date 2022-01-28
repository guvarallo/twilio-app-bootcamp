const http = require('http')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

const familyURL = 'https://excuser.herokuapp.com/v1/excuse/family/'
const officeURL = 'https://excuser.herokuapp.com/v1/excuse/office/'
const childrenURL = 'https://excuser.herokuapp.com/v1/excuse/children/'
const collegeURL = 'https://excuser.herokuapp.com/v1/excuse/college/'
const partyURL = 'https://excuser.herokuapp.com/v1/excuse/party/'

const handleAxios = async url => {
  return await axios
    .get(url)
    .then(res => res.data[0].excuse)
    .catch(console.error)
}

app.post('/excuses', async (req, res) => {
  const twiml = new MessagingResponse()
  const options = ['1', '2', '3', '4', '5']
  const reqBody = req.body.Body.trim()

  try {
    if (reqBody === 'EXCUSE ME') {
      twiml.message(
        `Welcome to Excuser, we're here to help. Please write a number for a fast excuse: 
        1 for family excuses
        2 for office excuses
        3 for children excuses
        4 for college excuses
        5 for party excuses`
      )
    }
    if (reqBody === '1') {
      const messages = await handleAxios(familyURL)
      twiml.message(messages)
    } else if (reqBody === '2') {
      const messages = await handleAxios(officeURL)
      twiml.message(messages)
    } else if (reqBody === '3') {
      const messages = await handleAxios(childrenURL)
      twiml.message(messages)
    } else if (reqBody === '4') {
      const messages = await handleAxios(collegeURL)
      twiml.message(messages)
    } else if (reqBody === '5') {
      const messages = await handleAxios(partyURL)
      twiml.message(messages)
    } else if (reqBody !== 'EXCUSE ME' && !options.includes(reqBody)) {
      twiml.message(
        'Are you trying to get help for an excuse? If so, type EXCUSE ME'
      )
    }
  } catch (error) {
    console.log(error)
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000')
})
