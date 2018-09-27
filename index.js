'use strict';

const serviceInstances = Symbol('instances');

/**
 * @param {object} AWS
 * @param {string} name
 * @param {object} [serviceInstance]
 * return {object} instance
 */
exports.mockAwsService = (AWS, serviceName, serviceInstance = {}) => {
  AWS[serviceInstances] = AWS[serviceInstances] || {};
  if (AWS[serviceInstances][serviceName]) {
    return AWS[serviceInstances][serviceName];
  }
  AWS[serviceName] = jest.fn(() => serviceInstance);
  AWS[serviceInstances][serviceName] = serviceInstance;
  return serviceInstance;
};

/**
 * @param {object} AWS
 * @param {string} serviceName
 * @param {string} methodName
 * @param {function} [methodImplementation]
 * return {function} mock method implementation
 */
exports.mockAwsServiceMethod = (
  AWS,
  serviceName,
  methodName,
  implementation
) => {
  const serviceInstance = exports.mockAwsService(AWS, serviceName);
  const inner = jest.fn(implementation);
  const outer = jest.fn((...args) => ({ promise: () => inner(...args) }));
  serviceInstance[methodName] = outer;
  return inner;
};

/**
 * @param {object} AWS
 * @param {string} serviceName
 * @param {Array<string>|object} methodNames
 * @param {function} [implementation]
 * return {function} mock implementation
 */
exports.mockAwsServiceMethods = (AWS, serviceName, methodNames) => {
  if (Array.isArray(methodNames)) {
    return methodNames.map((methodName) =>
      exports.mockAwsServiceMethod(AWS, serviceName, methodName)
    );
  }
  return Object.entries(methodNames).reduce(
    (acc, [methodName, implementation]) =>
      Object.assign(acc, {
        [methodName]: exports.mockAwsServiceMethod(
          AWS,
          serviceName,
          methodName,
          implementation
        ),
      }),
    {}
  );
};
