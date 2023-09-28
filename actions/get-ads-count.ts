import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export default async function getAdsCount() {
    const { userId } = auth();
    const adsCount = await prismadb.carAd.count({
    where: {
        sellerId: userId || "",
    }});

    return adsCount;
};