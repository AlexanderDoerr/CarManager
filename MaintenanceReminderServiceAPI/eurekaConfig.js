const Eureka = require('eureka-js-client').Eureka;
const ip = require('ip');
const uuid = require('uuid'); // Add this line to import the 'uuid' package

const uniqueId = uuid.v4(); // Generate a unique UUID

const instanceId = `MaintenanceReminderServiceAPI:${uniqueId}:${process.env.PORT}`; // Update the instanceId variable to include the unique UUID

const ipAddress = ip.address();

const eurekaClient = new Eureka({
  instance: {
    app: 'MaintenanceReminderServiceAPI',
    instanceId: instanceId,
    hostName: 'MaintenanceReminderServiceAPI',
    ipAddr: ipAddress,
    statusPageUrl: `http://${ipAddress}:${process.env.PORT}`,
    port: {
      '$': process.env.PORT,
      '@enabled': 'true',
    },
    vipAddress: 'MaintenanceReminderServiceAPI',
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

