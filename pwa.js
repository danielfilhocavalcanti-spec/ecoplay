(() => {
  let deferredPrompt = null;
  const installButton = document.getElementById("installAppButton");
  const installMessage = document.getElementById("installAppMessage");

  const setMessage = message => {
    if (installMessage) installMessage.textContent = message;
  };

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js")
        .catch(error => console.error("Falha ao registrar o service worker:", error));
    });
  }

  if (!installButton) return;

  installButton.hidden = true;
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
    setMessage("Você pode instalar o aplicativo neste dispositivo.");
  });

  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) {
      setMessage("Para instalar, abra este site em um navegador compatível e use o menu do navegador: “Instalar aplicativo” ou “Adicionar à tela inicial”.");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
    setMessage("Aplicativo instalado com sucesso!");
  });
})();
