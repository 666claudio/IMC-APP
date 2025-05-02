var historial = []; // Lista (array) para guardar objetos

function calcularIMC() {
    var peso = document.getElementById("peso").value;
    var altura = document.getElementById("altura").value;

    if (peso === "" || altura === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    peso = parseFloat(peso);
    altura = parseFloat(altura);

    var imc = peso / (altura * altura);
    var categoria = "";

    if (imc < 18.5) {
        categoria = "Bajo peso";
    } else if (imc >= 18.5 && imc < 24.9) {
        categoria = "Normal";
    } else if (imc >= 25 && imc < 29.9) {
        categoria = "Sobrepeso";
    } else {
        categoria = "Obesidad";
    }

    // Crear un objeto con los datos y agregarlo a la lista
    var registro = {
        peso: peso,
        altura: altura,
        imc: imc.toFixed(2),
        categoria: categoria
    };

    // Enviar el registro al servidor
    fetch("http://localhost:3000/imc", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registro)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Guardado en el servidor:", data.message);
    });

    // Mostrar resultado actual
    document.getElementById("resultado").innerText = "Tu IMC es: " + imc.toFixed(2);
    document.getElementById("categoria").innerText = "Categoría: " + categoria;

    // Obtener y mostrar el historial desde el servidor
    fetch("http://localhost:3000/historial")
        .then(response => response.json())
        .then(historial => {
            var historialTexto = "Historial de cálculos:\n";
            historial.forEach((item, i) => {
                historialTexto += `${i + 1}) Peso: ${item.peso} kg, Altura: ${item.altura} m, IMC: ${item.imc}, Categoría: ${item.categoria}\n`;
            });
            alert(historialTexto); // Mostrar historial en un alert
        });
}
