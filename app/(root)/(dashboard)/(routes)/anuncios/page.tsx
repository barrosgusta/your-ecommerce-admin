import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { AdColumn } from "./components/columns";
import AdClient from "./components/client";
import getAdsCount from "@/actions/get-ads-count";

export default async function AdPage() { 
    const { userId } = auth();
    const adsCount = await getAdsCount();

    // console.log(userId);
    const ads = await prismadb.carAd.findMany({
        where: {
            sellerId: userId || ""
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedAds: AdColumn[] = ads.map((item) => ({
        id: item.id,
        brand: item.brand,
        model: item.model,
        year: item.year,
        fuel: item.fuel,
        kms: item.kms,
        isTurbo: item.isTurbo,
        stage: item.stage,
        price: formatCurrency(item.price.toNumber()),
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        createdAt: format(item.createdAt, "do 'de' MMMM, yyyy", {
            locale: ptBR
        })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AdClient data={formattedAds} adsCount={adsCount} />
            </div>
        </div>
    )
}