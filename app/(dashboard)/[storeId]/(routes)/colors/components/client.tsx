"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

type ColorClientProps = {
    data: ColorColumn[]
}

export default function SizeClient({ data }: ColorClientProps) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Cores (${data.length})`}
                    description="Gerencie as cores da sua loja."
                />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Cor
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} serachKey="name" />
            <Heading title="API" description="Chamadas de API para as Cores" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}