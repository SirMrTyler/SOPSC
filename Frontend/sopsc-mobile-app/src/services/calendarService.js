import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}calendar/events`;

const getEvents = async (start, end) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addEvent = async (eventData) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();

  const start = new Date(`${eventData.date}T${eventData.startTime}`);
  const end = new Date(start.getTime() + eventData.duration * 60000);

  const payload = {
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    title: eventData.title,
    description: eventData.description,
    category: eventData.category,
    includeMeetLink: eventData.includeMeetLink,
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

const updateEvent = async (eventData) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();

  const start = new Date(`${eventData.date}T${eventData.startTime}`);
  const end = new Date(start.getTime() + eventData.duration * 60000);

  const payload = {
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    title: eventData.title,
    description: eventData.description,
    category: eventData.category,
    includeMeetLink: eventData.includeMeetLink,
  };

  if (eventData.includeMeetLink) {
    payload.meetLink = eventData.meetLink;
  }

  const config = {
    method: 'PUT',
    url: `${endpoint}/${eventData.id}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { addEvent, updateEvent, getEvents };