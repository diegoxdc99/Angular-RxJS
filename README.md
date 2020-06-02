# Angular-RxJS
Find the associated Pluralsight course here: https://app.pluralsight.com/library/courses/rxjs-angular-reactive-development

`APM-Start`: The starter files for the course. **Use this to code along with the course**.

`APM-Final`: The completed files. Use this to see the completed solution from the course.

`APM-WithExtras`: The completed files with some extra code. Use this to see some additional techniques not included in the course.

I've developed a few additional examples, including using action streams to "pass" parameters and retrieving multiple related datasets here: https://stackblitz.com/edit/angular-todos-deborahk


NOTAS:
- Al usar en el template del html el pipe async se subscribe y desuscribe
- Al manejar los errores se puede manejar de dos formas
    - Capturar y reemplazar: De esta forma devuelve un nuevo observable y ejecuta el metodo next y finaliza el flujo de datos
    - Capturar y lanzar: De esta forma lanza otro error usando throwError
- Operadores
    - Map: transforma el objeto
    - Tap: sirve para cuando no se necesita manipular el flujo de datos y se necesitan efectos colaterales en el código (aumentar el contador o hacer logs)
    - catchError: captura un error
    - take: toma n cantidad de elementos, una vez lo alcance completa el flujo de datos y ya no recibe mas
    - withLatestFrom: toma un observable fuente y lo combiona con mas observables pero solo emite cuando la fuente lo hace. cuando la fuente emite toma el ultimo valor de los observables del withLatestFrom, no emite hasta que todos los flujos lo hagan almenos una vez. Se usa solo cuando se necesita reaccionar a una fuente de datos
    - startWith: provee un valor inicial (similar al behaviorSubject)
    - shareReplay: cachea la información, obtiene los ultimos valores emitidos segun el valor que se ponga como parametro

- Creacionales (Unir uniformación)
    - combineLatest: toma varios observables y los combina en un nuevo flujo el ultimo valor emitido por ellos, no funciona hasta que se haya emitido almenos un valor en todos los flujos. se completa cuando todos los flujos de entrada estén completos. Util para usar con datos y filtros como flujos independientes.
    - forkJoin: solo toma el ultimo elemento de los diferentes flujos de datos (cuando todos los flujos de entrada estén completos). Util para juntar varias peticiones HTTP, no se debe de usar con flujos que no se completen como las acciones.
    - merge: obtiene todos los observables de entrada y emite cada valor individual en un solo flujo
    - scan: acumula los observables de entrada