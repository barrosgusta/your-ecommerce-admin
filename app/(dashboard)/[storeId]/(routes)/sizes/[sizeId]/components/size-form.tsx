"use client"

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client"
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nome é obrigatório!"
    }),
    value: z.string().min(1, {
        message: "Valor é obrigatório!"
    })
})

type SizeFormProps = {
    initialData: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>

export default function SizeForm({ initialData }: SizeFormProps) {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar tamanho" : "Criar tamanho"
    const description = initialData ? "Edite as informações do tamanho" : "Preencha as informações do tamanho"
    const toastMessage = initialData ? "Alterações salvas com sucesso!" : "Tamanho criado com sucesso!"
    const action = initialData ? "Salvar Alterações" : "Criar Tamanho"

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Ocorreu um erro!")
        } finally {
            setLoading(false)
        }
        console.log(data)
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success("Tamanho excluído com sucesso!");
        } catch (error) {
            toast.error("Ocorreu um erro ao excluir o tamanho. Certifique-se de remover todos os produtos que usam esse tamanho.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => onDelete()}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                {initialData && (<Button
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rótulo</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nome do tamanho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="value" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rótulo</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Valor do tamanho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}