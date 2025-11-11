//Configurações da API
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Capturando variaveis
const form = document.getElementById("meuFormulario");
const mensagem = document.getElementById("mensagens");
const readBtn = document.getElementById('readBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

// Definindo o localStorage
let armazenamentoLocal = loadLocalStorage();

function saveLocalUsers() {
  localStorage.setItem('usuarios_aula', JSON.stringify(localUsers));
}

// Tenta carregar o armazenamento existente
function carregaArmazenamentoLocal() {
  try {
    const raw = localStorage.getItem('usuarios_aula');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    // Se algo der errado ao parsear, volta um array vazio
    return [];
  }
}