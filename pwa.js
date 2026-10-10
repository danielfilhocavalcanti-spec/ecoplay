(function() {
    const installButton = document.getElementById("installAppButton");
    const installMessage = document.getElementById("installAppMessage");

    if (!installButton || !installMessage) {
        return;
    }

    let installPrompt;

    function isInstalled() {
        return window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;
    }

    function updateInstalledState() {
        if (isInstalled()) {
            installButton.textContent = "✅ App instalado";
            installButton.disabled = true;
            installMessage.textContent = "";
        }
    }

    window.addEventListener("beforeinstallprompt", function(event) {
        event.preventDefault();
        installPrompt = event;
    });

    window.addEventListener("appinstalled", function() {
        installPrompt = null;
        updateInstalledState();
        installMessage.textContent = "O app foi instalado com sucesso.";
    });

    installButton.addEventListener("click", async function() {
        if (installPrompt) {
            const promptEvent = installPrompt;
            installPrompt = null;

            try {
                await promptEvent.prompt();
                const choice = await promptEvent.userChoice;
                installMessage.textContent = choice.outcome === "accepted"
                    ? "Instalação iniciada."
                    : "A instalação foi cancelada.";
            } catch (error) {
                console.error("Falha ao iniciar a instalação do app:", error);
                installMessage.textContent = "Não foi possível iniciar a instalação. Tente novamente pelo menu do navegador.";
            }
            return;
        }

        if (isInstalled()) {
            updateInstalledState();
            return;
        }

        const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
        installMessage.textContent = isIOS
            ? "Para instalar no iPhone/iPad, toque em Compartilhar e depois em \"Adicionar à Tela de Início\"."
            : "Para instalar, abra o menu do navegador e escolha \"Instalar app\" ou \"Adicionar à tela inicial\".";
    });

    if ("serviceWorker" in navigator) {
        if (window.isSecureContext) {
            navigator.serviceWorker.register("./service-worker.js").catch(function(error) {
                console.error("Falha ao preparar a instalação do app:", error);
                installMessage.textContent = "Não foi possível preparar o app para instalação. Tente novamente mais tarde.";
            });
        } else {
            installMessage.textContent = "A instalação exige que o site esteja publicado em HTTPS ou aberto em localhost.";
        }
    } else {
        installMessage.textContent = "Este navegador não oferece suporte à instalação do app.";
    }

    updateInstalledState();
})();
