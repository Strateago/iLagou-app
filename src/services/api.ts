import axios, { AxiosError } from 'axios';
const API_BASE_URL = 'http://192.168.1.6:3000/api/v1';

// 💡 Defina a interface para a resposta que você espera da sua API.
export interface ApiResponse {
    probabilidade: number;
    alerta: string;
    resumoRota: string;
    // Adicione outros campos que sua API retorna, se houver
  }
  
  // 💡 Esta é a função que seu componente 'RoutesScreen' irá chamar.
  // Ela faz a requisição POST para a sua API.
  export async function getRiskForRoute(start: string, end: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/risk`, {
        start,
        end
      });
      
      // Axios retorna os dados da resposta em 'response.data'
      return response.data;
    } catch (error) {
      // 💡 Trata e lança um erro mais amigável
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Falha ao obter dados de risco da API.');
      }
      
      // Lança um erro genérico para outros problemas
      console.error('An unexpected error occurred:', error);
      throw new Error('Ocorreu um erro inesperado.');
    }
  }