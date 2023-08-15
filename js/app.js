


document.querySelector('#cargarExcel').addEventListener('change', () => {
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
    console.log(jsonData);
  };

  reader.readAsArrayBuffer(file);
});