"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SizeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

type SizeClientProps = {
    data: SizeColumn[]
}

export default function SizeClient({ data }: SizeClientProps) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Tamanhos (${data.length})`}
                    description="Gerencie os tamanhos da sua loja."
                />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Tamanho
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} serachKey="name" />
            <Heading title="API" description="Chamadas de API para os Tamanhos" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    )
}