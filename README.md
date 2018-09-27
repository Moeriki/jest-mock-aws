# jest-mock-aws

Utiliy to help you mock AWS when testing with [Jest](https://jestjs.io).

You can use this only with the AWS Promise interface.

## Quick start

```sh
npm install --save-dev jest-mock-aws
```

### _index.js_

```js
exports.publish = (message) => new AWS.SNS().publish(message).promise();
```

### _index.test.js_

```js
const AWS = require('aws-sdk');
const { mockAwsServiceMethod } = require('jest-mock-aws');

jest.mock('aws-sdk', () => ({}));

it('should mock AWS', () => {
  const mockPublish = mockAwsServiceMethod(AWS, 'SNS', 'publish');
  mockPublish.mockResolvedValue('publish-result');
});
```

## API

### mockAwsService

#### `mockAwsService(AWS:object, serviceName:string) :object`

```js
const AWS = {};
const mockSns = mockAwsService(AWS, 'SNS');
mockSns.publish = jest.fn();
mockSns.publish.mockResolvedValue({});
```

### mockAwsServiceMethod

#### `mockAwsServiceMethod(AWS:object, serviceName:string, methodName:String) :jest.fn()`

```js
const AWS = {};
const mockSnsPublish = mockAwsServiceMethod(AWS, 'SNS', 'publish');
mockSnsPublish.mockResolvedValue({});
```

### mockAwsServiceMethods

#### `mockAwsServiceMethods(AWS:object, serviceName:string, methods:Array|Object) :object`

With Array.

```js
const AWS = {};
const mockSqs = mockAwsServiceMethods(AWS, 'SQS', [
  'deleteMessage',
  'receiveMessages',
]);
mockSqs.deleteMessage.mockResolvedValue({});
mockSqs.receiveMessages.mockResolvedValue({});
```

With Object.

```js
const AWS = {};
const mockSqs = mockAwsServiceMethods(AWS, 'SQS', {
  deleteMessage: jest.fn().mockResolvedValue({});
  receiveMessages: jest.fn().mockResolvedValue({});
});
```
