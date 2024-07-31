<template>
  <header class="border-b border-dotted border-slate-700 pb-5">
    <h1 class="text-2xl text-slate-700">
      Privacy Policy di
      <span class="font-bold">playground.brevia.app</span>
    </h1>
    <h2 class="text-xs text-slate-400 mt-2">Questa Applicazione raccoglie alcuni Dati Personali dei propri Utenti.</h2>
  </header>
  <div v-if="!showCompletePP">
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5">
      <p class="font-bold text-slate-700">Dati Personali trattati per le seguenti finalità e utilizzando i seguenti servizi:</p>
      <div class="grid grid-cols-2 mt-4">
        <div class="flex flex-row">
          <div>
            <Icon name="ph:file-fill" class="text-3xl mr-3 text-slate-600" />
          </div>
          <div class="text-sm flex flex-col space-y-2">
            <p class="font-bold">Registrazione ed autenticazione fornite direttamente da questa Applicazione</p>
            <div>
              <p class="font-bold">Registrazione diretta</p>
              <p>Dati Personali: cognome; email; nome; settore di attività</p>
            </div>
          </div>
        </div>
        <div class="flex flex-row">
          <div>
            <Icon name="ph:file-fill" class="text-3xl mr-3 text-slate-600" />
          </div>
          <div class="text-sm flex flex-col space-y-2">
            <p class="font-bold">Trasferimento di Dati al di fuori della UE</p>
            <div>
              <p class="font-bold">
                Trasferimento di Dati verso paesi che garantiscono standard europei e Trasferimento verso paesi terzi sulla base di clausole contrattuali tipo
              </p>
              <p>Dati Personali: varie tipologie di Dati</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5">
      <p class="font-bold text-slate-700">Informazioni di contatto</p>
      <div class="grid grid-cols-2 mt-4">
        <div class="flex flex-row">
          <div>
            <Icon name="ph:user-list" class="text-slate-600 text-3xl mr-3" />
          </div>
          <div class="text-sm flex flex-col space-y-2">
            <p class="font-bold">Titolare del Trattamento dei Dati</p>
            <p>Atlas Srl, viale XXI Aprile 61, 00162 – Roma (RM)</p>
            <p>
              <span class="font-bold">Indirizzo email del Titolare:</span>
              info@atlasconsulting.it
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm">
      <h1 class="font-bold text-lg">Titolare del Trattamento dei Dati</h1>
      <p>Atlas Srl, viale XXI Aprile 61, 00162 – Roma (RM)</p>
      <p><span class="font-bold">Indirizzo email del Titolare:</span>info@atlasconsulting.it</p>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm">
      <h1 class="font-bold text-lg">Tipologie di Dati raccolti</h1>
      <p>
        Fra i Dati Personali raccolti da questa Applicazione, in modo autonomo o tramite terze parti, ci sono: nome; cognome; email; settore di attività; varie
        tipologie di Dati.
      </p>
      <br />
      <p>
        Dettagli completi su ciascuna tipologia di Dati Personali raccolti sono forniti nelle sezioni dedicate di questa privacy policy o mediante specifici
        testi informativi visualizzati prima della raccolta dei Dati stessi.
      </p>
      <p>
        I Dati Personali possono essere liberamente forniti dall'Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questa
        Applicazione.
      </p>
      <p>
        Se non diversamente specificato, tutti i Dati richiesti da questa Applicazione sono obbligatori. Se l’Utente rifiuta di comunicarli, potrebbe essere
        impossibile per questa Applicazione fornire il Servizio. Nei casi in cui questa Applicazione indichi alcuni Dati come facoltativi, gli Utenti sono
        liberi di astenersi dal comunicare tali Dati, senza che ciò abbia alcuna conseguenza sulla disponibilità del Servizio o sulla sua operatività.
      </p>
      <p>Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono incoraggiati a contattare il Titolare.</p>
      <p>
        L’eventuale utilizzo di Cookie - o di altri strumenti di tracciamento - da parte di questa Applicazione o dei titolari dei servizi terzi utilizzati da
        questa Applicazione ha la finalità di fornire il Servizio richiesto dall'Utente, oltre alle ulteriori finalità descritte nel presente documento e nella
        Cookie Policy.
      </p>
      <br />
      <p>L'Utente si assume la responsabilità dei Dati Personali di terzi ottenuti, pubblicati o condivisi mediante questa Applicazione.</p>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Modalità e luogo del trattamento dei Dati raccolti</h1>
      <div>
        <h3 class="font-bold">Modalità di trattamento</h3>
        <p>
          Il Titolare adotta le opportune misure di sicurezza volte ad impedire l’accesso, la divulgazione, la modifica o la distruzione non autorizzate dei
          Dati Personali.
        </p>
        <p>
          Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle
          finalità indicate. Oltre al Titolare, in alcuni casi, potrebbero avere accesso ai Dati altri soggetti coinvolti nell’organizzazione di questa
          Applicazione (personale amministrativo, commerciale, marketing, legali, amministratori di sistema) ovvero soggetti esterni (come fornitori di servizi
          tecnici terzi, corrieri postali, hosting provider, società informatiche, agenzie di comunicazione) nominati anche, se necessario, Responsabili del
          Trattamento da parte del Titolare. L’elenco aggiornato dei Responsabili potrà sempre essere richiesto al Titolare del Trattamento.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Luogo</h3>
        <p>
          I Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate. Per
          ulteriori informazioni, contatta il Titolare
        </p>
        <p>
          I Dati Personali dell’Utente potrebbero essere trasferiti in un paese diverso da quello in cui l’Utente si trova. Per ottenere ulteriori informazioni
          sul luogo del trattamento l’Utente può fare riferimento alla sezione relativa ai dettagli sul trattamento dei Dati Personali.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Periodo di conservazione</h3>
        <p>
          Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono
          stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli
          Utenti.
        </p>
      </div>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Finalità del Trattamento dei Dati raccolti</h1>
      <p>
        I Dati dell’Utente sono raccolti per consentire al Titolare di fornire il Servizio, adempiere agli obblighi di legge, rispondere a richieste o azioni
        esecutive, tutelare i propri diritti ed interessi (o quelli di Utenti o di terze parti), individuare eventuali attività dolose o fraudolente, nonché per
        le seguenti finalità: Registrazione ed autenticazione fornite direttamente da questa Applicazione e Trasferimento di Dati al di fuori della UE.
      </p>
      <p>
        Per ottenere informazioni dettagliate sulle finalità del trattamento e sui Dati Personali trattati per ciascuna finalità, l’Utente può fare riferimento
        alla sezione “Dettagli sul trattamento dei Dati Personali”.
      </p>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Dettagli sul trattamento dei Dati Personali</h1>
      <p>I Dati Personali sono raccolti per le seguenti finalità ed utilizzando i seguenti servizi:</p>
      <div class="border-slate-900 border flex flex-col space-y-4">
        <div class="m-1 hover:cursor-pointer" @click="showRegistration = !showRegistration">
          <Icon name="ph:file-fill" class="text-3xl" />
          <span class="font-bold mr-4">Registrazione ed autenticazione fornite direttamente da questa Applicazione</span>
          <Icon :name="!showRegistration ? 'ph:caret-down' : 'ph:caret-up'" />
        </div>
        <transition name="grow-shrink">
          <div v-if="showRegistration" class="mx-2 pb-4 space-y-4">
            <p>
              Con la registrazione o l’autenticazione l’Utente consente a questa Applicazione di identificarlo e di dargli accesso a servizi dedicati. I Dati
              Personali sono raccolti e conservati esclusivamente a scopo di registrazione o di identificazione. I Dati raccolti sono solo quelli necessari a
              fornire il servizio richiesto dall’Utente.
            </p>
            <p>Registrazione diretta (questa Applicazione)</p>
            <p class="font-bold">
              L’Utente si registra compilando il modulo di registrazione e fornendo direttamente a questa Applicazione i propri Dati Personali.
            </p>
            <p>Dati Personali trattati: cognome; email; nome; settore di attività.</p>
          </div>
        </transition>
      </div>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Cookie Policy</h1>
      <p>
        Questa Applicazione fa utilizzo di Strumenti di Tracciamento. Per saperne di più, gli Utenti possono consultare la
        <NuxtLink to="/privacy/cookie-policy">Cookie Policy</NuxtLink>.
      </p>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Ulteriori informazioni per gli utenti</h1>
      <div>
        <h3 class="font-bold">Base giuridica del trattamento</h3>
        <p class="mb-3">Il Titolare tratta Dati Personali relativi all’Utente in caso sussista una delle seguenti condizioni:</p>
        <ul class="mb-3 list-disc ml-8">
          <li>
            l’Utente ha prestato il consenso per una o più finalità specifiche; Nota: in alcuni ordinamenti il Titolare può essere autorizzato a trattare Dati
            Personali senza che debba sussistere il consenso dell’Utente o un’altra delle basi giuridiche specificate di seguito, fino a quando l’Utente non si
            opponga (“opt-out”) a tale trattamento. Ciò non è tuttavia applicabile qualora il trattamento di Dati Personali sia regolato dalla legislazione
            europea in materia di protezione dei Dati Personali;
          </li>
          <li>il trattamento è necessario all'esecuzione di un contratto con l’Utente e/o all'esecuzione di misure precontrattuali;</li>
          <li>il trattamento è necessario per adempiere un obbligo legale al quale è soggetto il Titolare;</li>
          <li>
            il trattamento è necessario per l'esecuzione di un compito di interesse pubblico o per l'esercizio di pubblici poteri di cui è investito il
            Titolare;
          </li>
          <li>il trattamento è necessario per il perseguimento del legittimo interesse del Titolare o di terzi.</li>
        </ul>
        <p>
          È comunque sempre possibile richiedere al Titolare di chiarire la concreta base giuridica di ciascun trattamento ed in particolare di specificare se
          il trattamento sia basato sulla legge, previsto da un contratto o necessario per concludere un contratto.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Ulteriori informazioni sul tempo di conservazione</h3>
        <p class="mb-3">
          Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono
          stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli
          Utenti.
        </p>
        <p class="mb-3">Pertanto:</p>
        <ul class="mb-3 list-disc ml-8">
          <li>
            I Dati Personali raccolti per scopi collegati all’esecuzione di un contratto tra il Titolare e l’Utente saranno trattenuti sino a quando sia
            completata l’esecuzione di tale contratto.
          </li>
          <li>
            I Dati Personali raccolti per finalità riconducibili all’interesse legittimo del Titolare saranno trattenuti sino al soddisfacimento di tale
            interesse. L’Utente può ottenere ulteriori informazioni in merito all’interesse legittimo perseguito dal Titolare nelle relative sezioni di questo
            documento o contattando il Titolare.
          </li>
        </ul>
        <p class="mb-6">
          Quando il trattamento è basato sul consenso dell’Utente, il Titolare può conservare i Dati Personali più a lungo sino a quando detto consenso non
          venga revocato. Inoltre, il Titolare potrebbe essere obbligato a conservare i Dati Personali per un periodo più lungo in ottemperanza ad un obbligo di
          legge o per ordine di un’autorità.
        </p>
        <p>
          Al termine del periodo di conservazione i Dati Personali saranno cancellati. Pertanto, allo spirare di tale termine il diritto di accesso,
          cancellazione, rettificazione ed il diritto alla portabilità dei Dati non potranno più essere esercitati.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Diritti dell’Utente</h3>
        <p class="mb-6">Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare.</p>
        <p class="mb-3">In particolare, nei limiti previsti dalla legge, l’Utente ha il diritto di:</p>
        <ul class="mb-3 list-disc ml-8">
          <li>
            <strong>revocare il consenso in ogni momento.</strong>
            L’Utente può revocare il consenso al trattamento dei propri Dati Personali precedentemente espresso.
          </li>
          <li>
            <strong>opporsi al trattamento dei propri Dati.</strong>
            L’Utente può opporsi al trattamento dei propri Dati quando esso avviene in virtù di una base giuridica diversa dal consenso.
          </li>
          <strong>accedere ai propri Dati.</strong>
          L’Utente ha diritto ad ottenere informazioni sui Dati trattati dal Titolare, su determinati aspetti del trattamento ed a ricevere una copia dei Dati
          trattati.
          <li>
            <strong>verificare e chiedere la rettificazione.</strong>
            L’Utente può verificare la correttezza dei propri Dati e richiederne l’aggiornamento o la correzione.
          </li>
          <li>
            <strong>ottenere la limitazione del trattamento.</strong>
            L’Utente può richiedere la limitazione del trattamento dei propri Dati. In tal caso il Titolare non tratterà i Dati per alcun altro scopo se non la
            loro conservazione.
          </li>
          <li>
            <strong>ottenere la cancellazione o rimozione dei propri Dati Personali.</strong>
            L’Utente può richiedere la cancellazione dei propri Dati da parte del Titolare.
          </li>
          <li>
            <strong>ricevere i propri Dati o farli trasferire ad altro titolare.</strong>
            L’Utente ha diritto di ricevere i propri Dati in formato strutturato, di uso comune e leggibile da dispositivo automatico e, ove tecnicamente
            fattibile, di ottenerne il trasferimento senza ostacoli ad un altro titolare.
          </li>
          <li>
            <strong>proporre reclamo.</strong> L’Utente può proporre un reclamo all’autorità di controllo della protezione dei dati personali competente o agire
            in sede giudiziale.
          </li>
        </ul>
        <p>
          Gli Utenti hanno diritto di ottenere informazioni in merito alla base giuridica per il trasferimento di Dati all'estero incluso verso qualsiasi
          organizzazione internazionale regolata dal diritto internazionale o costituita da due o più paesi, come ad esempio l’ONU, nonché in merito alle misure
          di sicurezza adottate dal Titolare per proteggere i loro Dati.
        </p>
      </div>
      <div class="font-bold">
        <h3 class="mb-3">Dettagli sul diritto di opposizione</h3>
        <p class="mb-3">
          Quando i Dati Personali sono trattati nell’interesse pubblico, nell’esercizio di pubblici poteri di cui è investito il Titolare oppure per perseguire
          un interesse legittimo del Titolare, gli Utenti hanno diritto ad opporsi al trattamento per motivi connessi alla loro situazione particolare.
        </p>
        <p>
          Si fa presente agli Utenti che, ove i loro Dati fossero trattati con finalità di marketing diretto, possono opporsi al trattamento in qualsiasi
          momento, gratuitamente e senza fornire alcuna motivazione. Qualora gli Utenti si oppongano al trattamento per finalità di marketing diretto, i Dati
          Personali non sono più oggetto di trattamento per tali finalità. Per scoprire se il Titolare tratti Dati con finalità di marketing diretto gli Utenti
          possono fare riferimento alle rispettive sezioni di questo documento.
        </p>
      </div>
      <div>
        <h3 class="mb-3 font-bold">Come esercitare i diritti</h3>
        <p>
          Per esercitare i propri diritti, gli Utenti possono indirizzare una richiesta ai recapiti del Titolare indicati in questo documento. La richiesta può
          essere depositate gratuitamente e il Titolare risponderà nel più breve tempo possibile, in ogni caso entro un mese, fornendo all’Utente tutte le
          informazioni previste dalla legge. Eventuali rettifiche, cancellazioni o limitazioni del trattamento saranno comunicate dal Titolare a ciascuno dei
          destinatari, se esistenti, a cui sono stati trasmessi i Dati Personali, salvo che ciò si riveli impossibile o implichi uno sforzo sproporzionato. Il
          Titolare comunica all'Utente tali destinatari qualora egli lo richieda.
        </p>
      </div>
      <div>
        <h3 class="mb-3 font-bold">Trasferimento di dati personali al di fuori dell'Unione Europea</h3>
        <h3 class="mb-3 font-bold">Trasferimento di Dati verso paesi che garantiscono standard europei</h3>
        <p class="mb-3">
          Quando questa è la base giuridica, il trasferimento di Dati Personali dalla UE in paesi terzi avviene in base ad una decisione d’adeguatezza adottata
          dalla Commissione Europea. La Commissione Europea adotta decisioni di adeguatezza con riferimento a singoli paesi terzi che ritiene garantire un
          livello di protezione dei Dati Personali paragonabile a quello previsto dalla legislazione Europea in materia di protezione di Dati Personali.
          L’Utente può visionare la lista aggiornata delle decisioni di adeguatezza sul sito internet della Commissione Europea.
        </p>
        <h3 class="mb-3 font-bold">Trasferimento verso paesi terzi sulla base di clausole contrattuali tipo</h3>
        <p>
          Quando questa è la base giuridica, il trasferimento di Dati Personali dalla UE verso paesi terzi avviene sulla base di clausole tipo di protezione dei
          Dati Personali adottate dalla Commissione Europea.
        </p>
        <p>
          In tali casi i destinatari dei Dati hanno accettato di trattare i Dati Personali in conformità con i livelli di protezione previsti dalla normativa
          UE. Gli Utenti possono richiedere ulteriori informazioni contattando il Titolare agli estremi indicati nel presente documento.
        </p>
      </div>
    </div>
    <div class="mt-4 border-b border-dotted border-slate-700 pb-5 text-sm flex flex-col space-y-4">
      <h1 class="font-bold text-lg">Ulteriori informazioni sul trattamento</h1>
      <div>
        <h3 class="font-bold">Difesa in giudizio</h3>
        <p>
          I Dati Personali dell’Utente possono essere utilizzati da parte del Titolare in giudizio o nelle fasi preparatorie alla sua eventuale instaurazione
          per la difesa da abusi nell'utilizzo di questa Applicazione o dei Servizi connessi da parte dell’Utente. L’Utente dichiara di essere consapevole che
          il Titolare potrebbe essere obbligato a rivelare i Dati per ordine delle autorità pubbliche.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Informative specifiche</h3>
        <p>
          Su richiesta dell’Utente, in aggiunta alle informazioni contenute in questa privacy policy, questa Applicazione potrebbe fornire all'Utente delle
          informative aggiuntive e contestuali riguardanti Servizi specifici, o la raccolta ed il trattamento di Dati Personali.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Log di sistema e manutenzione</h3>
        <p>
          Per necessità legate al funzionamento ed alla manutenzione, questa Applicazione e gli eventuali servizi terzi da essa utilizzati potrebbero
          raccogliere log di sistema, ossia file che registrano le interazioni e che possono contenere anche Dati Personali, quali l’indirizzo IP Utente
        </p>
      </div>
      <div>
        <h3 class="font-bold">Informazioni non contenute in questa policy</h3>
        <p>
          Ulteriori informazioni in relazione al trattamento dei Dati Personali potranno essere richieste in qualsiasi momento al Titolare del Trattamento
          utilizzando gli estremi di contatto.
        </p>
      </div>
      <div>
        <h3 class="font-bold">Modifiche a questa privacy policy</h3>
        <p>
          Il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento notificandolo agli Utenti
          su questa pagina e, se possibile, su questa Applicazione nonché, qualora tecnicamente e legalmente fattibile, inviando una notifica agli Utenti
          attraverso uno degli estremi di contatto di cui è in possesso. Si prega dunque di consultare con frequenza questa pagina, facendo riferimento alla
          data di ultima modifica indicata in fondo.
        </p>
      </div>
      <p>
        Qualora le modifiche interessino trattamenti la cui base giuridica è il consenso, il Titolare provvederà a raccogliere nuovamente il consenso
        dell’Utente, se necessario
      </p>
    </div>
    <div class="border-slate-900 border flex flex-col space-y-4">
      <div class="m-1 hover:cursor-pointer" @click="showLegalRef = !showLegalRef">
        <Icon name="ph:bookmark-simple-fill" class="text-3xl" />
        <span class="font-bold mr-4">Definizioni e riferimenti legali</span>
        <Icon :name="!showLegalRef ? 'ph:caret-down' : 'ph:caret-up'" />
      </div>
      <transition name="grow-shrink">
        <div v-if="showLegalRef" class="mx-2 pb-4 space-y-4 text-sm">
          <h3 class="font-bold">Dati Personali (o Dati)</h3>
          <p>
            Costituisce dato personale qualunque informazione che, direttamente o indirettamente, anche in collegamento con qualsiasi altra informazione, ivi
            compreso un numero di identificazione personale, renda identificata o identificabile una persona fisica.
          </p>
          <h3 class="font-bold">Dati di Utilizzo</h3>
          <p>
            Sono le informazioni raccolte automaticamente attraverso questa Applicazione (anche da applicazioni di parti terze integrate in questa
            Applicazione), tra cui: gli indirizzi IP o i nomi a dominio dei computer utilizzati dall’Utente che si connette con questa Applicazione, gli
            indirizzi in notazione URI (Uniform Resource Identifier), l’orario della richiesta, il metodo utilizzato nell’inoltrare la richiesta al server, la
            dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta dal server (buon fine, errore, ecc.) il paese di
            provenienza, le caratteristiche del browser e del sistema operativo utilizzati dal visitatore, le varie connotazioni temporali della visita (ad
            esempio il tempo di permanenza su ciascuna pagina) e i dettagli relativi all’itinerario seguito all’interno dell’Applicazione, con particolare
            riferimento alla sequenza delle pagine consultate, ai parametri relativi al sistema operativo e all’ambiente informatico dell’Utente.
          </p>
          <h3 class="font-bold">Utente</h3>
          <p>L'individuo che utilizza questa Applicazione che, salvo ove diversamente specificato, coincide con l'Interessato.</p>
          <h3 class="font-bold">Interessato</h3>
          <p>La persona fisica cui si riferiscono i Dati Personali.</p>
          <h3 class="font-bold">Responsabile del Trattamento (o Responsabile)</h3>
          <p>
            La persona fisica, giuridica, la pubblica amministrazione e qualsiasi altro ente che tratta dati personali per conto del Titolare, secondo quanto
            esposto nella presente privacy policy.
          </p>
          <h3 class="font-bold">Titolare del Trattamento (o Titolare)</h3>
          <p>
            La persona fisica o giuridica, l'autorità pubblica, il servizio o altro organismo che, singolarmente o insieme ad altri, determina le finalità e i
            mezzi del trattamento di dati personali e gli strumenti adottati, ivi comprese le misure di sicurezza relative al funzionamento ed alla fruizione di
            questa Applicazione. Il Titolare del Trattamento, salvo quanto diversamente specificato, è il titolare di questa Applicazione.
          </p>
          <h3 class="font-bold">Questa Applicazione</h3>
          <p>Lo strumento hardware o software mediante il quale sono raccolti e trattati i Dati Personali degli Utenti.</p>
          <h3 class="font-bold">Servizio</h3>
          <p>Il Servizio fornito da questa Applicazione così come definito nei relativi termini (se presenti) su questo sito/applicazione.</p>
          <h3 class="font-bold">Unione Europea (o UE)</h3>
          <p>
            Salvo ove diversamente specificato, ogni riferimento all’Unione Europea contenuto in questo documento si intende esteso a tutti gli attuali stati
            membri dell’Unione Europea e dello Spazio Economico Europeo.
          </p>
          <h3 class="pt-2 border-top border-dotted border-slate-700">Riferimenti legali</h3>
          <p>Ove non diversamente specificato, questa informativa privacy riguarda esclusivamente questa Applicazione.</p>
        </div>
      </transition>
    </div>
  </div>
  <footer class="flex flex-row justify-between">
    <button class="text-sm text-slate-600" @click="showCompletePP = !showCompletePP">
      <span v-if="!showCompletePP">Visualizza </span>
      <span v-else>Nascondi </span>
      la Privacy Policy Completa
    </button>
    <NuxtLink class="text-sm text-slate-600" to="/privacy/privacy-policy-49496944.pdf" target="_blank">Scarica il PDF</NuxtLink>
  </footer>
</template>

<script setup lang="ts">
const showCompletePP = ref(false);
const showRegistration = ref(false);
const showLegalRef = ref(false);
</script>

<style>
.grow-shrink-enter-from,
.grow-shrink-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.grow-shrink-enter-active,
.grow-shrink-leave-active {
  transition: all 0.2s ease-in-out;
}
</style>
