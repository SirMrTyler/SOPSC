import axios from 'axios';
import * as helper from '../../serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}posts`;

export interface Post {
  prayerId: number;
  userId: number;
  subject: string;
  body: string;
  dateCreated: string;
  prayerCount: number;
  commentCount: number;
  authorName: string;
}

export interface Comment {
  commentId: number;
  prayerId: number;
  userId: number;
  text: string;
  dateCreated: string;
}

const getPosts = async (): Promise<Post[]> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  try {
    const data = await axios(config).then(helper.onGlobalSuccess);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return [];
    }
    return helper.onGlobalError(err);
  }
};

const getPostById = async (id: number): Promise<Post> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const createPost = async (payload: { subject: string; body: string }): Promise<number> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
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

const updatePost = async (id: number, payload: { subject: string; body: string }): Promise<void> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'PUT',
    url: `${endpoint}/${id}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deletePost = async (id: number): Promise<void> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'DELETE',
    url: `${endpoint}/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const prayForPost = async (id: number): Promise<void> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'PUT',
    url: `${endpoint}/${id}/prayer`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getComments = async (postId: number): Promise<Comment[]> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}/${postId}/comments`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  try {
    const data = await axios(config).then(helper.onGlobalSuccess);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return [];
    }
    return helper.onGlobalError(err);
  }
};

const addComment = async (postId: number, payload: { text: string }): Promise<number> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'POST',
    url: `${endpoint}/${postId}/comments`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteComment = async (commentId: number): Promise<void> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'DELETE',
    url: `${endpoint}/comments/${commentId}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  prayForPost,
  getComments,
  addComment,
  deleteComment,
};
