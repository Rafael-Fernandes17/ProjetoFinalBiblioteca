//Configurações da API
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

document.addEventListener("DOMContentLoaded", () => {
  
  // Capturando variaveis dos INPUTS
  let titulo = document.getElementById('titulo');
  let autor = document.getElementById('autor');
  let isbn = document.getElementById('isbn');
  let anoPublicacao = document.getElementById('anoPublicacao');
  let fotoCapa = document.getElementById('fotoCapa');

  // Capturando const dos botões
  const updateBtn = document.getElementById('updateBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  // Capturando demais variavei
  const form = document.getElementById("meuFormulario");
  const mensagem = document.getElementById("mensagens");
  const divCatalogo = document.getElementById('catalogo');
  const mensagemCatalogo = document.getElementById('catalogoMensagem');


  // Tudo relacionado ao "BD" Local
  // Definindo o nome do "Banco de Dados"
  let armazenamentoLocal = carregaArmazenamentoLocal() /*função usada criada mais para frente*/;

  
  // Dando uma chave "livros_biblioteca para o "Banco de Dados"
  function salvaLivros() {
    /*session pq eu queria que quando fechasse o navegador ele recarregasse*/
    sessionStorage.setItem('livros_biblioteca', JSON.stringify(armazenamentoLocal));
  }

  // Tenta buscar e carregar o "Banco de Dados"
  function carregaArmazenamentoLocal() {
    try {
      // Se der certo, transforma o arquivo bruto em um JSON
      const buscadorBanco = sessionStorage.getItem('livros_biblioteca');
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
  

  // Função para renderizar a lista de livros na área de mensagens Na pagina inicial
  function carregarListaLivros(livros) {
    
    if (mensagemCatalogo && divCatalogo) { 
      if (!livros || livros.length === 0) {
        divCatalogo.style.display = "flex";
        mensagemCatalogo.textContent = "Nenhum livro cadastrado!";
        mensagemCatalogo.style.display = "flex";
      } else {
        divCatalogo.style.display = "flex";
        divCatalogo.style.width = "80%";
        divCatalogo.style.backgroundColor = "rgb(176, 4, 4);";

      let html = `
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Capa Livro</th>
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Ano</th>
            </tr>
          </thead>
          <tbody>
      `;

      livros.forEach(livro => {
        html += `
          <tr>
            <td>${livro.id}</td>
            <td><img src="${livro.fotoCapa}" alt="Capa do livro" style="width:80px; height:auto;"></td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.isbn}</td>
            <td>${livro.anoPublicacao}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;

      divCatalogo.innerHTML = html;
    }
  }
}

  // Funçoes de verificação em tempo real
  function verificaTitulo(){
    const novoTitulo = titulo.value.trim();
    const tamanhoTitulo = novoTitulo.length;

    if(tamanhoTitulo < 3 && tamanhoTitulo > 0){
      mensagemTitulo.style.display = "flex";
      mensagemTitulo.textContent = "O titulo do livro deve conter ao menos 3 letras!";
      return false;
    } else{
      mensagemTitulo.style.display = "none";  
      return true;
    }
  }

  function verificaIsbn(){
    const novoIsbn = isbn.value.trim();
    const tamanhoIsbn = novoIsbn.length;

    if(tamanhoIsbn < 10 && tamanhoIsbn > 0){
      mensagemIsbn.style.display = "flex";
      mensagemIsbn.textContent = "O ISBN do livro deve conter ao menos 10 números!";
      return false;
    } else {
      mensagemIsbn.style.display = "none";
      return true;
    }
  }

  function verificaAno(){
    const ano = anoPublicacao.value;
    const anoAtual = new Date().getFullYear();

    if(ano > anoAtual){
      mensagemAno.style.display = "flex";
      mensagemAno.textContent = "Não é possível um livro vir do futuro!";
      return false;
    } else {
      mensagemAno.style.display = "none";
      return true;
    }
  }

  // Demais funções
  function mostrarMensagem(tipo, texto) { // Mensagem de sucesso ou erro para CADASTRAR O LIVRO!
      if(tipo === "error"){
        mensagem.style.textTransform = "uppercase";
        mensagem.style.color = "red";
        mensagem.textContent = tipo + ": " + texto;
        mensagem.style.display = "block";
      } 

      if(tipo === "success"){
        mensagem.style.textTransform = "uppercase";
        mensagem.style.color = "green";
        mensagem.textContent = tipo + ": " + texto;
        mensagem.style.display = "block";
      }
  }

  // Toda a lógica para o CREATE e enviar para a outra página READ
  if (form){
    form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

  if (!verificaTitulo() || !verificaIsbn() || !verificaAno()) {
    mostrarMensagem("error", "Não foi possível cadastrar o livro!");
    return;
  }

  // Logica feita para conseguir exibir a foto da capa do livro
  const file = fotoCapa.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async () => {
      const novoLivro = {
        titulo: titulo.value,
        autor: autor.value,
        isbn: isbn.value,
        anoPublicacao: Number(anoPublicacao.value),
        fotoCapa: reader.result 
      };

      // Tentando fazer o POST
      try {
        const requisicao = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoLivro)
        });

        if (!requisicao.ok) throw new Error("Erro na requisição HTTP");

        const transformandoObjeto = await requisicao.json();
        const criandoObjeto = {
          id: geradorID(),
          ...novoLivro
        };

        armazenamentoLocal.push(criandoObjeto);
        salvaLivros();
        form.reset();
        carregarListaLivros(armazenamentoLocal);
        mostrarMensagem("success", "Livro criado com sucesso!");
      } catch (error) {
        mostrarMensagem("error", "Não foi possível criar o livro!");
      }
    };
    reader.readAsDataURL(file); // dispara a leitura
  }
});
        // Chamando as funçoes de verificação em tempo real
        if(titulo){titulo.addEventListener('input', verificaTitulo);}
        if(isbn){isbn.addEventListener('input', verificaIsbn);}
        if(anoPublicacao){anoPublicacao.addEventListener('input', verificaAno);}
}

// Lógica para UPDATE
if(updateBtn){
  updateBtn.addEventListener('click', async function(){
  
    const idLivro = prompt("Digite o ID do livro que deseja atualizar: ");
    const novoIdLivro = parseInt(idLivro); 

    if (idLivro === null) return; // cancelou
    else if (!Number.isFinite(novoIdLivro) || novoIdLivro <= 0) {
      mostrarMensagem('error', 'ID inválido!');
    }

  const livro = armazenamentoLocal.find(u => Number(u.id) === novoIdLivro);
  if (!livro) {
    mostrarMensagem('error', `Não encontrei livro com ID ${novoIdLivro} no cadastro local.`);
    return;
  }

  // capturando novos valores
  const novoTitulo = prompt('Novo titulo:', livro.titulo);
  if (novoTitulo === null) return;

  const novoAutor = prompt('Novo autor:', livro.autor);
  if (novoAutor === null) return;

  const novoIsbn = prompt('Novo ISBN:', livro.isbn);
  if (novoIsbn === null) return;

  const novoAno = prompt('Novo ano de publicação:', livro.anoPublicacao);
  if (novoAno === null) return;

  // Testando se eles são válidos
  let passouPelaVerificacao = true;
  if(novoTitulo.trim().length < 3 && novoTitulo.trim().length > 0){passouPelaVerificacao = false};
  if(novoIsbn.trim().length < 10 && novoIsbn.trim().length > 0){passouPelaVerificacao = false};
  const verificandoAno = (function() {
    const anoDigitado = Number(novoAno);
    const anoAtual = new Date().getFullYear();

      if(!Number.isFinite(anoDigitado) || anoDigitado > anoAtual){
        return false;
      } else{
        return true;
      }
    })();
  if(verificandoAno === false){passouPelaVerificacao = false;}

  if(passouPelaVerificacao === false){
    mostrarMensagem('error', 'Todas as restrições devem ser seguidas!');
    return  
  }
  if (!novoTitulo || !novoAutor || !novoIsbn || 
    !novoAno) {
    mostrarMensagem('error', 'Todos os campos são obrigatórios!');
  return;
  }

  // Atualizando os dados já que eles são válidos
  const atualizarDados = {
    titulo: novoTitulo.trim(),
    autor: novoAutor.trim(),
    isbn: novoIsbn.trim(),
    anoPublicacao: Number(novoAno)
  };

  // Tenta enviar os dados atualizados
  try {
    // Tentamos o PUT apenas para fins didáticos
      const response = await fetch(`${API_URL}/${novoIdLivro}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizarDados)
    });

    // Mesmo se a API retornar erro (404, 500 etc.), continuamos localmente
    if (!response.ok) {
      console.warn(`A API retornou status ${response.status}, mas o livro será atualizado localmente.`);
    }

    // Atualiza o "banco" local mesmo assim
    const idx = armazenamentoLocal.findIndex(u => Number(u.id) === novoIdLivro);
    if (idx !== -1) {
      armazenamentoLocal[idx] = { ...armazenamentoLocal[idx], ...atualizarDados };
      salvaLivros();
      carregarListaLivros(armazenamentoLocal);
      mostrarMensagem('success', 'Livro atualizado com sucesso!');
    } else {
      mostrarMensagem('error', 'Livro não está no cadastro local.');
    }
  } catch (error) {
    mostrarMensagem('error', 'Erro inesperado ao atualizar livro.');
  }

  });
}

// Lógica para o DELETE
if(deleteBtn){
  deleteBtn.addEventListener('click', async () => {
    const idLivro = prompt("Digite o ID do livro que deseja deletar: ");
    const novoIdLivro = parseInt(idLivro); 

    if (idLivro === null) return; // cancelou
    else if (!Number.isFinite(novoIdLivro) || novoIdLivro <= 0) {
      mostrarMensagem('error', 'ID inválido!');
    }

    const livro = armazenamentoLocal.find(u => Number(u.id) === novoIdLivro);
    if (!livro) {
      mostrarMensagem('error', `Não encontrei livro com ID ${novoIdLivro} no cadastro local.`);
      return;
    }

    // b) Confirmação
    const confirmar = confirm(`Tem certeza que deseja deletar o usuário "${livro.titulo}" (ID ${novoIdLivro})?`);
    if (!confirmar) return;

    // Tentando enviar o DELET
    try {
      // c) Envia DELETE didático para a API
      const response = await fetch(`${API_URL}/${novoIdLivro}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar na API.');

      // Remove do "banco" local e salva
      armazenamentoLocal = armazenamentoLocal.filter(u => Number(u.id) !== novoIdLivro);
      salvaLivros();

      // d) Mostra resultado
      mostrarMensagem('success', `Usuário com ID ${novoIdLivro} deletado!.`);

      // (Opcional) Mostrar lista remanescente
      // renderUserList(localUsers, 'Usuários restantes (local)');
    } catch (error) {
      mostrarMensagem('error', 'Erro ao deletar usuário.');
    }
  });
}

  // Essa budeguinha deu trabalho
  carregarListaLivros(armazenamentoLocal);
});
