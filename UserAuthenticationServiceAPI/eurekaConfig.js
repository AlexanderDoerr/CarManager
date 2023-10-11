const Eureka = require('eureka-js-client').Eureka;
const ip = require('ip');
const uuid = require('uuid'); // Add this line to import the 'uuid' package

const uniqueId = uuid.v4(); // Generate a unique UUID

const instanceId = `UserAuthenticationServiceAPI:${uniqueId}:${process.env.PORT || 3000}`; // Update the instanceId variable to include the unique UUID

const ipAddress = ip.address();

const eurekaClient = new Eureka({
  instance: {
    app: 'UserAuthenticationServiceAPI',
    instanceId: instanceId,
    hostName: 'UserAuthenticationServiceAPI',
    ipAddr: ipAddress,
    statusPageUrl: `http://${ipAddress}:${process.env.PORT || 3000}`,
    port: {
      '$': process.env.PORT || 3000,
      '@enabled': 'true',
    },
    vipAddress: 'UserAuthenticationServiceAPI',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    // host: 'localhost',
    host: 'EurekaServer', // Update the host to use the Docker container name
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

module.exports = eurekaClient;

