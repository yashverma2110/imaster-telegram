import cron from 'node-cron';
import ApiClient from '../utils/axios';

export const CronService = {
  async scheduleConcept({
    topic,
    token,
    bot,
    chatId,
  }: {
    topic: any;
    token: string;
    bot: any;
    chatId: number;
  }) {
    const scheduleAt = '*/5 * * * * *';
    const job: any = cron.schedule(
      scheduleAt,
      async function () {
        try {
          const response = await ApiClient.get('/concept/random');
          const concept = response.data.concept[0];

          if (!concept) {
            throw new Error('No concept found');
          }

          await ApiClient.post(
            '/history/create',
            {
              jobId: scheduleAt,
              conceptId: concept._id,
              remindAt: scheduleAt,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          bot.telegram.sendMessage(chatId, concept?.description);
        } catch (error) {
          console.log('🚀 ~ file: CronService.ts:48 ~ error:', error);
        }
      },
      {
        scheduled: false,
      }
    );

    try {
      job.start();

      return {
        success: true,
      };
    } catch (error) {
      const err = error as any;
      console.log(
        '🚀 ~ file: CronService.ts:39 ~ CronService ~ scheduleConcept ~ err',
        err
      );
      return {
        success: false,
      };
    }
  },
};
