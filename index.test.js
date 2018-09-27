'use strict';

const {
  mockAwsService,
  mockAwsServiceMethod,
  mockAwsServiceMethods,
} = require('./index');

describe('mockAwsService', () => {
  it('should create new service instance', () => {
    const AWS = {};
    const SNS = mockAwsService(AWS, 'SNS');
    expect(SNS).toEqual({});
  });

  it('should return existing service instance', () => {
    const AWS = {};
    expect(mockAwsService(AWS, 'SNS')).toBe(mockAwsService(AWS, 'SNS'));
  });
});

describe('mockAwsServiceMethod', () => {
  it('should mock AWS instance method', async () => {
    const AWS = {};
    const mockPublish = mockAwsServiceMethod(AWS, 'SNS', 'publish');
    mockPublish.mockResolvedValue('publish-result');
    const sns = new AWS.SNS();
    const result = await sns.publish('publish').promise();
    expect(mockPublish).toHaveBeenCalledWith('publish');
    expect(result).toBe('publish-result');
  });
});

describe('mockAwsServiceMethods', () => {
  it('should mock AWS service methods array', async () => {
    const AWS = {};
    const [mockDeleteMessage, mockReceiveMessages] = mockAwsServiceMethods(
      AWS,
      'SQS',
      ['deleteMessage', 'receiveMessages']
    );
    mockDeleteMessage.mockResolvedValue('delete-message-result');
    mockReceiveMessages.mockResolvedValue('receive-messages-result');
    const sqs = new AWS.SQS();
    expect(await sqs.deleteMessage('delete-message').promise()).toBe(
      'delete-message-result'
    );
    expect(mockDeleteMessage).toHaveBeenCalledWith('delete-message');
    expect(await sqs.receiveMessages('receive-messages').promise()).toBe(
      'receive-messages-result'
    );
    expect(mockReceiveMessages).toHaveBeenCalledWith('receive-messages');
  });

  it('should mock AWS service methods object', async () => {
    const AWS = {};
    const {
      deleteMessage: mockDeleteMessage,
      receiveMessages: mockReceiveMessages,
    } = mockAwsServiceMethods(AWS, 'SQS', {
      deleteMessage: () => 'delete-message-result',
      receiveMessages: () => 'receive-messages-result',
    });
    const sqs = new AWS.SQS();
    expect(await sqs.deleteMessage('delete-message').promise()).toBe(
      'delete-message-result'
    );
    expect(mockDeleteMessage).toHaveBeenCalledWith('delete-message');
    expect(await sqs.receiveMessages('receive-messages').promise()).toBe(
      'receive-messages-result'
    );
    expect(mockReceiveMessages).toHaveBeenCalledWith('receive-messages');
  });
});
