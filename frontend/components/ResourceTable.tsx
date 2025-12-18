"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { ResourceData } from "@/lib/form-schema";
import { cn } from "@/lib/utils";

interface ResourceTableProps {
  resources: ResourceData[];
  onChange: (resources: ResourceData[]) => void;
  errors?: Record<number, Partial<Record<keyof ResourceData, string>>>;
  totalCost: number;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  onChange,
  errors,
  totalCost,
}) => {
  const addRow = () => {
    onChange([
      ...resources,
      {
        resourceName: "",
        description: "",
        cost: 0,
        link: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    onChange(resources.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ResourceData, value: string | number) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const costDisplay = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalCost);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Resource Requirements</h3>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white transition duration-200 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {resources.length > 0 && (
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#545454]">
                <th className="text-left p-3 text-sm font-semibold text-white">
                  Resource Name
                </th>
                <th className="text-left p-3 text-sm font-semibold text-white">
                  Description
                </th>
                <th className="text-left p-3 text-sm font-semibold text-white">
                  Cost (₹)
                </th>
                <th className="text-left p-3 text-sm font-semibold text-white">
                  Link
                </th>
                <th className="text-left p-3 text-sm font-semibold text-white w-16">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <tr key={index} className="border-b border-[#545454]">
                  <td className="p-3">
                    <input
                      type="text"
                      value={resource.resourceName}
                      onChange={(e) => updateRow(index, "resourceName", e.target.value)}
                      className={cn(
                        "w-full px-0 py-2 bg-transparent border-0 border-b border-[#545454] text-white placeholder:text-gray-500 focus:outline-none focus:border-b-2 focus:border-purple-600 transition",
                        errors?.[index]?.resourceName && "border-red-500 focus:border-red-500"
                      )}
                      placeholder="Resource Name"
                    />
                    {errors?.[index]?.resourceName && (
                      <p className="text-xs text-red-400 mt-1">{errors[index].resourceName}</p>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={resource.description}
                      onChange={(e) => updateRow(index, "description", e.target.value)}
                      className={cn(
                        "w-full px-0 py-2 bg-transparent border-0 border-b border-[#545454] text-white placeholder:text-gray-500 focus:outline-none focus:border-b-2 focus:border-purple-600 transition",
                        errors?.[index]?.description && "border-red-500 focus:border-red-500"
                      )}
                      placeholder="Description"
                    />
                    {errors?.[index]?.description && (
                      <p className="text-xs text-red-400 mt-1">{errors[index].description}</p>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={resource.cost || ""}
                      onChange={(e) => updateRow(index, "cost", parseFloat(e.target.value) || 0)}
                      className={cn(
                        "w-full px-0 py-2 bg-transparent border-0 border-b border-[#545454] text-white placeholder:text-gray-500 focus:outline-none focus:border-b-2 focus:border-purple-600 transition",
                        errors?.[index]?.cost && "border-red-500 focus:border-red-500"
                      )}
                      placeholder="Cost"
                      min="0"
                    />
                    {errors?.[index]?.cost && (
                      <p className="text-xs text-red-400 mt-1">{errors[index].cost}</p>
                    )}
                  </td>
                  <td className="p-3">
                  <input
                    type="text"
                      value={resource.link || ""}
                      onChange={(e) => updateRow(index, "link", e.target.value)}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b border-[#545454] text-white placeholder:text-gray-500 focus:outline-none focus:border-b-2 focus:border-purple-600 transition"
                      placeholder="Link"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="p-2 rounded-md transition-colors text-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resources.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-400">
            Total Resources: <span className="font-semibold text-white">{resources.length}</span>
          </p>
          <div className="text-right">
            <p className="text-lg font-semibold text-white">
              Total Cost: {costDisplay}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

