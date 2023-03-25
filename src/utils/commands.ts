export enum commandList {
  REGISTER = 'register',
  LIST = 'list',
  SUBSCRIBE = 'subscribe',
}

const COMMANDS = [
  {
    command: commandList.REGISTER,
    description: 'Create an account with us.',
  },
  {
    command: commandList.LIST,
    description: 'List all topics available',
  },
  {
    command: commandList.SUBSCRIBE,
    description: 'Subscribe to a topic',
  },
];

export default COMMANDS;
