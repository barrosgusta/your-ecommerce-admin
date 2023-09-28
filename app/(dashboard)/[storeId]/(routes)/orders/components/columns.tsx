"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  products: string
  totalPrice: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produtos",
  },
  {
    accessorKey: "phone",
    header: "Celular",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    accessorKey: "isPaid",
    header: "Pago",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {row.original.isPaid ? "Sim" : "Não"}
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  }
]
