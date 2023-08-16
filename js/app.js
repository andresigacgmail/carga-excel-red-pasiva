





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
  console.log(arreglo);
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
  console.log(arreglo);    
  document.querySelector('#btnCargarExcel').disabled = true;
  document.querySelector('#btnCargarExcel').innerHTML = ` <span class="sr-only">Loading...</span>  <div class="spinner-border" role="status"> </div> `;
  
  setTimeout(() => {
    document.querySelector('#btnCargarExcel').disabled = false;
    console.log('respuesta el servidor');    
    document.querySelector('#btnCargarExcel').innerHTML = `Cargar`;
  }, 1000);
}