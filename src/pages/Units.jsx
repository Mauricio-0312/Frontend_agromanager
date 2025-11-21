import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.fetchUnits();
      setUnits(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function create(e) {
    e.preventDefault();
    const payload = {
      dimension: e.target.dimension.value,
      unit: e.target.unit.value,
    };
    try {
      await api.createUnit(payload);
      e.target.reset();
      load();
    } catch (err) {
      alert("Error");
    }
  }

  async function remove(id) {
    if (!confirm("Eliminar unidad?")) return;
    try {
      await api.deleteUnit(id);
      load();
    } catch (err) {
      alert("Error");
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      const payload = {
        dimension: e.target.dimension.value,
        unit: e.target.unit.value,
      };
      await api.updateUnit(unitToEdit.ID || unitToEdit.id, payload);
      e.target.reset();
      console.log("payload");
      setIsEditing(false);
      setUnitToEdit(null);
      load();
    } catch (err) {
      alert("Error");
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold">Unidades de medida</h3>
        <table className="w-full mt-3">
          <thead className="text-sm text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2">Dimensión</th>
              <th className="px-4 py-2">Unidad</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.ID || u.id}>
                <td className="px-4 py-2">{u.Dimension || u.dimension}</td>
                <td className="px-4 py-2">{u.Unit || u.unit}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setUnitToEdit(u);
                    }}
                    className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(u.ID || u.id)}
                    className="btn bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">
          {isEditing ? "Editar unidad" : "Crear unidad"}
        </h3>
        {isEditing ? (
          // add key so form remounts when unitToEdit changes
          <form
            key={
              unitToEdit ? `edit-${unitToEdit.ID || unitToEdit.id}` : "edit"
            }
            onSubmit={saveEdit}
            className="flex flex-col gap-2"
          >
            <input
              name="dimension"
              value={unitToEdit?.dimension || ""}
              onChange={(e) =>
                setUnitToEdit({ ...unitToEdit, dimension: e.target.value })
              }
              className="p-2 border rounded"
            />
            <input
              name="unit"
              value={unitToEdit?.unit || ""}
              onChange={(e) =>
                setUnitToEdit({ ...unitToEdit, unit: e.target.value })
              }
              className="p-2 border rounded"
            />
            <div className="flex gap-2">
              <button className="btn bg-primary text-white px-2 py-2 rounded">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUnitToEdit(null);
                }}
                className="btn bg-gray-200 px-2 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          // add key to create form as well
          <form key="create" onSubmit={create} className="flex flex-col gap-2">
            <input
              name="dimension"
              placeholder="Dimensión"
              className="p-2 border rounded"
            />
            <input
              name="unit"
              placeholder="Unidad"
              className="p-2 border rounded"
            />
            <button className="btn bg-primary text-white py-2 rounded">
              Crear
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
