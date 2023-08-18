"use client"

import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"

export const StoreModal = () => {
    const storeModal = useStoreModal()

    return (
        <Modal
            title="Criar loja"
            description="Adicione uma nova loja para gerenciar seus produtos e categorias"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            children
        </Modal>
    )
}