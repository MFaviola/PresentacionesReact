import axios from 'axios';



const urlAPI ='https://localhost:44380/api/Paises';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

// const urlAPI = process.env.REACT_APP_API_URL;
// const keyAPI = process.env.REACT_APP_API_KEY;
// const keyencriptada = process.env.REACT_APP_ENCRYPTION_KEY;

const listarPaises = () => {
  return axios.get(`${urlAPI}/Listar`, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const insertarPaises = (data) => {
  return axios.post(`${urlAPI}/Insertar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const editarPaises = (data) => {
  return axios.post(`${urlAPI}/Editar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

export default {
  listarPaises,
  insertarPaises,
  editarPaises,
};
