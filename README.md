# Social-Post-Location

**Funzionamento**

Creare un applicazione web per la geolocalizzazione e memorizzazione dei post Facebook e Instagram. Nell’applicazione sarà possibile inserire o il nome di una location o delle coordinate e scegliere il social network di cui si vogliono visualizzare i post. Una volta inseriti questi due campi sarà possibile visualizzare su una mappa la posizione dei post nelle vicinanze della location scelta. Ogni nuova ricerca inserisce nel database i post scaricati

**Caso d’uso utente**
	
L’utente apre l’applicazione web
L’utente decide di fare una nuova ricerca
L’utente inserisce come location una città
L’utente sceglie un social network tra Instagram e Facebook
L’utente fa partire ricerca
Sulla mappa vengono visualizzati dei puntatori relativi alle coordinate dei post appena trovati
L’utente può visualizzare le informazioni di un post cliccando sul puntatore

**Caso d’uso sistema**

Il sistema riceve richiesta per una nuova ricerca
Il sistema effettua una richiesta al social inviando o la location o le coordinate inserite dall’utente
Il sistema mostra all’utente i post restituiti dal social in un certo range
Il sistema memorizza i post appena mostrati nel database


