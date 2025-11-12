//Configurações da API
const API_URL = 'https://jsonplaceholder.typicode.com/posts';


document.addEventListener('DOMContentLoaded', () => {

// Capturando variaveis
const form = document.getElementById("meuFormulario");
const mensagem = document.getElementById("mensagens");
const readBtn = document.getElementById('readBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

// Definindo o nome do "Banco de Dados"
let armazenamentoLocal = carregaArmazenamentoLocal();

// Dando uma chave "livros_biblioteca para o "Banco de Dados"
function salvaLivros() {
  localStorage.setItem('livros_biblioteca', JSON.stringify(armazenamentoLocal));
}

// Tenta buscar e carregar o "Banco de Dados"
function carregaArmazenamentoLocal() {
  try {
    // Se der certo, transforma o arquivo bruto em um JSON
    const buscadorBanco = localStorage.getItem('livros_biblioteca');
    return buscadorBanco ? JSON.parse(buscadorBanco) : [];
  } catch (e) {
    // Se algo der errado ao converter em Array, retorna um array vazio
    return [];
  }
}

// Gera um novo ID local sequencial (robusto mesmo se apagarmos itens)
function geradorID() {
  const ids = armazenamentoLocal.map(u => Number(u.id)).filter(Number.isFinite);
  const maxId = ids.length ? Math.max(...ids) : 0;
  return maxId + 1;
}

// Função para renderizar a lista de livros na área de mensagens

function carregarListaLivros(livros, titulo = 'Livros Cadastrados') {
    const mensagem = document.getElementById("mensagens"); // Certifique-se de capturar a área de exibição
    if (!livros || livros.length === 0) {
        mensagem.style.color = "yellow";
        mensagem.textContent = "Nenhum livro cadastrado até o momento";
        mensagem.style.display = "block";
        return;
    }
    let html = `<h3>${titulo} (${livros.length})</h3><ul>`;
    // Itera sobre o array de livros para criar um item de lista para cada um
    livros.forEach(livro => {
        html += `<li>
            <strong>Título:</strong> ${livro.titulo} <br>
            <strong>Autor:</strong> ${livro.autor} <br>
            <strong>ISBN:</strong> ${livro.ISBN} <br>
            <strong>Ano:</strong> ${livro.anoPublicacao}
        </li>`;
    });
    html += `</ul>`;
    mensagem.innerHTML = html;
    mensagem.style.display = "block";
}

function mostrarMensagem(tipo) {
    if(tipo === "error"){
      mensagem.style.textTransform = "uppercase";
      mensagem.style.color = "red";
      mensagem.textContent = "Erro ao cadastrar livro!"
      mensagem.style.display = "block";
    } 

    if(tipo === "success"){
      mensagem.style.textTransform = "uppercase";
      mensagem.style.color = "green";
      mensagem.textContent = "Livro cadastrado com sucesso!";
      mensagem.style.display = "block";
    }
}

if (form){
  form.addEventListener("submit", async(evento)=> {
      evento.preventDefault();

      // Iniciando o POST (CREATE)
      const titulo = document.getElementById("titulo").value;
      const autor = document.getElementById("autor").value;
      const ISBN = document.getElementById("ISBN").value;
      const anoPublicacao = document.getElementById("anoPublicacao").value;

      if(!titulo || !autor || !ISBN || !anoPublicacao){
          mostrarMensagem("error");
          return
      } else {
          // Enviando Objeto (novoLivro)
          const novoLivro = {titulo, autor, ISBN, anoPublicacao};

            try {
                  // b) Envia POST
                  const requisicao = await fetch(API_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(novoLivro)
              });

                  if (!requisicao.ok) throw new Error('Erro na requisição HTTP');

                  const transformandoObjeto = await requisicao.json();
                  // Garantindo que o livro vai possuir ID
                  const criandoObjeto = {
                  id: transformandoObjeto.id ?? geradorID(),
                  ...novoLivro
                  };

                  // c) Atualiza o "banco" local e salva
                  armazenamentoLocal.push(criandoObjeto);
                  salvaLivros();

                  // d) Mostra o resultado na tela
                  mostrarMensagem("success");
                  form.reset()
              } catch (error) {
                  mostrarMensagem('error');
              }
          }
      });

    // Chamando a Função de ler livros logo que apertamos o botão
    readBtn.addEventListener('click', () => {
    carregarListaLivros(armazenamentoLocal, 'Livros Cadastrados:');
      });
} });