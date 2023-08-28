"use client"

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type AlertModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export function AlertModal({ isOpen, onClose, onConfirm, loading }: AlertModalProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <Modal
            title="Tem certeza?"
            description="Esta ação não pode ser desfeita."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={onConfirm}
                >
                    Confirmar
                </Button>
            </div>
        </Modal>
    )
}