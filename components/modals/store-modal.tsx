"use client"

import axios from "axios"
import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"
import { redirect } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nome é obrigatório!"
    })
})

export const StoreModal = () => {
    const storeModal = useStoreModal()
    const [loading, setLoading] = useState(false)
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
             
            const response = await axios.post("/api/stores", values)

            console.log(response.data) 
            //Not using the redirect function from next/navigation.ts because it doesn't work well with the planetscale database(something about the database not being ready yet)
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            toast.error("Ocorreu um erro ao criar a loja!")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title="Criar loja"
            description="Adicione uma nova loja para gerenciar seus produtos e categorias"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={loading} 
                                                placeholder="Exemplo: João Achados E-Commerce" 
                                                {...field}
                                            /> 
                                        </FormControl>
                                        <FormMessage  />
                                    </FormItem>
                                )}

                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button 
                                    disabled={loading}
                                    variant="outline" 
                                    onClick={storeModal.onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    disabled={loading}
                                    type="submit" 
                                    variant="default" 
                                >
                                    Criar loja
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            
        </Modal>
    )
}