"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function NuevoPresupuesto() {
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
const [mantenimientoOferta, setMantenimientoOferta] =
  useState("30 días");

const [tiempoEntrega, setTiempoEntrega] =
  useState("5 días");

  const [items, setItems] = useState([
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

  const actualizarItem = (index: number, campo: string, valor: any) => {
    const nuevos = [...items];

    nuevos[index] = {
      ...nuevos[index],
      [campo]:
        campo === "descripcion" || campo === "tipo" || campo === "modoCalculo"
          ? valor
          : Number(valor),
    };

    setItems(nuevos);
  };

  const calcularM2 = (a: number, b: number) => a * b;

  const calcularPrecio = (a: number, b: number, c: number, p: number) =>
    calcularM2(a, b) * c * p;
const totalM2 = items.reduce((acc, item) => {

  if (item.modoCalculo === "m2") {

    return (
      acc +
      item.ancho *
      item.alto *
      item.cantidad
    );

  }

  return acc;

}, 0);
  const total = items.reduce(
    (acc, i) => acc + calcularPrecio(i.ancho, i.alto, i.cantidad, i.precio),
    0
  );

  const generarPDF = () => {
  const doc = new jsPDF();

  const colorPrincipal: any = [0, 0, 0];
  const colorSecundario: any = [6, 182, 212];
  const colorTexto: any = [30, 41, 59];

  // HEADER
  doc.setFillColor(...colorPrincipal);
  doc.rect(0, 0, 210, 35, "F");

  const logo = new Image();
  logo.src = "/logo-rec.png";
  doc.addImage(logo, "PNG", 15, 6, 55, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("Sistema profesional de presupuestos", 20, 31);

  // DATOS EMPRESA
  doc.setTextColor(...colorTexto);
  doc.setFontSize(11);

  doc.text("Direccion: Martin Coronado, Buenos Aires", 20, 48);
  doc.text("WhatsApp: 11-3657-2382", 20, 55);
  doc.text("CUIT: 20-93920334-7", 20, 62);
  doc.text("Instagram: @recdigital1", 20, 69);

  // CLIENTE
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 78, 180, 20, 4, 4, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(`Cliente: ${cliente || "-"}`, 20, 90);

  let y = 115;

  items.forEach((item, index) => {
    const metros = item.ancho * item.alto;

    const subtotal =
      item.modoCalculo === "m2"
        ? metros * item.precio * item.cantidad
        : item.precio * item.cantidad;

    const descripcion = doc.splitTextToSize(
      `Descripcion: ${item.descripcion || "-"}`,
      160
    );

    const alturaExtra = (descripcion.length - 1) * 6;

    // CAJA
    doc.setDrawColor(...colorSecundario);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, y - 8, 180, 42 + alturaExtra, 4, 4);

    // TITULO
    doc.setTextColor(...colorPrincipal);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Producto ${index + 1}`, 20, y);

    // TEXTO
    doc.setTextColor(...colorTexto);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(descripcion, 20, y + 8);

    doc.text(`Tipo: ${item.tipo}`, 20, y + 16);
    doc.text(`Medidas: ${item.ancho} x ${item.alto}`, 20, y + 22);
    doc.text(`Cantidad: ${item.cantidad}`, 110, y + 16);
    doc.text(`Subtotal: $${subtotal.toLocaleString("es-AR")}`, 110, y + 22);

    y += 52 + alturaExtra;
  });

  // TOTAL M2

doc.setTextColor(0, 0, 0);

doc.setFont("helvetica", "bold");
doc.setFontSize(12);

doc.text(
  `Total de metros cuadrados: ${totalM2.toFixed(2)} m²`,
  20,
  y + 5
);

y += 12;
  // TOTAL
  doc.setFillColor(...colorSecundario);
  doc.roundedRect(15, y, 180, 25, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text(
    `TOTAL: $${total.toLocaleString("es-AR")}`,
    20,
    y + 16
  );

  // INFORMACION FINAL

doc.setTextColor(0, 0, 0);

doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text(
  `Mantenimiento de oferta: ${mantenimientoOferta}`,
  20,
  y + 38
);

doc.text(
  `Tiempo de entrega: ${tiempoEntrega}`,
  20,
  y + 46
);
  doc.save("presupuesto-rec-digital.pdf");
};


  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-5xl mx-auto space-y-6">

        <input
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-white/20"
        />

        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-white/20 rounded space-y-3"
          >
            <select
              value={item.tipo}
              onChange={(e) =>
                actualizarItem(index, "tipo", e.target.value)
              }
              className="w-full p-2 bg-zinc-900 text-white border border-white/20"
            >
              {Object.keys(productos).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

  {/* ANCHO */}
  <div>
    <label className="text-sm text-slate-400">Ancho (m)</label>
    <input
      value={item.ancho}
      onChange={(e) =>
        actualizarItem(index, "ancho", e.target.value)
      }
      className="w-full p-2 bg-zinc-900 border border-white/20 rounded"
    />
  </div>

  {/* ALTO */}
  <div>
    <label className="text-sm text-slate-400">Alto (m)</label>
    <input
      value={item.alto}
      onChange={(e) =>
        actualizarItem(index, "alto", e.target.value)
      }
      className="w-full p-2 bg-zinc-900 border border-white/20 rounded"
    />
  </div>

  {/* CANTIDAD */}
  <div>
    <label className="text-sm text-slate-400">Cantidad</label>
    <input
      value={item.cantidad}
      onChange={(e) =>
        actualizarItem(index, "cantidad", e.target.value)
      }
      className="w-full p-2 bg-zinc-900 border border-white/20 rounded"
    />
  </div>

</div>

            <input
              placeholder="Descripción"
              value={item.descripcion}
              onChange={(e) =>
                actualizarItem(index, "descripcion", e.target.value)
              }
              className="w-full p-2 bg-zinc-900 border border-white/20"
            />

            <input
              placeholder="Precio"
              value={item.precio}
              onChange={(e) =>
                actualizarItem(index, "precio", e.target.value)
              }
              className="w-full p-2 bg-zinc-900 border border-white/20"
            />
          </div>
        ))}

        <button
          onClick={agregarItem}
          className="px-4 py-2 bg-cyan-500 text-black font-bold rounded"
        >
          Agregar producto
        </button>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <div>
    <label className="text-sm text-slate-400">
      Mantenimiento de oferta
    </label>

    <input
      value={mantenimientoOferta}
      onChange={(e) =>
        setMantenimientoOferta(
          e.target.value
        )
      }
      className="w-full p-3 rounded bg-zinc-900 border border-white/20"
    />
  </div>

  <div>
    <label className="text-sm text-slate-400">
      Tiempo de entrega
    </label>

    <input
      value={tiempoEntrega}
      onChange={(e) =>
        setTiempoEntrega(
          e.target.value
        )
      }
      className="w-full p-3 rounded bg-zinc-900 border border-white/20"
    />
  </div>

</div>
        <button
          onClick={generarPDF}
          className="px-4 py-2 bg-pink-600 font-bold rounded ml-2"
        >
          PDF
        </button>

        <div className="text-2xl font-bold">
          TOTAL: ${total}
        </div>
      </div>
    </main>
  );
}