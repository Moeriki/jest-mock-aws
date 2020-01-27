const serviceInstances = Symbol('instances');

type MockImplementation = (...args: any[]) => any;

export function mockAwsService(
  AWS: {},
  serviceName: string,
  serviceInstance = {},
): {} {
  AWS[serviceInstances] = AWS[serviceInstances] || {};
  if (AWS[serviceInstances][serviceName]) {
    return AWS[serviceInstances][serviceName];
  }
  AWS[serviceName] = jest.fn(() => serviceInstance);
  AWS[serviceInstances][serviceName] = serviceInstance;
  return serviceInstance;
}

export function mockAwsServiceMethod(
  AWS: {},
  serviceName: string,
  methodName: string,
  methodImplementation: MockImplementation,
): jest.MockedFunction {
  const serviceInstance = mockAwsService(AWS, serviceName);
  const inner = jest.fn(methodImplementation);
  const outer = jest.fn((...arguments_) => ({
    promise: () => inner(...arguments_),
  }));
  serviceInstance[methodName] = outer;
  return inner;
}

export function mockAwsServiceMethods(
  AWS: {},
  serviceName: string,
  methodNames: string[] | { [key: string]: MockImplementation },
): { [key: string]: jest.MockedFunction } {
  if (Array.isArray(methodNames)) {
    return methodNames.reduce(
      (accumulator, methodName) =>
        Object.assign(accumulator, {
          [methodName]: mockAwsServiceMethod(AWS, serviceName, methodName),
        }),
      {},
    );
  }
  return Object.entries(methodNames).reduce(
    (accumulator, [methodName, implementation]) =>
      Object.assign(accumulator, {
        [methodName]: mockAwsServiceMethod(
          AWS,
          serviceName,
          methodName,
          implementation,
        ),
      }),
    {},
  );
}
