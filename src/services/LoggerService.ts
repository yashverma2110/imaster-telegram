const Reset = '\x1b[0m';
const BgGreen = '\x1b[42m';
const BgRed = '\x1b[41m';
const BgYellow = '\x1b[43m';

const LoggerService = {
  success(...args: any) {
    console.log(BgGreen, ...args, Reset);
  },

  info(...args: any) {
    console.log(BgYellow, ...args, Reset);
  },

  error(...args: any) {
    console.log(BgRed, ...args, Reset);
  },
};

export default LoggerService;
