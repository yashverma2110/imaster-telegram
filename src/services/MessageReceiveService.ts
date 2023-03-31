import COMMANDS, { commandList } from '../utils/commands';
import dateUtil from '../utils/dayjs';
import { bold, italic } from '../utils/formatter';
import { CronService } from './CronService';
import LoggerService from './LoggerService';
import MessageSendService from './MessageSendService';
import UserService from './UserService';

const MessageReceiveService = {
  async receiveMessage(message: string, chat: Chat) {
    const isCommand = message.startsWith('/');
    const command = message.split('/')[1];
    let text = 'Unable to recognize command. Please use /help';
    let parseMode = 'Markdown';

    LoggerService.info('Received message: ', message, 'from chat: ', chat.id);

    if (isCommand) {
      switch (command) {
        case commandList.START:
          text = await this.handleStartCommand(chat);
          parseMode = 'HTML';
          break;
        case commandList.REGISTER:
          text = await this.handleRegisterCommand(chat);
          break;
        case commandList.HELP:
          text = this.handleHelpCommand();
          break;
        case commandList.LIST:
          text = await this.handleListTopicsCommand();
          break;
        default:
          break;
      }
    }

    await MessageSendService.sendTextMessage(chat.id, text, parseMode);
  },

  async handleStartCommand(chat: any) {
    const { success } = await UserService.checkIfUserExists(chat.id);

    if (success) {
      return `Welcome back ${
        chat.first_name ?? chat.username
      }! Thanks for using imasterit`;
    }

    return `
        Hi <i>${chat.first_name}</i>
        Welcome to <strong>imasterit!</strong>
        You don't have an account.
        Use <strong>/register</strong> command to sign up.
          `;
  },

  async handleRegisterCommand(chat: Chat) {
    const { success, token } = await UserService.createUser({
      firstName: chat.first_name,
      lastName: chat.last_name,
      username: chat.username,
      telegramId: chat.id,
      isPremium: false,
    });

    if (!success) {
      return 'Sorry, something went wrong!';
    }

    return 'You have successfully registered!';
  },

  async handleListTopicsCommand() {
    const { success, topics = [] } = await UserService.getAllTopics();

    if (!success) {
      return 'Sorry, something went wrong!';
    }

    let message = `*Available topics:*`;

    topics.forEach((topic: Topic, index: number) => {
      message = `
${message}
${index + 1}. ${italic(topic.name)} ${bold(topic.shortName)}
    `;
    });

    message = `
        ${message}
        *Use the /${
          commandList.SUBSCRIBE
        } <topic name> command to subscribe to a topic*
        ${italic(
          `For eg: /${commandList.SUBSCRIBE} ${topics[0].shortName} to subscribe to ${topics[0].name}`
        )}
  `;

    return message.trim();
  },

  async handleSubscriptionCommand(message: string, chat: Chat) {
    const args = message.split(' ').slice(1);
    const topicName = args[0];

    if (!topicName) {
      return 'Please specify a topic name! \n For eg: /subscribe js';
    }

    const { success, data, isTopicNotFound, isAlreadySubscribed } =
      await UserService.subscribeToTopic(topicName, chat.id);

    if (!success) {
      if (isTopicNotFound) {
        return `Sorry, we couldn't find a topic with the name *${topicName}*!\n${italic(
          `Use the /${commandList.LIST} command to see all available topics`
        )}`;
      }

      if (isAlreadySubscribed) {
        return `You're already subscribed to ${bold(topicName)} ✅\n${italic(
          `Use the /${commandList.LIST} command to see all available topics`
        )}`;
      }

      return 'Sorry, something went wrong!';
    }

    const { success: isCronSuccess } = await CronService.scheduleConcept({
      topicId: data.subscription.topicId,
      chatId: chat.id,
      time:
        dateUtil().add(1, 'minute').format('hh:mm A') ??
        data.subscription.remindAt,
    });

    if (!isCronSuccess) {
      return 'Cron schedule failed';
    }
    return `You have successfully subscribed to the ${italic(topicName)} 🎉!`;
  },

  handleHelpCommand() {
    let manual = `*Reference manual:*`;
    COMMANDS.forEach((cmd) => {
      manual = `
        ${manual}
        /${cmd.command} - _${cmd.description}_
    `;
    });

    return manual.trim();
  },
};

export default MessageReceiveService;
