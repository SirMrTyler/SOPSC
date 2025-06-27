const API = process.env.EXPO_PUBLIC_API_URL || '';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API}users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const googleLogin = async (idToken: string) => {
  const response = await fetch(`${API}users/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

export const autoLogin = async (deviceId: string) => {
  const response = await fetch(`${API}users/auto-login`, { headers: { DeviceId: deviceId } });
  if (!response.ok) throw new Error('Unauthorized');
  return response.json();
};

export const logout = async (token: string, deviceId: string) => {
  await fetch(`${API}users/logout`, { headers: { Authorization: `Bearer ${token}`, DeviceId: deviceId } });
};
