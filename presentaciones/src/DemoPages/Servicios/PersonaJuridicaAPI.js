// personaJuridicaAPI.js
import axios from 'axios';

const urlAPI = 'https://localhost:44380/api/PersonaJuridica';
const keyAPI = '4b567cb1c6b24b51ab55248f8e66e5cc';
const keyencriptada = 'FZWv3nQTyHYyNvdx';

const listarPersonaJuridicas = () => {
  return axios.get(`${urlAPI}/Listar`, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const insertarPersonaJuridica = (data) => {
  return axios.post(`${urlAPI}/Insertar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const editarPersonaJuridica = (data) => {
  return axios.post(`${urlAPI}/Editar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

const eliminarPersonaJuridica = (data) => {
  return axios.post(`${urlAPI}/Eliminar`, data, {
    headers: {
      'XApiKey': keyAPI,
      'EncryptionKey': keyencriptada
    }
  });
};

export default {
  listarPersonaJuridicas,
  insertarPersonaJuridica,
  editarPersonaJuridica,
  eliminarPersonaJuridica
};
