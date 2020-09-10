// Import stylesheets
import './style.css';

// Write Javascript code!

const promesa = fetch('https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json').then(respuesta => {
  return respuesta.json();
}).then(datos => {
  
  // Tabla parte A
  var tabla = document.getElementsByClassName('table')[0];

  for (var i in datos){
    //Fila
    var tr = document.createElement('tr');         

    //Columna posición
    var posicion = document.createElement('td');
    var x = document.createTextNode(parseInt(i)+1);
    posicion.style.fontWeight='bold';
    posicion.appendChild(x);
    tr.appendChild(posicion);

    //Columna Eventos
    var eventos = document.createElement('td');
    var dato = document.createTextNode(datos[i].events.join(', '));
    eventos.appendChild(dato);
    tr.appendChild(eventos);

    //Columna Squirrel
    var ardilla = document.createElement('td');
    var datArdilla = document.createTextNode(datos[i].squirrel);
    if (datos[i].squirrel === true){
      tr.style.background='Pink';
    }
    ardilla.appendChild(datArdilla);
    tr.appendChild(ardilla);
    tabla.appendChild(tr);
  }

  // Tabla parte B
  var tabla2 = document.getElementsByClassName('table')[1];

  //Función para calcular el coeficiente de correlación de Matthews
  function MCC(matrix){
    let tN = matrix[0]; //True Negatives
    let fN = matrix[1]; //False Negatives
    let fP = matrix[2]; //False Positives
    let tP = matrix[3]; //True Positives
    return (tP * tN - fP * fN)/Math.sqrt( (tP + fP )*( tP + fN)*(tN + fP)*(tN + fN));
  }

  //Función para calcular los falsos positivos, falsos negativos, verdaderos positivos y verdaderos negativos y devolver el MCC
  function calculate(evento)
  {
    var matrix = [0,0,0,0]
    datos.forEach(fila=>{
      var index = 0; //True Negative
      var found = fila.events.some(event => event === evento);
      if (found && fila.squirrel){ //True Positive
        index = 3;
      }
      else if (found && !fila.squirrel) //False Negative
      {
        index=1;
      }
      else if(fila.squirrel && !found) //False positive
      {
        index=2;
      }
      matrix[index]+=1;
    });
    return MCC(matrix);
  }

  //Variable para guardar evento y MCC
  var parejas = []
  //Calculo la MCC para cada evento
  datos.forEach(fila=>{
    fila.events.forEach(evento=>{
      var act = {
        'event':evento,
        'MCC':calculate(evento)
      };
      var found = parejas.some(pareja => pareja.event === evento);
      if(!found)
      {
        parejas.push(act);
      }
    });
  });
  
  //Para ordenar descendentemente por MCC
  parejas = parejas.sort(function (a, b) {
    if (a.MCC > b.MCC) {
      return -1;
    }
    if (a.MCC < b.MCC) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  //Lleno la tabla
  for (var i in parejas){
    //Fila
    var tr = document.createElement('tr');         

    //Columna posición
    var posicion = document.createElement('td');
    var x = document.createTextNode(parseInt(i)+1);
    posicion.style.fontWeight='bold';
    posicion.appendChild(x);
    tr.appendChild(posicion);

    //Columna Evento
    var evento = document.createElement('td');
    var dato = document.createTextNode(parejas[i].event);
    evento.appendChild(dato);
    tr.appendChild(evento);

    //Columna correlación
    var corr = document.createElement('td');
    var valor = document.createTextNode(parejas[i].MCC);
    corr.appendChild(valor);
    tr.appendChild(corr);
    tabla2.appendChild(tr);
  }   
    
  });
  