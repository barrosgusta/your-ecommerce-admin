"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import toast from "react-hot-toast"
// import ApiList from "@/components/ui/api-list"
// import router from "next/router"

type CarAdClientProps = {
    data: AdColumn[],
    adsCount: number
};

export default function AdClient({ data, adsCount }: CarAdClientProps) {
    const router = useRouter();
    // console.log(data);

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Anúncios `}
                    description="Gerencie os seus anúncios."
                />
                <Button onClick={() => {adsCount === 0 ? router.push("/anuncios/new") : toast.error("Número máximo de anúncios na conta gratis")}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Anúncio
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} serachKey="model" />
            {/* <Heading title="API" description="Chamadas de API para os Produtos" /> */}
            {/* <Separator /> */}
            {/* <ApiList entityName="products" entityIdName="productId" /> */}
        </>
    )
}