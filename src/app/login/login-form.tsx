// src/app/login/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModernButton } from "@/components/ui/ModernButton";
import { ModernInput } from "@/components/ui/ModernInput";
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
  ModernCardTitle,
} from "@/components/ui/ModernCard";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Captura callbackUrl (padrão: /dashboard, pode ajustar para "/")
  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") || "/dashboard",
    [searchParams]
  );

  // Se NextAuth colocou ?error=CredentialsSignin (ou outro) na URL, mostra mensagem
  const authErrorFromQuery = searchParams.get("error");
  useEffect(() => {
    if (authErrorFromQuery) {
      setLocalError(
        authErrorFromQuery === "CredentialsSignin"
          ? "Credenciais inválidas. Verifique seu e-mail e senha."
          : "Não foi possível autenticar. Tente novamente."
      );
    }
  }, [authErrorFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Informe e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!result) {
        setLocalError("Resposta inesperada do servidor. Tente novamente.");
        return;
      }

      if (result.error) {
        setLocalError("Credenciais inválidas. Verifique seu e-mail e senha.");
        return;
      }

      // Sucesso: navega para o callbackUrl resolvido pelo NextAuth
      router.replace(result.url ?? callbackUrl);
    } catch (err) {
      console.error(err);
      setLocalError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <ModernCard variant="elevated" className="w-full max-w-md animate-fade-in-up">
        <ModernCardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <ModernCardTitle size="lg" className="text-gradient-primary">
            Bem-vindo de volta!
          </ModernCardTitle>
          <p className="text-gray-600 mt-2">
            Digite suas credenciais para acessar o sistema.
          </p>
        </ModernCardHeader>

        <ModernCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              variant="filled"
              required
              autoComplete="email"
            />

            <ModernInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              variant="filled"
              required
              autoComplete="current-password"
            />

            {localError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {localError}
              </div>
            )}

            <ModernButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Entrar
            </ModernButton>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Usuário de teste:{" "}
            <span className="font-semibold text-gray-700">admin@igreja.com</span>{" "}
            / <span className="font-semibold text-gray-700">admin123</span>
          </p>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
}
