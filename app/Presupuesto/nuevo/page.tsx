"use client"; 

import { useState } from "react";
import jsPDF from "jspdf";

export default function NuevoPresupuesto() {
const PRECIO_M2 = 30000;
const productos = {
Banner: 30000, 
Lona: 30000, 
Vinilo: 30000, 
Microperforado: 35000, 
UV: 35000, 
DTF: 35000,

PVC: 30000,
Polyfan: 30000,
AltoImpacto: 35000,

Tarjetas: 35000,
Volantes: 35000,

Corporeas: 0,
Cartel: 0,
Estructura: 0,
};

const [cliente, setCliente] = useState("");

const [items, setItems] = useState<any[]>([
{
tipo: "Banner",
descripcion: "",
ancho: 1,
alto: 1,
cantidad: 1,
precio: 30000,
modoCalculo: "m2",
},
]);

const agregarItem = () => {

setItems([
...items,
{
tipo: "Banner",
descripcion: "",
ancho: 1,
alto: 1,
cantidad: 1,
precio: 30000,
modoCalculo: "m2",
},
]);

};

// Convierte las medidas a número solamente cuando necesitamos calcular.
// Acepta tanto coma como punto decimal y evita que aparezca NaN
// mientras el usuario está escribiendo o borra temporalmente el campo.
const convertirNumero = (valor: number | string | null | undefined) => {
if (valor === "" || valor === null || valor === undefined) {
return 0;
}

const numero = Number(String(valor).replace(",", "."));

return Number.isFinite(numero) ? numero : 0;
};

const actualizarItem = (
index: number,
campo: string,
valor: string
) => {

const nuevosItems = [...items];

// Ancho y alto se guardan como texto mientras el usuario escribe.
// Esto permite borrar el valor, escribir una coma, etc., sin generar NaN.
if (campo === "ancho" || campo === "alto") {

nuevosItems[index] = {
...nuevosItems[index],
[campo]: valor.replace(/[^0-9.,]/g, ""),
};

} else if (
campo === "descripcion" ||
campo === "tipo" ||
campo === "modoCalculo"
) {

nuevosItems[index] = {
...nuevosItems[index],
[campo]: valor,
};

} else {

nuevosItems[index] = {
...nuevosItems[index],
[campo]:
valor === ""
? 0
: convertirNumero(valor),
};

}

setItems(nuevosItems);
};


const calcularM2 = (
ancho: number | string,
alto: number | string
) => {
return convertirNumero(ancho) * convertirNumero(alto);
};

const calcularPrecio = (
ancho: number | string,
alto: number | string,
cantidad: number | string,
precio: number | string
) => {
return (
calcularM2(ancho, alto) *
convertirNumero(precio) *
convertirNumero(cantidad)
);
};

const total = items.reduce((acc, item) => {
return (
acc +
calcularPrecio(
item.ancho,
item.alto,
item.cantidad,
item.precio
)
);
}, 0);
function numeroALetras(numero: number): string {

const unidades = [
"",
"uno",
"dos",
"tres",
"cuatro",
"cinco", 
"seis", 
"siete", 
"ocho", 
"nueve",
];

const especiales = [
"diez", 
"once", 
"doce", 
"trece", 
"catorce", 
"quince", 
"dieciseis", 
"diecisiete", 
"dieciocho", 
"diecinueve", 
];

const decenas = [
"",
"",
"veinte", 
"treinta", 
"cuarenta", 
"cincuenta", 
"sesenta", 
"setenta", 
"ochenta", 
"noventa", 
];

const centenas = [
"",
"ciento",
"doscientos",
"trescientos",
"cuatrocientos",
"quinientos",
"seiscientos",
"setecientos",
"ochocientos",
"novecientos",
];

if (numero === 0) return "cero";
if (numero === 100) return "cien";

function convertirMenorMil(n: number): string {

let texto = "";

const centena = Math.floor(n / 100);
const resto = n % 100;

if (n === 100) {
return "cien";
}

if (centena > 0) {
texto += centenas[centena] + " ";
}

if (resto >= 10 && resto < 20) {

texto += especiales[resto - 10];

} else {

const decena = Math.floor(resto / 10);
const unidad = resto % 10;

if (resto >= 20 && resto < 30) {

if (resto === 20) {
texto += "veinte";
} else {
texto += "veinti" + unidades[unidad];
}

} else {

if (decena > 0) {

texto += decenas[decena];
if (unidad > 0) {
texto += " y ";
}

}

if (unidad > 0) {
texto += unidades[unidad];
}

}

}

return texto.trim();

}

let letras = "";

const millones = Math.floor(numero / 1000000);
const miles = Math.floor((numero % 1000000) / 1000);
const resto = numero % 1000;

// MILLONES
if (millones > 0) {

if (millones === 1) {
letras += "un millon ";
} else {
letras +=
convertirMenorMil(millones) +
" millones ";
}

}

// MILES
if (miles > 0) {

if (miles === 1) {
letras += "mil ";
} else {
letras +=
convertirMenorMil(miles) +
" mil ";
}

}

// RESTO
if (resto > 0) {
letras += convertirMenorMil(resto);
}

return letras.trim();

}
const generarPDF = async () => {
  try {
    const doc = new jsPDF();
    const azul: [number, number, number] = [6, 182, 212];
    const negro: [number, number, number] = [30, 41, 59];
    const margen = 15;
    const anchoPagina = doc.internal.pageSize.getWidth();
    const altoPagina = doc.internal.pageSize.getHeight();

    const encabezado = async () => {
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, anchoPagina, 35, "F");
      // El PDF se descarga incluso si el logo no está disponible.
      try {
        const logo = new Image();
        logo.src = "/logo-rec.png";
        await new Promise<void>((resolve, reject) => {
          if (logo.complete) {
            logo.naturalWidth > 0 ? resolve() : reject(new Error("Logo no disponible"));
          } else {
            logo.onload = () => resolve();
            logo.onerror = () => reject(new Error("Logo no disponible"));
          }
        });
        doc.addImage(logo, "PNG", 15, 6, 55, 22);
      } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(19);
        doc.setTextColor(255, 255, 255);
        doc.text("REC DIGITAL", 20, 19);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("Sistema profesional de presupuestos", 20, 31);
    };

    const pie = () => {
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.text("Gracias por elegir REC DIGITAL", 20, altoPagina - 10);
    };

    await encabezado();
    doc.setTextColor(...negro);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Direccion: Martin Coronado, Buenos Aires", 20, 48);
    doc.text("WhatsApp: 11-3657-2382", 20, 55);
    doc.text("CUIT: 20-93920334-7", 20, 62);
    doc.text("Instagram: @recdigital1", 20, 69);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const clienteLineas: string[] = doc.splitTextToSize(`Cliente: ${cliente || "-"}`, 170);
    doc.text(clienteLineas, 20, 85);
    let y = 98 + (clienteLineas.length - 1) * 6;

    for (const [index, item] of items.entries()) {
      const metros = calcularM2(item.ancho, item.alto);
      const subtotal = item.modoCalculo === "m2"
        ? calcularPrecio(item.ancho, item.alto, item.cantidad, item.precio)
        : convertirNumero(item.precio) * convertirNumero(item.cantidad);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const descripcionTexto: string[] = doc.splitTextToSize(
        `Descripcion: ${item.descripcion || "-"}`, 166
      );
      const altura = Math.max(43, 15 + descripcionTexto.length * 5 + 17);
      if (y + altura > altoPagina - 30) {
        pie();
        doc.addPage();
        await encabezado();
        y = 45;
      }
      doc.setDrawColor(...azul);
      doc.setLineWidth(0.5);
      // roundedRect requiere x, y, ancho, alto, radioX, radioY y estilo.
      doc.roundedRect(margen, y, 180, altura, 4, 4, "S");
      doc.setTextColor(...negro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Producto ${index + 1}`, 20, y + 9);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(descripcionTexto, 20, y + 16);
      const detalleY = y + 16 + descripcionTexto.length * 5 + 2;
      if (item.modoCalculo === "m2") {
        doc.text(`Medidas: ${item.ancho} m x ${item.alto} m`, 20, detalleY);
        doc.text(`Metros cuadrados: ${metros.toFixed(2)} m2`, 20, detalleY + 6);
      } else {
        doc.text(`Cantidad: ${item.cantidad}`, 20, detalleY);
        doc.text(`Precio unitario: $${convertirNumero(item.precio).toLocaleString("es-AR")}`, 20, detalleY + 6);
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Subtotal: $${subtotal.toLocaleString("es-AR")}`, 110, detalleY + 6);
      y += altura + 9;
    }

    if (y + 37 > altoPagina - 17) {
      pie();
      doc.addPage();
      await encabezado();
      y = 45;
    }
    doc.setFillColor(...azul);
    doc.roundedRect(15, y, 180, 32, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`TOTAL: $${total.toLocaleString("es-AR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, y + 13);
    const entero = Math.floor(total);
    const centavos = Math.round((total - entero) * 100).toString().padStart(2, "0");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const letras: string[] = doc.splitTextToSize(`Son pesos: ${numeroALetras(entero)} con ${centavos}/100`, 165);
    doc.text(letras, 20, y + 20);
    pie();
    doc.save("presupuesto-rec-digital.pdf");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("No se pudo generar el PDF. Revisá la consola del navegador para ver el detalle.");
  }
};

return (
<main className="min-h-screen p-4 md:p-10 flex justify-center bg-gradient-to-b from-black to-zinc-900">

<div className="w-full max-w-6xl bg-white/5 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-sm">

<h1 className="text-3xl md:text-5xl font-black leading-tight">
Nuevo Presupuesto
</h1>

<p className="text-slate-400 mt-2">
Sistema REC DIGITAL
</p>

<div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
Precio configurado: <strong>$30.000</strong> por metro cuadrado
</div>

{/* CLIENTE */}
<div className="mt-8">

<label className="block mb-2 text-sm text-slate-300">
Cliente
</label>

<input
value={cliente}
onChange={(e) => setCliente(e.target.value)}
placeholder="Nombre del cliente"
className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10"
/>

</div>

{/* ITEMS */}
<div className="mt-10 space-y-8">

{items.map((item, index) => {

const metrosCuadrados =
calcularM2(
item.ancho,
item.alto
);

const subtotal =
calcularPrecio(
item.ancho, 
item.alto, 
item.cantidad, 
item.precio 
);

return (

<div
key={index}
className="p-6 rounded-3xl bg-black border border-white/10"
>

<h2 className="text-xl font-bold mb-6">
Producto #{index + 1}
</h2>

<div className="grid grid-cols-1 md:grid-cols-5 gap-4">

{/* MODO CALCULO */}
<div>

<label className="block mb-2 text-sm text-slate-400">
Modo de cálculo
</label>

<select
value={item.modoCalculo || "m2"}
onChange={(e) =>
actualizarItem(
index,
"modoCalculo",
e.target.value
)
}
className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10"
>

<option value="m2">
Precio fijo
</option>

</select>

</div>

{/* TIPO PRODUCTO */}

<div>

<label className="block mb-2 text-sm text-slate-400">
Tipo de producto
</label>

<select
value={item.tipo}
onChange={(e) => {

const nuevosItems = [...items];

nuevosItems[index].tipo =
e.target.value;

nuevosItems[index].precio =
productos[
e.target.value as keyof typeof productos
];

setItems(nuevosItems);

}}
className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10"
>

{Object.keys(productos).map((producto) => (

<option
key={producto}
value={producto}
>
{producto}
</option>

))}

</select>

</div>

{/* ANCHO */}
<div>

<label className="block mb-2 text-sm text-slate-400">
Ancho (m)
</label>

<input
type="text"
inputMode="decimal"
value={item.ancho}
onChange={(e) =>
actualizarItem(
index,
"ancho",
e.target.value
)
}
placeholder="Ej: 1,50"
className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10"
/>

</div>

{/* ALTO */}
<div>

<label className="block mb-2 text-sm text-slate-400">
Alto (m)
</label>

<input
type="text"
inputMode="decimal"
value={item.alto}
onChange={(e) =>
actualizarItem(
index,
"alto",
e.target.value
)
}
placeholder="Ej: 1,20"
className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10"
/>

</div>

{/* CANTIDAD */}
<div>

<label className="block mb-2 text-sm text-slate-400">
Cantidad
</label>

<input
type="number"
value={item.cantidad}
onChange={(e) =>
actualizarItem(
index,
"cantidad",
e.target.value
)
}
className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10"
/>

</div>

</div>

{/* DESCRIPCION GRANDE */}
<div className="mt-6">

<label className="block mb-2 text-sm text-slate-400">
Descripción
</label>

<textarea
placeholder="Detalle del trabajo..."
value={item.descripcion}
onChange={(e) =>
actualizarItem(
index,
"descripcion",
e.target.value
)
}
rows={4}
className="w-full px-4 py-4 rounded-2xl bg-zinc-950 border border-white/10 resize-none"
/>

</div>
{/* RESUMEN */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

<div className="p-4 rounded-2xl bg-white/5">

<p className="text-sm text-slate-400 mb-2">
Precio por m²
</p>

<input
type="number"
value={item.precio}
onChange={(e) =>
actualizarItem(
index,
"precio",
e.target.value
)
}
className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-2xl font-black"
/>

</div>

<div className="p-4 rounded-2xl bg-white/5">

<p className="text-sm text-slate-400">
Total m²
</p>
<p className="text-2xl font-black mt-1">
{metrosCuadrados.toFixed(2)} m²
</p>

</div>

<div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">

<p className="text-sm text-cyan-300">
Subtotal
</p>

<p className="text-3xl font-black mt-1 text-cyan-300">
${subtotal.toLocaleString("es-AR")}
</p>

</div>

</div>

</div>

);

})}

</div>

{/* BOTONES */}
<div className="mt-8 flex flex-col md:flex-row gap-4">

<button
onClick={agregarItem}
className="w-full md:w-auto px-6 py-4 rounded-2xl bg-cyan-500 text-black font-bold text-lg"
>
+ Agregar producto
</button>

<button
onClick={generarPDF}
className="w-full md:w-auto px-6 py-4 rounded-2xl bg-pink-600 text-white font-bold text-lg"
>
Descargar PDF
</button>

</div>

{/* TOTAL */}
<div className="mt-12 p-8 rounded-3xl bg-black border border-white/10">

<h2 className="text-2xl md:text-4xl font-black break-words">
TOTAL: ${total.toLocaleString("es-AR")}
</h2>

<p className="text-slate-400 mt-3 text-lg">
Cliente: {cliente || "-"}
</p>

</div>

</div>

</main>
);
}























































































































