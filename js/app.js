





function cambiosVisualesCarga(e){
  document.querySelector('#progress').style.visibility = 'visible';
    setInterval(() => {
      document.querySelector('.progress-bar').style.width = '100%';
    }, 100);
    setTimeout(() => {
      document.querySelector('#progress').style.visibility = 'hidden';
    }, 500);
    document.getElementById('icono-archivo').className = 'bi bi-file-earmark-spreadsheet';    
    document.getElementById('texto-archivo').innerText = `${e.target.files[0].name}`;  
    document.querySelector('i').style.color = 'green';
}

function pintarDatosEjemplo(arreglo){
  //console.log(arreglo);
  let contador = 0;
  let texto = '';
  for (let i = 0; i < arreglo.length; i++) {
    contador++;    
    texto += `
            <tr>
              <th scope="row">${arreglo[i]['Nomenclatura Estandarizada']}</th>
              <td>${arreglo[i]['Latitud (decimal)']}</td>
              <td>${arreglo[i]['Longitud (decimal)']}</td>
              <td>......</td>
              <td>${arreglo[i]['Altura Elipsoidal']}</td>
            </tr>
            `;
    if(contador >= 4) break;
  }
  
  document.getElementById('tablaEntrada').innerHTML = texto;
}

function pintarDatosSalida(arreglo){
  console.log(arreglo[0].estacion.identificador);
  console.log(arreglo[0].status);
  let tamanoTotal = arreglo.length;
  let correctos = 0;

  let texto = '';
  for (let i = 0; i < arreglo.length; i++) {
    arreglo[i].status ? correctos++ : null;
    texto += `
            <tr>
            <th scope="row">${arreglo[i].estacion.t_id}</th>       
              <th scope="row">${arreglo[i].estacion.identificador}</th>             
              <td>${arreglo[i].status ? '<span class="green">Guardado con exito</span>' : '<span class="red">Error al guardar</span>'}</td>
            </tr>
            `;    
  }
  Swal.fire(
    `Proceso finalizado <p>${correctos} de ${tamanoTotal} Completados.</p>`,
    'That thing is still around?',
    'info'
  );
  document.getElementById('tablaSalida').innerHTML = texto;
}




document.querySelector('#cargarExcel').addEventListener('change', (e) => {
  if(e.target.files.length)  {
    cambiosVisualesCarga(e);
  }
    console.log('cargarExcel');
    const input = document.getElementById('cargarExcel');

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Ahora puedes trabajar con el libro y sus hojas de cálculo
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    
    // Por ejemplo, puedes convertir la hoja en un JSON
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    //console.log(jsonData);
    pintarDatosEjemplo(jsonData);
  };

  reader.readAsArrayBuffer(file);
});


document.querySelector('#btnCargarExcel').addEventListener('click', () => {
  
  const input = document.getElementById('cargarExcel');

  if(!input.files[0]) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Ahora puedes trabajar con el libro y sus hojas de cálculo
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    
    // Por ejemplo, puedes convertir la hoja en un JSON
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    //console.log(jsonData);    
    enviarDatosAlServidor(jsonData);
  };

  reader.readAsArrayBuffer(file);
});


async function enviarDatosAlServidor(arreglo){

  document.querySelector('#btnCargarExcel').disabled = true;
  document.querySelector('#btnCargarExcel').innerHTML = ` <span class="sr-only">Loading...</span>  <div class="spinner-border" role="status"> </div> `;

  let estaciones = [];
  let puntosReferencia = [];
  for (let i = 0; i < arreglo.length; i++){
    puntosReferencia.push({objeto:arreglo[i]["Objeto 1"], azimut:arreglo[i]["Azimut Magnético 1 (Objeto 1)"], distancia: arreglo[i]["Distancia 1 (Objeto 1)"]});
    puntosReferencia.push({objeto:arreglo[i]["Objeto 2"], azimut:arreglo[i]["Azimut Magnético 2 (Objeto 2)"], distancia: arreglo[i]["Distancia 2 (Objeto 2)"]});
    puntosReferencia.push({objeto:arreglo[i]["Objeto 3"], azimut:arreglo[i]["Azimut Magnético 3 (Objeto 3)"], distancia: arreglo[i]["Distancia 3 (Objeto 3)"]});
    puntosReferencia.push({objeto:arreglo[i]["Objeto 4"], azimut:arreglo[i]["Azimut Magnético 4 (Objeto 4)"], distancia: arreglo[i]["Distancia 4 (Objeto 4)"]});
    puntosReferencia.push({objeto:arreglo[i]["Objeto 5"], azimut:arreglo[i]["Azimut Magnético 5 (Objeto 5)"], distancia: arreglo[i]["Distancia 5 (Objeto 5)"]});

    estaciones.push({
      estacionDto:{
        identificador: arreglo[i]["Nomenclatura Estandarizada"],
        nomenclatura: arreglo[i]["Nomenclatura Placa"],
        municipio: arreglo[i]["Municipio"],
        latitud: arreglo[i]["Latitud (decimal)"],
        longitud: arreglo[i]["Longitud (decimal)"],
        altura_elipsoidal: arreglo[i]["Altura Elipsoidal"],
        estado_vertice: arreglo[i]["Estado Vértice"],
        agencia: arreglo[i]["agencia"]
      },
      materializacionDto: {
        lugar_materializacion: arreglo[i]["Sitio"],
        tipo_materializacion: arreglo[i]["Tipo Materialización"],
        fecha_materializacion: arreglo[i]["Fecha Materialización"],
        fecha_descripcion: arreglo[i]["Fecha Descripción"],
        monumentado_por_1: arreglo[i]["Monumentado por 1"],
        ancho_mts: arreglo[i]["Ancho (mts)"],
        largo_mts: arreglo[i]["Largo (mts)"],
        altura_mts: arreglo[i]["Altura (mts)"],
        observacion: arreglo[i]["Observaciones"],
        actualizó: arreglo[i]["Elaboró/Actualizó"],
        descripción_detallada: arreglo[i]["Descripción Detallada"],
        acceso_general: arreglo[i]["Acceso General"],
        registrado_por: arreglo[i]["Registrado por"],
      },
      puntosReferencia: puntosReferencia
    });

    puntosReferencia = [];    
  }


  //console.log(estaciones);      

  

  try {
    //const res = await fetch('http://localhost:8084/pasiva',{
    const res = await fetch('http://10.23.13.10:8084/pasiva',{
      method: 'POST',
      body: JSON.stringify(estaciones),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const datos = await res.json();
    console.log(datos)

    pintarDatosSalida(datos);

    
    document.querySelector('#btnCargarExcel').disabled = false;
    console.log('respuesta el servidor');    
    document.querySelector('#btnCargarExcel').innerHTML = `Cargar`;

  } catch (error) {
    console.error(error);
  }
  

}