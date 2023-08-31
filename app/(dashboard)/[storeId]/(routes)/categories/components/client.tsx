"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

type CategoryClientProps = {
    data: CategoryColumn[]
}

export default function CategoryClient({ data }: CategoryClientProps) {
    const router = useRouter();
    const params = useParams(); 

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categorias (${data.length})`}
                    description="Gerencie as categorias da sua loja."
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} serachKey="name" />
            <Heading title="API" description="Chamadas de API para as Categorias" />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}