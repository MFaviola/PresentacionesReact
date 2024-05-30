import axios from 'axios';

// const urlAPI = process.env.REACT_APP_API_URL;
// const keyAPI = process.env.REACT_APP_API_KEY;
// const keyencriptada = process.env.REACT_APP_ENCRYPTION_KEY;

const urlAPI ='https://localhost:44380/api/UnidadMedidas';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';


class Servicios {
  static async listarUnidadesDeMedidas() {
    return axios.get(`${urlAPI}/Listar`, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
  }

  static async insertarUnidadesDeMedidas(data) {
    return axios.post(`${urlAPI}/Insertar`, data, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
  }

  static async editarUnidadesDeMedidas(data) {
    return axios.post(`${urlAPI}/Editar`, data, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
  }

  static async eliminarUnidadesDeMedidas(data) {
    return axios.post(`${urlAPI}/Eliminar`, data, {
      headers: {
        'XApiKey': keyAPI,
        'EncryptionKey': keyencriptada
      }
    });
  }
}

export default Servicios;
