//------ Selección de Elementos -------//
const textInput = document.querySelector(".text-input");
const botonGenerar = document.querySelector(".btn-generar");
const contenedorQR = document.querySelector(".qrcode");
const botonDescargar = document.querySelector(".btn-descargar");
const aviso = document.querySelector(".text-aviso");

const seleccionImg = document.querySelector(".seleccion-img");

const inputColor = document.querySelector("#inputColor");
const inputColorEsquinasExternas = document.querySelector("#inputColorEsquinasExternas");
const inputColorEsquinasInternas = document.querySelector("#inputColorEsquinasInternas");
const selectForma = document.querySelector("#tipoPuntos");
const selectEsquinas = document.querySelector("#tipoEsquinas");
const inputTamaño = document.querySelector("#tamañoQR");

let texto = "";
let QR;

// Configuración inicial del QR
const propiedades = {
    width: 315,
    height: 315,
    type: "png",
    data: "",
    image: "",
    backgroundOptions: {
        color: "white", // Color de fondo
    },
    dotsOptions: {
        color: "#000000", // Color de los puntos
        type: "square", // Forma de los puntos
    },
    cornersSquareOptions: {
        type: "square", // Estilo de las esquinas cuadradas externas
        color: "#ff14d1", // Color por defecto de las esquinas exteriores
    },
    cornersDotOptions: {
        type: "dots", // Estilo de las esquinas internas
        color: "#000", // Color por defecto de las esquinas interiores
    },
    imageOptions: {
        margin: 0,
        imageSize: 0.5, // Tamaño relativo del logo
    },
};

//----- Eventos -----//
// Generar QR
botonGenerar.addEventListener("click", (e) => {
    e.preventDefault();
    texto = textInput.value;

    if (!texto) {
        mostrarAviso("No has ingresado ningún texto.");
    } else {
        generarCodigoQr(texto);
        botonDescargar.style.display = "block";
    }
});

// Subir imagen para el logo
seleccionImg.addEventListener("change", () => {
    if (texto) generarCodigoQr(texto);
});

// Descargar QR
botonDescargar.addEventListener("click", () => descargarCodigoQr());

// Cambiar personalización
inputColor.addEventListener("input", () => {
    if (texto) generarCodigoQr(texto);
});
inputColorEsquinasExternas.addEventListener("input", () => {
    if (texto) generarCodigoQr(texto);
});
inputColorEsquinasInternas.addEventListener("input", () => {
    if (texto) generarCodigoQr(texto);
});
selectForma.addEventListener("change", () => {
    if (texto) generarCodigoQr(texto);
});
selectEsquinas.addEventListener("change", () => {
    if (texto) generarCodigoQr(texto);
});
inputTamaño.addEventListener("input", () => {
    if (texto) generarCodigoQr(texto);
});

//----- Funciones -----//
// Generar el código QR
function generarCodigoQr(texto) {
    // Si hay una imagen seleccionada, usarla como logo
    if (seleccionImg.files && seleccionImg.files[0]) {
        const file = seleccionImg.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            propiedades.image = event.target.result;
            crearQR(texto);
        };

        reader.readAsDataURL(file);
    } else {
        propiedades.image = ""; // Sin logo
        crearQR(texto);
    }
}

// Crear el QR con las propiedades configuradas
function crearQR(texto) {
    const tamaño = parseInt(inputTamaño.value) || 315;
    propiedades.width = Math.max(100, Math.min(800, tamaño)); // Restringir entre 100px y 500px
    propiedades.height = propiedades.width;
    propiedades.data = texto;
    
    // Cambiar los colores de los puntos y las esquinas según las selecciones
    propiedades.dotsOptions.color = inputColor.value || "#000000"; // Color de los puntos
    propiedades.dotsOptions.type = selectForma.value; // Tipo de los puntos
    propiedades.cornersSquareOptions.type = selectEsquinas.value; // Tipo de las esquinas exteriores
    propiedades.cornersSquareOptions.color = inputColorEsquinasExternas.value || "#ff14d1"; // Color de las esquinas exteriores
    propiedades.cornersDotOptions.color = inputColorEsquinasInternas.value || "#000"; // Color de las esquinas interiores
    
    // Si se cambia el tipo de esquinas exteriores, actualizar las interiores
    if (propiedades.cornersSquareOptions.type !== "square") {
        // Sincronizar las esquinas interiores con las exteriores
        propiedades.cornersDotOptions.type = propiedades.cornersSquareOptions.type;
    }

    QR = new QRCodeStyling(propiedades);

    contenedorQR.innerHTML = ""; // Limpiar el contenedor
    QR.append(contenedorQR);
}

// Descargar el código QR
function descargarCodigoQr() {
    if (QR) {
        QR.getRawData("image/png").then((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "codigo_qr.png";
            link.click();
        });
    }
}

// Mostrar mensajes de aviso
function mostrarAviso(mensaje) {
    aviso.style.color = "#f83292";
    aviso.style.fontWeight = "800";
    aviso.textContent = mensaje;
    aviso.style.visibility = "visible";

    setTimeout(() => {
        aviso.style.visibility = "hidden";
    }, 3000);
}