import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Login | Painel do Administrador',
    description: 'Login | Painel do Administrador',
  }

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    )
}