import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}calendar/events`;

const addEvent = async (eventData) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();

  const payload = {
    Date: eventData.date,
    StartTime: eventData.startTime,
    Duration: eventData.duration,
    Title: eventData.title,
    Description: eventData.description,
    Category: eventData.category,
    MeetLink: eventData.meetLink,
  };

  console.log('[CalendarService] Adding event:', JSON.stringify(payload, null, 2));

  
  const config = {
    method: 'POST',
    url: endpoint,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { addEvent };