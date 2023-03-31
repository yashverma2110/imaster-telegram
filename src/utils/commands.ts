export enum commandList {
  START = 'start',
  REGISTER = 'register',
  LIST = 'list',
  SUBSCRIBE = 'subscribe',
  HELP = 'help',
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
