(function () {
  "use strict";
  var raiz = document.documentElement;

  /* Ano automático */
  document.getElementById("ano").textContent = new Date().getFullYear();

  /* Saudação dinâmica */
  var h = new Date().getHours();
  var saudacao = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  document.getElementById("saudacao").textContent = saudacao + "! Bem-vindo(a) ao meu portfólio.";

  /* Menu hambúrguer */
  var btnMenu = document.getElementById("btn-menu");
  var menu = document.getElementById("menu");
  function alternarMenu(abrir) {
    menu.classList.toggle("aberto", abrir);
    btnMenu.setAttribute("aria-expanded", String(abrir));
    btnMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    btnMenu.textContent = abrir ? "✕" : "☰";
  }
  btnMenu.addEventListener("click", function () {
    alternarMenu(!menu.classList.contains("aberto"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") alternarMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("aberto")) {
      alternarMenu(false);
      btnMenu.focus();
    }
  });

  /* Modo claro/escuro */
  var btnTema = document.getElementById("btn-tema");
  function aplicarTema(escuro) {
    if (escuro) raiz.dataset.tema = "escuro"; else delete raiz.dataset.tema;
    btnTema.setAttribute("aria-pressed", String(escuro));
    btnTema.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
  }
  aplicarTema(raiz.dataset.tema === "escuro");
  btnTema.addEventListener("click", function () {
    var escuro = raiz.dataset.tema !== "escuro";
    aplicarTema(escuro);
    try { localStorage.setItem("tema", escuro ? "escuro" : "claro"); } catch (e) {}
  });

  /* Validação do formulário */
  var form = document.getElementById("form");
  var retorno = document.getElementById("retorno");

  function mostrarErro(campo, msg) {
    document.getElementById("erro-" + campo.id).textContent = msg;
    campo.classList.toggle("invalido", !!msg);
    campo.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  var regras = {
    nome: function (c) {
      return c.value.trim().length >= 3 ? "" : "Digite seu nome com pelo menos 3 letras.";
    },
    email: function (c) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim()) ? "" : "Digite um e-mail válido, como nome@exemplo.com.";
    },
    mensagem: function (c) {
      return c.value.trim().length >= 10 ? "" : "Escreva uma mensagem com pelo menos 10 caracteres.";
    },
    consentimento: function (c) {
      return c.checked ? "" : "Marque a caixa para autorizar o uso dos seus dados.";
    }
  };

  Object.keys(regras).forEach(function (id) {
    var campo = document.getElementById(id);
    campo.addEventListener("blur", function () { mostrarErro(campo, regras[id](campo)); });
    campo.addEventListener("input", function () {
      if (campo.getAttribute("aria-invalid") === "true") mostrarErro(campo, regras[id](campo));
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    retorno.textContent = "";
    var primeiroInvalido = null;
    Object.keys(regras).forEach(function (id) {
      var campo = document.getElementById(id);
      if (!mostrarErro(campo, regras[id](campo)) && !primeiroInvalido) primeiroInvalido = campo;
    });
    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }
    /* Demonstração: nenhum dado é enviado ou armazenado */
    retorno.textContent = "Mensagem validada com sucesso! (demonstração, nada foi enviado)";
    form.reset();
    Object.keys(regras).forEach(function (id) {
      var c = document.getElementById(id);
      c.classList.remove("invalido");
      c.removeAttribute("aria-invalid");
    });
  });
})();
