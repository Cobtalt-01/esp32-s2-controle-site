// Importando as ferramentas do Firebase direto da internet
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Substitua as informações abaixo pelo bloco gerado na Etapa 2
const firebaseConfig = {
  apiKey: "AIzaSyDKwdDRg_PXb-SHeBodFs_Un5YZkFn7hDU",
  authDomain: "controle-esp32-s2-led.firebaseapp.com",
  projectId: "controle-esp32-s2-led",
  storageBucket: "controle-esp32-s2-led.firebasestorage.app",
  messagingSenderId: "1051760604536",
  appId: "1:1051760604536:web:62983ca57408a85635448d"
};


// Inicializando o Firebase ("Ligando" a nossa aplicação ao banco)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const ledToggleBtn = document.getElementById('ledToggle');
    const ledIndicator = document.getElementById('ledIndicator');
    const statusText = document.getElementById('statusText');

    let isDarkTheme = false;
    let isLedOn = false;

    // --- Lógica de Tema (Claro / Escuro) ---
    const toggleTheme = () => {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            document.documentElement.removeAttribute('data-theme');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);

    // Checa preferência do sistema para tema escuro inicialmente
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleTheme();
    }

    // --- Lógica de Controle do LED ---
    const updateUI = () => {
        if (isLedOn) {
            ledIndicator.classList.remove('off');
            ledIndicator.classList.add('on');
            statusText.textContent = 'LED Ligado';
            ledToggleBtn.textContent = 'Desligar LED';
            ledToggleBtn.classList.remove('btn-primary');
            ledToggleBtn.classList.add('btn-danger');
        } else {
            ledIndicator.classList.remove('on');
            ledIndicator.classList.add('off');
            statusText.textContent = 'LED Desligado';
            ledToggleBtn.textContent = 'Ligar LED';
            ledToggleBtn.classList.remove('btn-danger');
            ledToggleBtn.classList.add('btn-primary');
        }
    };

    const toggleLed = async () => {
        // Alterna o estado localmente primeiro para a interface atualizar rápido
        isLedOn = !isLedOn;
        updateUI();

        try {
            // Cria a referência (o caminho) para a variável 'disjuntor' no Firebase
            const disjuntorRef = ref(db, 'disjuntor');
            
            // Grava o valor atual do LED (true ou false) lá no banco de dados
            await set(disjuntorRef, isLedOn);
            
            console.log("Comando enviado para o Firebase. Disjuntor: " + isLedOn);
        } catch (error) {
            console.error('Erro ao salvar no Firebase:', error);
        }
    };

    ledToggleBtn.addEventListener('click', toggleLed);
});
