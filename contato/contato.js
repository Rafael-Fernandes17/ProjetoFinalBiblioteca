document.getElementById("formContato").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome");
  const sobrenome = document.getElementById("sobrenome");
  const idade = document.getElementById("idade");
  const email = document.getElementById("email");
  const mensagem = document.getElementById("mensagem");

  const erros = document.querySelectorAll(".erro");
  erros.forEach(e => e.textContent = "");

  let valido = true;

  function setErro(campo, texto) {
    campo.nextElementSibling.textContent = texto;
    valido = false;
  }

  if (nome.value.trim() === "") setErro(nome, "Digite seu nome.");
  if (sobrenome.value.trim() === "") setErro(sobrenome, "Digite seu sobrenome.");

  if (idade.value === "" || idade.value < 1)
    setErro(idade, "Idade inválida.");

  if (!email.value.includes("@"))
    setErro(email, "Digite um email válido.");

  if (mensagem.value.trim().length < 5)
    setErro(mensagem, "Escreva uma mensagem maior.");

  if (valido) {
    document.getElementById("sucesso").textContent = "Mensagem enviada com sucesso!";
    this.reset();
  }
});
