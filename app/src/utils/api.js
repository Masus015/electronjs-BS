import axios from 'axios';

// Настройка axios
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL, // Используем переменную окружения или значение по умолчанию
});


// Методы для работы с API

export const dayzServerList = async () => {
  return (await api.get('/server-list')).data;
};