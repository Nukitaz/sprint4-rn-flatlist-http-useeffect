import { API_BASE_URL } from '../config/constants';

export async function getCharacters({ page = 1, name = '' } = {}) {
  const trimmedName = name.trim();
  const queryParams = [`page=${page}`];

  if (trimmedName.length > 0) {
    queryParams.push(`name=${encodeURIComponent(trimmedName)}`);
  }

  const url = `${API_BASE_URL}/character?${queryParams.join('&')}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return {
      results: [],
      hasNextPage: false,
    };
  }

  if (!response.ok) {
    throw new Error(`Error al obtener personajes (HTTP ${response.status})`);
  }

  const data = await response.json();

  return {
    results: data.results ?? [],
    hasNextPage: Boolean(data.info?.next),
  };
}