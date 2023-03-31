const BgGreen = '\x1b[42m';
const BgRed = '\x1b[41m';

const LoggerService = {
  success(...args: any) {
    console.log(BgGreen, ...args);
  },

  error(...args: any) {
    console.log(BgRed, ...args);
  },
};

export default LoggerService;
