"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"

type BillboardClientProps = {
    data: BillboardColumn[]
}

export default function BillboardClient({ data }: BillboardClientProps) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Painéis (${data.length})`}
                    description="Gerencie os painéis da sua loja."
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Painel
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} serachKey="label" />
            <Heading title="API" description="Chamadas de API para os Painéis" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    )
}