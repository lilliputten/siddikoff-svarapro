import axios from 'axios';

import { Room } from '../../types/game';

const baseHost = API_BASE_URL || 'https://svarapro.com';
const baseURL = `${baseHost}/api/v1`;

const isDev = NODE_ENV === 'development';
console.log('[client/src/services/api/api.ts] Initializing', {
  isDev,
  NODE_ENV,
  baseURL,
  baseHost,
  API_BASE_URL,
});

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiService = {
  async login(
    initData: string,
    startPayload?: string,
  ): Promise<{ accessToken: string; roomId?: string }> {
    const url = '/auth/login';
    // eslint-disable-next-line no-console
    console.log('[client/src/services/api/api.ts:login] Sending', {
      url,
      baseURL,
      initData,
      startPayload,
      api,
    });
    debugger;
    /* // Request:
     * url: http://localhost:3000/api/v1/auth/login
     * data: {"initData":"auth_date=1766976773&user=%7B%22id%22%3A490398083%2C%22first_name%22%3A%22Ig%22%2C%22username%22%3A%22lilliputten%22%2C%22language_code%22%3A%22en%22%7D&hash=mock_signature_for_development"}
     * Test command:
     * curl -H "Content-Type: application/json" -d '{"initData":"auth_date=1766976773&user=%7B%22id%22%3A490398083%2C%22first_name%22%3A%22Ig%22%2C%22username%22%3A%22lilliputten%22%2C%22language_code%22%3A%22en%22%7D&hash=mock_signature_for_development"}' http://localhost:3000/api/v1/auth/login
     */
    const response = await api.post(
      url,
      { initData, startPayload },
      {
        withCredentials: true, // if you need cookies
      },
    );
    const { data } = response;
    const accessToken = data.accessToken;
    console.log('[client/src/services/api/api.ts:login] Received', {
      accessToken,
      data,
      response,
    });
    debugger;
    localStorage.setItem('token', accessToken);
    return response.data;
  },

  async getProfile(): Promise<{
    id: number;
    telegramId: string;
    username: string;
    avatar: string;
    balance: string;
    walletAddress: string | null;
  }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getReferralLink(): Promise<unknown> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.get('/users/referral-link', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async initiateDeposit(
    currency: string,
  ): Promise<{ address: string; trackerId: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');

    const profile = await this.getProfile();
    const telegramId = profile.telegramId;

    const response = await api.post(
      '/finances/transaction',
      { telegramId, currency, type: 'deposit' },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  async initiateWithdraw(
    currency: string,
    amount: number,
    walletAddress: string,
  ): Promise<{ address: string; trackerId: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');

    const profile = await this.getProfile();
    const telegramId = profile.telegramId;

    const response = await api.post(
      '/finances/transaction',
      {
        telegramId,
        currency,
        type: 'withdraw',
        amount,
        receiver: walletAddress,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  async getTransactionHistory(userId: string): Promise<
    {
      type: 'deposit' | 'withdraw';
      currency: string;
      amount: number;
      status: 'pending' | 'canceled' | 'confirmed';
      tracker_id: string;
      createdAt: string;
    }[]
  > {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.get(`/finances/history/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async addWalletAddress(walletAddress: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');

    await api.post(
      '/users/wallet-address',
      { walletAddress },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  async createRoom(
    minBet: number,
    type: 'public' | 'private',
    password?: string,
  ): Promise<Room> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.post(
      '/rooms',
      { minBet, type, password },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  async getRooms(): Promise<Room[]> {
    const response = await api.get('/rooms');
    return response.data;
  },

  async getRoom(roomId: string): Promise<Room> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.get(`/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async joinRoom(roomId: string): Promise<Room> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    const response = await api.post(
      `/rooms/${roomId}/join`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  async getMerchantBalance(): Promise<{ balanceUsd: string; equal: string }> {
    const response = await axios.get(
      'https://pay.alfabit.org/api/v1/integration/merchant',
      {
        headers: {
          'x-api-key':
            '7d7c249e4290d90ed4617c44a098c29c7d11e5820fab2ab0a755c4675c8f4779',
          Accept: '*/*',
        },
      },
    );
    return {
      balanceUsd: response.data.data.balanceUsd,
      equal: response.data.data.equal,
    };
  },
};
