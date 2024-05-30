import axios from 'axios';

const urlAPI ='https://localhost:44380/api/Estilos';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';


const listarEstilos = () => {
  return axios.get(`${urlAPI}/Listar`, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const insertarEstilos = (data) => {
  return axios.post(`${urlAPI}/Insertar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const editarEstilos = (data) => {
  return axios.post(`${urlAPI}/Editar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const eliminarEstilos = (data) => {
  return axios.post(`${urlAPI}/Eliminar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

export default {
  listarEstilos,
  insertarEstilos,
  editarEstilos,
  eliminarEstilos
};
