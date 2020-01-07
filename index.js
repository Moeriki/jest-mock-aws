'use strict';

const serviceInstances = Symbol('instances');

/**
 * @param {object} AWS
 * @param {string} serviceName
 * @param {object} [serviceInstance]
 * @return {object} instance
 */
module.exports.mockAwsService = (AWS, serviceName, serviceInstance = {}) => {
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
 * @return {function} mock method implementation
 */
module.exports.mockAwsServiceMethod = (
  AWS,
  serviceName,
  methodName,
  methodImplementation,
) => {
  const serviceInstance = module.exports.mockAwsService(AWS, serviceName);
  const inner = jest.fn(methodImplementation);
  const outer = jest.fn((...arguments_) => ({
    promise: () => inner(...arguments_),
  }));
  serviceInstance[methodName] = outer;
  return inner;
};

/**
 * @param {object} AWS
 * @param {string} serviceName
 * @param {Array<string>|object} methodNames
 * @param {function} [implementation]
 * @return {function} mock implementation
 */
module.exports.mockAwsServiceMethods = (AWS, serviceName, methodNames) => {
  if (Array.isArray(methodNames)) {
    return methodNames.reduce(
      (accumulator, methodName) =>
        Object.assign(accumulator, {
          [methodName]: module.exports.mockAwsServiceMethod(
            AWS,
            serviceName,
            methodName,
          ),
        }),
      {},
    );
  }
  return Object.entries(methodNames).reduce(
    (accumulator, [methodName, implementation]) =>
      Object.assign(accumulator, {
        [methodName]: module.exports.mockAwsServiceMethod(
          AWS,
          serviceName,
          methodName,
          implementation,
        ),
      }),
    {},
  );
};
