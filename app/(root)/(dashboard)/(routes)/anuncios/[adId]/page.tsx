import prismadb from "@/lib/prismadb";
import AdForm from "./components/ad-form";
import { auth } from "@clerk/nextjs";
import getAdsCount from "@/actions/get-ads-count";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Error from "@/components/ui/error";
import axios from "axios";

export type brand = {
    name: string,
    code: string
}

export type model = {
    name: string,
    code: string,
}

export type brandModel = {
    name: string,
    code: string,
    brandId: string
}

export default async function AdsPage({ params }: { params: { adId: string } }) {
    const adsCount = await getAdsCount();

    const ad = await prismadb.carAd.findUnique({
        where: {
            id: params.adId
        },
        include: {
            images: true
        }
    });

    const brands = (await axios.get("https://parallelum.com.br/fipe/api/v2/cars/brands")).data;


    const brandModelsPromises = brands.map(async (brand: brand) => {
        const models = (await axios.get(`https://parallelum.com.br/fipe/api/v2/cars/brands/${brand.code}/models`)).data
        return models.map((model: model) => ({
            ...model,
            brandId: brand.code
        }))
    })

    const brandModels: brandModel[] = await Promise.all(brandModelsPromises);

    const flatBrandModels = brandModels.flat();

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {adsCount !== 0 ? (
                    <Error message="Número máximo de anúncios na conta gratis" />
                ) : (
                    <AdForm 
                        initialData={ad} 
                        brands={brands}
                        brandModels={flatBrandModels}
                    />
                )}
                
            </div>
        </div>
    )
}