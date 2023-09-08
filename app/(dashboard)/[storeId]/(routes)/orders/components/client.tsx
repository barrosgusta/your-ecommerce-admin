"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

type OrderClientProps = {
    data: OrderColumn[]
}

export default function OrderClient({ data }: OrderClientProps) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <Heading 
                title={`Pedidos (${data.length})`}
                description="Gerencie os pedidos da sua loja."
            />
            <Separator />
            <DataTable columns={columns} data={data} serachKey="products" />
        </>
    )
}