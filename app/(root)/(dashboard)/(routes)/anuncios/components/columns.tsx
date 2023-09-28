"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type AdColumn = {
  id: string
  brand: string
  model: string
  year: number
  fuel: string
  kms: number
  isTurbo: boolean
  stage: number
  price: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<AdColumn>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "year",
    header: "Ano",
  },
  {
    accessorKey: "kms",
    header: "Kilômetragem",
  },
  {
    accessorKey: "fuel",
    header: "Combustivel",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  {
    accessorKey: "stage",
    header: "Nível do Stage",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.stage === 0 ? "Stock" : row.original.stage}
      </div>
    )
  },
  {
    accessorKey: "isTurbo",
    header: "Turbo",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.isTurbo ? "Sim" : "Não"}
      </div>
    )
  },
  {
    accessorKey: "isArchived",
    header: "Arquivado",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.isArchived ? "Sim" : "Não"}
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Destaque",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.isFeatured ? "Sim" : "Não"}
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
