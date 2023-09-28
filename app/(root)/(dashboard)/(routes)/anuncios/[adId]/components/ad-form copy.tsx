"use client"

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CarAd, Image } from "@prisma/client"
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@clerk/nextjs";
import getAdsCount from "@/actions/get-ads-count";

const formSchema = z.object({
    brand: z.string().min(1, {
        message: "Marca é obrigatório!"
    }),
    model: z.string().min(1, {
        message: "Marca é obrigatório!"
    }),
    year: z.coerce.number().min(1, {
        message: "Ano é obrigatório!"
    }),
    images: z.object({ url: z.string().url({
        message: "URL inválida!"
    }) }).array().min(1, {
        message: "Imagens são obrigatórias!"
    }),
    price: z.coerce.number().min(1, {
        message: "Preço é obrigatório!"
    }), 
    fuel: z.string().min(1, {
        message: "Combustível é obrigatório!"
    }),
    kms: z.coerce.number().min(1, {
        message: "Kilômetragem é obrigatório!"
    }),
    stage: z.coerce.number(),
    description: z.string().min(1, {
        message: "Descrição é obrigatório!"
    }),
    isTurbo: z.boolean().default(false).optional(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type AdFormProps = {
    initialData: CarAd & {
        images: Image[]
    } | null;
}

type AdFormValues = z.infer<typeof formSchema>

export default function AdForm({ initialData }: AdFormProps) {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar anúncio" : "Criar anúncio"
    const description = initialData ? "Edite as informações do anúncio" : "Preencha as informações do anúncio"
    const toastMessage = initialData ? "Alterações salvas com sucesso!" : "Anúncio criado com sucesso!"
    const action = initialData ? "Salvar Alterações" : "Criar Anúncio"

    const form = useForm<AdFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(initialData.price.toString()),
        } : {
            brand: "",
            model: "",
            year: 0,
            images: [],
            price: 0,
            fuel: "",
            kms: 0,
            stage: 0,
            description: "",
            isTurbo: false,
            isFeatured: false,
            isArchived: false,
        }
    })

    const onSubmit = async (data: AdFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/anuncios/${params.adId}`, data);
            } else {
                await axios.post(`/api/anuncios`, data);
            }
            router.refresh();
            router.push(`/anuncios`);
            toast.success(toastMessage);
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
            await axios.delete(`/api/anuncios/${params.adId}`);
            router.refresh();
            router.push(`/anuncios`);
            toast.success("Anúncio excluído com sucesso!");
        } catch (error) {
            toast.error("Ocorreu um erro ao excluir o anúncio");
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
                    <FormField 
                        control={form.control}
                        name="images" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagens</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map((image) => image.url)} 
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="brand" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marca</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Marca" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="model" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modelo</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Modelo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="year" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ano</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Ano" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="fuel" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Combustível</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Combustível" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="kms" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kilômetragem</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Kilômetragem" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="stage" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stage</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Stage" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="Preço" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Descrição" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* <FormField 
                            control={form.control}
                            name="name" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nome do produto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="29.99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select
                                        disabled={loading}                                            
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Selecione uma categoria" 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name} 
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sizeId" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tamanho</FormLabel>
                                    <Select
                                        disabled={loading}                                            
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Selecione um tamanho" 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name} 
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorId" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor</FormLabel>
                                    <Select
                                        disabled={loading}                                            
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Selecione uma cor" 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name} 
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                                            /> */}
                        <FormField 
                            control={form.control}
                            name="isTurbo" 
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Turbo</FormLabel>
                                        <FormDescription>Indica se o carro é turbo aspirado</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured" 
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Destaque</FormLabel>
                                        <FormDescription>Exibir esse anúncio na página inicial</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived" 
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Arquivado</FormLabel>
                                        <FormDescription>O anúncio nâo irá aparecer na loja</FormDescription>
                                    </div>
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