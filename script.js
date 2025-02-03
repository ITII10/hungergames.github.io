(() => {
    // Variables globals de la simulació
    let tributos = [];
    let diaOAltra = true;
    let ronda = 1;
  
    // Esdeveniments disponibles
    const events = {
      solo: [
        "{A} troba una font d'aigua potable i plora d’alegria.",
        "{A} intenta fer foc… i accidentalment es crema una cella.",
        "{A} es troba un esquirol i li explica la seva vida.",
        "{A} troba una motxilla misteriosa. Dins només hi ha mitjons molls.",
        "{A} es posa a cantar per passar el temps, però espanta tots els animals.",
        "{A} descobreix un arbre ple de fruita i menja fins que es cansa.",
        "{A} intenta construir una cabana però acaba amb una caiguda espectacular.",
        "{A} pensa en els seus éssers estimats i plora en silenci.",
        "{A} troba una arma però no sap com utilitzar-la.",
        "{A} descobreix un riu però gairebé s'ofega intentant pescar.",
        "{A} obre una peixeteria, peixos roger.",
        "{A} opina que la peixeteria local té molts bons peixos."
      ],
      mortals: [
        "{A} és assassinat per {B}, que ni tan sols s’immuta.",
        "{A} es baralla amb {B}, però perd i ara descansa eternament.",
        "{A} intenta treure una trampa... i acaba caient-hi de cap.",
        "{A} es menja unes baies… eren verinoses. Adéu!",
        "{A} es atava brutalment per unes avispes modificades genèticament.",
        "{A} traiciona a {B} però acaben tirant-lo per un penya-segat.",
        "{A} és atacat per un grup de llops i no ho explica.",
        "{A} cau d'un penya-segat mentre buscava refugi.",
        "{A} va a robar al campament de {B} que acaba devorant-lo.",
        "{B} llença un dard amb verí al cul de {A} que agonitza fins la mort.",
        "{A} anava caminant tranquil·lament quan es troba una motxilla d'on surt {B} amb una escopeta.",
        "{A} i {B} anaven caminant agafats de la mà quan a {A} li dona un atac al cor.",
        "{B} llepa a {A} fins la mort."
      ],
      beneficiosos: [
        "{A} roba menjar a {B}, però li deixa una nota de disculpa.",
        "{A} i {B} fan una aliança… però per quant de temps?",
        "{A} troba un paquet de supervivència, ara és el rei del campament!",
        "{A} i {B} es troben i decideixen ballar enmig de la selva per diversió.",
        "{A} ajuda a {B} a escalar un arbre per protegir-se dels perills.",
        "{A} i {B} comparteixen un àpat i parlen de les seves vides passades.",
        "{A} salva {B} d'una trampa mortal en l'últim moment."
      ]
    };
  
    // Esdeveniments actuals a utilitzar en la ronda
    let currentEvents = { solo: [], mortals: [], beneficiosos: [] };
  
    // Funció per barrejar un array (algoritme de Fisher-Yates)
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
  
    // Prepara i barreja els esdeveniments per a cada categoria
    const prepareEvents = () => {
      currentEvents.solo = [...events.solo];
      currentEvents.mortals = [...events.mortals];
      currentEvents.beneficiosos = [...events.beneficiosos];
      shuffleArray(currentEvents.solo);
      shuffleArray(currentEvents.mortals);
      shuffleArray(currentEvents.beneficiosos);
    };
  
    // Genera els inputs per als noms dels participants segons la quantitat seleccionada
    const generateInputs = () => {
      const numTributos = document.getElementById("numTributos").value;
      const tributeInputs = document.getElementById("tributeInputs");
      tributeInputs.innerHTML = "";
      for (let i = 0; i < numTributos; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Participant ${i + 1}`;
        input.id = `tributo-${i}`;
        tributeInputs.appendChild(input);
      }
    };
  
    // Inicialitza els tributs llegint els inputs i comprova que estiguin tots omplerts
    const initializeTributes = () => {
      const numTributos = document.getElementById("numTributos").value;
      tributos = [];
  
      for (let i = 0; i < numTributos; i++) {
        const input = document.getElementById(`tributo-${i}`);
        const nom = input.value.trim();
        if (!nom) {
          alert("Si us plau, omple tots els noms!");
          return;
        }
        tributos.push({ nom, viu: true, assassinats: 0 });
      }
  
      prepareEvents();
      document.getElementById("startButton").disabled = false;
      updateTributeStatus();
    };
  
    // Actualitza la secció de l'estat dels tributs en la interfície
    const updateTributeStatus = () => {
      const tributeStatus = document.getElementById("tributeStatus");
      tributeStatus.innerHTML = "";
      tributos.forEach(tributo => {
        const div = document.createElement("div");
        div.className = tributo.viu ? "tribute" : "tribute dead";
        div.innerHTML = `
          <strong>${tributo.nom}</strong><br>
          Estat: ${tributo.viu ? "Viu" : "Mort"}<br>
          Baixes: ${tributo.assassinats}
        `;
        tributeStatus.appendChild(div);
      });
    };
  
    // Processa un esdeveniment mortal, actualitzant l'estat de la víctima i el rival si escau
    const processMortalEvent = (victim, rival, log) => {
      const mortalEvent = currentEvents.mortals.pop();
      let eventMessage = mortalEvent;
  
      // Si l'esdeveniment requereix un rival ({B}) i n'hi ha, actualitza l'estat
      if (mortalEvent.includes("{B}") && rival) {
        victim.viu = false;
        rival.assassinats++;
        eventMessage = mortalEvent
          .replaceAll("{A}", `<span style="color: orange; font-weight: bold;">${victim.nom}</span>`)
          .replaceAll("{B}", `<span style="color: orange; font-weight: bold;">${rival.nom}</span>`);
      } else {
        victim.viu = false;
        eventMessage = mortalEvent.replaceAll("{A}", `<span style="color: orange; font-weight: bold;">${victim.nom}</span>`);
      }
      log.innerHTML += `<p>${eventMessage}</p>`;
    };
  
    // Inicia una ronda de la simulació
    const startRound = () => {
      // Si s'han esgotat els esdeveniments 'solo', es prepara de nou
      if (currentEvents.solo.length === 0) prepareEvents();
  
      const log = document.getElementById("eventLog");
      log.innerHTML = `<h3>${diaOAltra ? "Dia" : "Nit"} ${Math.ceil(ronda / 2)}</h3>`;
  
      // Seleccionem els tributs vius i els barregem
      const liveTributes = tributos.filter(t => t.viu);
      shuffleArray(liveTributes);
      const alreadyAppeared = new Set();
  
      // Determinem el nombre de morts en aquesta ronda segons el mode de joc
      const mode = tributos.length;
      const deathCount = mode === 12 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1;
      const victims = liveTributes.slice(0, deathCount);
  
      // Processa els esdeveniments mortals per a cada víctima
      victims.forEach(victim => {
        alreadyAppeared.add(victim);
        let rival = null;
        // Comprova si l'esdeveniment requereix un rival
        if (currentEvents.mortals.length > 0) {
          const candidateEvent = currentEvents.mortals[currentEvents.mortals.length - 1];
          if (candidateEvent.includes("{B}")) {
            const potentialRivals = liveTributes.filter(t => !alreadyAppeared.has(t));
            if (potentialRivals.length > 0) {
              rival = potentialRivals[Math.floor(Math.random() * potentialRivals.length)];
              alreadyAppeared.add(rival);
            }
          }
        }
        processMortalEvent(victim, rival, log);
      });
  
      // Processa esdeveniments 'solo' per aquells que encara no han participat
      liveTributes.forEach(tributo => {
        if (!alreadyAppeared.has(tributo)) {
          if (currentEvents.solo.length > 0) {
            const soloEvent = currentEvents.solo.pop().replaceAll(
              "{A}",
              `<span style="color: orange; font-weight: bold;">${tributo.nom}</span>`
            );
            log.innerHTML += `<p>${soloEvent}</p>`;
            alreadyAppeared.add(tributo);
          }
        }
      });
  
      updateTributeStatus();
  
      // Comprova si només queda un tribut viu per declarar el guanyador
      const viusRestants = tributos.filter(t => t.viu);
      if (viusRestants.length === 1) {
        log.innerHTML += `<h2>${viusRestants[0].nom} és el guanyador!</h2>`;
        document.getElementById("nextButton").style.display = "none";
        document.getElementById("startButton").style.display = "none";
        return;
      }
  
      // Amaga el botó de "Comença la ronda" i mostra el de "Següent Ronda"
      document.getElementById("startButton").style.display = "none";
      document.getElementById("nextButton").style.display = "inline";
    };
  
    // Prepara la següent ronda alternant entre dia i nit
    const nextRound = () => {
      diaOAltra = !diaOAltra;
      ronda++;
      startRound();
    };
  
    // Afegeix els event listeners als botons un cop el DOM estigui carregat
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("numTributos").addEventListener("change", generateInputs);
      document.getElementById("startButton").addEventListener("click", startRound);
      document.getElementById("nextButton").addEventListener("click", nextRound);
    });
  
    // Exposa les funcions d'inicialització per a poder ser cridades des de l'HTML si cal
    window.generateInputs = generateInputs;
    window.initializeTributes = initializeTributes;
  })();
  