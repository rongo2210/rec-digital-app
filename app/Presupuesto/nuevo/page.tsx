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
const [numeroPresupuesto, setNumeroPresupuesto] = useState("");
const [fechaPresupuesto, setFechaPresupuesto] = useState(() => {
  const hoy = new Date();
  const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
});
const fechaParaPDF = (fecha: string) => {
  const partes = fecha.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : fecha;
};
const [mantenimientoOferta, setMantenimientoOferta] = useState("30 días");
const [tiempoEntrega, setTiempoEntrega] = useState("5 días");
const [observaciones, setObservaciones] = useState("");

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

const subtotalItem = (item: any) => item.modoCalculo === "m2"
  ? calcularPrecio(item.ancho, item.alto, item.cantidad, item.precio)
  : convertirNumero(item.precio) * convertirNumero(item.cantidad);
const metrosTotalesItem = (item: any) => item.modoCalculo === "m2"
  ? calcularM2(item.ancho, item.alto) * convertirNumero(item.cantidad)
  : 0;
const total = items.reduce((acc, item) => acc + subtotalItem(item), 0);
const totalMetros = items.reduce((acc, item) => acc + metrosTotalesItem(item), 0);
const moneda = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const superficie = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    const altoPagina = doc.internal.pageSize.getHeight();
    const anchoPagina = doc.internal.pageSize.getWidth();
    const margen = 15;
    const pie = (pagina: number, paginas: number) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(110, 110, 110);
      doc.setFontSize(9);
      doc.text("Gracias por elegir REC DIGITAL", margen, altoPagina - 10);
      doc.text(`Página ${pagina} de ${paginas}`, anchoPagina - margen, altoPagina - 10, { align: "right" });
    };
    const datosPresupuesto = (yPos: number) => {
      doc.setTextColor(...negro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`PRESUPUESTO N°: ${numeroPresupuesto.trim() || "Sin número"}`, 20, yPos);
      doc.text(`Fecha: ${fechaParaPDF(fechaPresupuesto)}`, anchoPagina - 20, yPos, { align: "right" });
    };
    const encabezado = async () => {
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, anchoPagina, 35, "F");
      try {
        const logo = new Image();
        logo.src = "/logo-rec.png";
        await new Promise<void>((resolve, reject) => {
          if (logo.complete) logo.naturalWidth > 0 ? resolve() : reject(new Error("Logo no disponible"));
          else { logo.onload = () => resolve(); logo.onerror = () => reject(new Error("Logo no disponible")); }
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
    await encabezado();
    datosPresupuesto(43);
    doc.setTextColor(...negro);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Dirección: Martín Coronado, Buenos Aires", 20, 52);
    doc.text("WhatsApp: 11-3657-2382", 20, 58);
    doc.text("CUIT: 20-93920334-7", 20, 64);
    doc.text("Instagram: @recdigital1", 20, 70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const clienteLineas: string[] = doc.splitTextToSize(`Cliente: ${cliente || "-"}`, 170);
    doc.text(clienteLineas, 20, 82);
    let y = 90 + (clienteLineas.length - 1) * 5;
    const nuevaPagina = async () => {
      doc.addPage();
      await encabezado();
      datosPresupuesto(43);
      y = 53;
    };
    const asegurarEspacio = async (alto: number) => {
      if (y + alto > altoPagina - 19) await nuevaPagina();
    };
    // Estimamos el bloque final para evitar una segunda página casi vacía.
    const observacionLineasPrevias: string[] = observaciones.trim()
      ? doc.splitTextToSize(observaciones.trim(), 168) : [];
    const altoFinalPrevisto = 12 + 38 + 22 + (observacionLineasPrevias.length ? 9 + observacionLineasPrevias.length * 5 : 0);
    const altoItems = items.map((item: any) => {
      const lineas: string[] = doc.splitTextToSize(`Descripción: ${item.descripcion?.trim() || "Sin descripción adicional"}`, 165);
      return 13 + lineas.length * 4.8 + (item.modoCalculo === "m2" ? 28 : 21) + 6;
    });
    // Si el último producto cabe junto con el resumen en una nueva página,
    // lo trasladamos para repartir mejor el contenido entre ambas hojas.
    const alturaTodos = altoItems.reduce((a: number, b: number) => a + b, 0);
    const equilibrarUltimo = items.length > 1 &&
      y + alturaTodos + altoFinalPrevisto > altoPagina - 19 &&
      y + alturaTodos - altoItems[altoItems.length - 1] <= altoPagina - 19 &&
      53 + altoItems[altoItems.length - 1] + altoFinalPrevisto <= altoPagina - 19;
    for (const [index, item] of items.entries()) {
      if (equilibrarUltimo && index === items.length - 1) await nuevaPagina();
      const esM2 = item.modoCalculo === "m2";
      const cantidad = convertirNumero(item.cantidad);
      const m2Unidad = calcularM2(item.ancho, item.alto);
      const m2Total = metrosTotalesItem(item);
      const subtotal = subtotalItem(item);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const descripcionLineas: string[] = doc.splitTextToSize(`Descripción: ${item.descripcion?.trim() || "Sin descripción adicional"}`, 165);
      const alto = 13 + descripcionLineas.length * 4.8 + (esM2 ? 28 : 21);
      await asegurarEspacio(alto + 6);
      doc.setDrawColor(...azul);
      doc.setLineWidth(0.4);
      doc.roundedRect(margen, y, 180, alto, 3, 3, "S");
      doc.setTextColor(...negro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Producto ${index + 1}  |  Tipo: ${item.tipo}`, 20, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(descripcionLineas, 20, y + 15);
      let dy = y + 15 + descripcionLineas.length * 4.8 + 1;
      doc.text(`Cantidad: ${cantidad.toLocaleString("es-AR")}`, 20, dy);
      if (esM2) {
        dy += 6;
        doc.text(`Medidas por unidad: ${item.ancho} m x ${item.alto} m`, 20, dy);
        dy += 6;
        doc.text(`Superficie por unidad: ${superficie(m2Unidad)} m²`, 20, dy);
        dy += 6;
        doc.text(`Total de este producto: ${superficie(m2Total)} m²`, 20, dy);
      } else {
        dy += 6;
        doc.text(`Precio por unidad: $${moneda(convertirNumero(item.precio))}`, 20, dy);
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Subtotal: $${moneda(subtotal)}`, 190, dy, { align: "right" });
      y += alto + 6;
    }
    // Bloque final compacto, con salto de página solo si realmente es necesario.
    const observacionLineas: string[] = observaciones.trim()
      ? doc.splitTextToSize(observaciones.trim(), 168) : [];
    const altoCondiciones = 22 + (observacionLineas.length ? 9 + observacionLineas.length * 5 : 0);
    const altoFinal = 12 + 32 + altoCondiciones;
    await asegurarEspacio(altoFinal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...negro);
    doc.text(`TOTAL DE METROS CUADRADOS: ${superficie(totalMetros)} m²`, 20, y + 6);
    y += 12;
    doc.setFillColor(...azul);
    doc.roundedRect(margen, y, 180, 32, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text(`TOTAL: $${moneda(total)}`, 20, y + 12);
    const entero = Math.floor(total);
    const centavos = Math.round((total - entero) * 100).toString().padStart(2, "0");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const letras: string[] = doc.splitTextToSize(`Son pesos: ${numeroALetras(entero)} con ${centavos}/100`, 166);
    doc.text(letras, 20, y + 19);
    y += 38;
    doc.setTextColor(...negro);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CONDICIONES COMERCIALES", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Mantenimiento de oferta: ${mantenimientoOferta || "No especificado"}`, 20, y + 7);
    doc.text(`Tiempo de entrega: ${tiempoEntrega || "No especificado"}`, 20, y + 14);
    if (observacionLineas.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", 20, y + 23);
      doc.setFont("helvetica", "normal");
      doc.text(observacionLineas, 20, y + 29);
    }
    const paginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= paginas; pagina++) {
      doc.setPage(pagina);
      pie(pagina, paginas);
    }
    const sufijo = numeroPresupuesto.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
    doc.save(`presupuesto-rec-digital${sufijo ? `-${sufijo}` : ""}.pdf`);
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

{/* DATOS DEL PRESUPUESTO */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block mb-2 text-sm text-slate-300">Número de presupuesto (editable)</label>
    <input type="text" value={numeroPresupuesto} onChange={(e) => setNumeroPresupuesto(e.target.value)}
      placeholder="Ej: 000001" className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10" />
  </div>
  <div>
    <label className="block mb-2 text-sm text-slate-300">Fecha del presupuesto (editable)</label>
    <input type="date" value={fechaPresupuesto} onChange={(e) => setFechaPresupuesto(e.target.value)}
      className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10" />
  </div>
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

const metrosCuadrados = metrosTotalesItem(item);

const subtotal = subtotalItem(item);

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
{superficie(metrosCuadrados)} m²
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

{/* CONDICIONES COMERCIALES */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block mb-2 text-sm text-slate-300">Mantenimiento de oferta</label>
    <input value={mantenimientoOferta} onChange={(e) => setMantenimientoOferta(e.target.value)}
      className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10" placeholder="Ej: 30 días" />
  </div>
  <div>
    <label className="block mb-2 text-sm text-slate-300">Tiempo de entrega</label>
    <input value={tiempoEntrega} onChange={(e) => setTiempoEntrega(e.target.value)}
      className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10" placeholder="Ej: 5 días" />
  </div>
</div>
<div className="mt-5">
  <label className="block mb-2 text-sm text-slate-300">Observaciones o aclaraciones (opcional)</label>
  <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={4}
    placeholder="Condiciones particulares, detalles de instalación, aclaraciones, etc."
    className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10" />
</div>
<div className="mt-5 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
  <span className="text-slate-300">Total de metros cuadrados: </span>
  <strong className="text-cyan-300">{superficie(totalMetros)} m²</strong>
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























































































































