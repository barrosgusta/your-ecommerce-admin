import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

export default async function OrdersPage({ params }: { params: { storeId: string }}) { 
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((item) => item.product.name).join(", "),
        isPaid: item.isPaid,
        totalPrice: formatCurrency(item.orderItems.reduce((total, item) => {
            return total + item.product.price.toNumber()
        }, 0)),
        createdAt: format(item.createdAt, "do 'de' MMMM, yyyy", {
            locale: ptBR
        })
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedOrders} />
            </div>
        </div>
    )
}