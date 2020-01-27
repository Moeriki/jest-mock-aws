'use strict';

/* eslint-env jest */

const services = {};

function createService(serviceName) {
  const proto = new Proxy(
    {},
    {
      get: (target, property) => {
        return getServiceMethod(serviceName, property);
      },
    },
  );
  const construct = jest.fn().mockImplementation(() => Object.create(proto));
  const service = { construct, methods: {}, proto };
  services[serviceName] = service;
  return service;
}

function createServiceMethod(serviceName, methodName) {
  const service = getService(serviceName);
  service.methods[methodName] = {
    promise: jest.fn(),
  };
  return service.methods[methodName];
}

function getServiceMethod(serviceName, methodName) {
  const service = getService(serviceName);
  return methodName in service.methods
    ? service.methods[methodName]
    : createServiceMethod(serviceName, methodName);
}

function getService(serviceName) {
  return serviceName in services
    ? services[serviceName]
    : createService(serviceName);
}

module.exports = new Proxy(
  {},
  {
    get: (target, property) => {
      const service = getService(property);
      return service.construct;
    },
  },
);
