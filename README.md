
# X-UI-API

This project allows you to automatically connect your application in to x-ui panel via Http protocol.




## X-UI-ENGLISH

Link to the original project: 
https://github.com/NidukaAkalanka/x-ui-english
## Installation

```
git pull https://github.com/atapg/x-ui-api
```

```
npm install && npm run start
```
## Documentation
Setup your enviroments variables with the example.
You can add your x-ui panel host addresses and passwords into the sqlite database and then use APIs'.

List of api endpoints:

```
• GET /list - Get list of all inbounds 

Required Queries: 
hostName: http://example.com
```

```
• POST /inbound - Create new inbound

Required Body:
totalGB: 40 - Number
expiryTime: 1400 - in minutes - Number
remark: test - String
owner: ID - String
plan: Plan ID - String

Optional Body:
hostName: http://example.com
```

```
• DELETE /inbound - Delete inbound from panel

Required Body: 
inboundId: inbound ID
url: url of inbound - in format of Base64 encoded
```

```
• POST /inbound/traffic - Get traffic data of an inbound

Required Body: 
url: url of inbound - in format of Base64 encoded
protocol: vmess/vless
```