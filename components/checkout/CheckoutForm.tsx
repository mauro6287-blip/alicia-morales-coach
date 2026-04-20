"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useCart } from "@/lib/store/cart";
import { validateRut } from "@/lib/validators";
import { formatRut } from "@/lib/formatters";

const FormSchema = z.object({
  buyerName: z.string().trim().min(2, "Ingresá tu nombre completo"),
  buyerEmail: z.string().trim().email("Email inválido"),
  buyerPhone: z
    .string()
    .trim()
    .min(8, "Teléfono muy corto")
    .regex(/^[0-9+\s()-]{8,}$/, "Formato inválido"),
  buyerRut: z.string().trim().refine(validateRut, "RUT inválido"),
});

type FormData = z.infer<typeof FormSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/checkout/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "No se pudo procesar la orden");
      }
      const { init_point } = await res.json();
      if (!init_point) throw new Error("Respuesta inválida del servidor");
      window.location.href = init_point;
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error inesperado. Intenta nuevamente.",
      );
    }
  };

  const inputCls =
    "w-full rounded-lg border border-[#3F3F46] bg-[#18181B] px-4 py-3 text-white placeholder:text-[#52525B] focus:border-[#FFDE59] focus:outline-none focus:ring-1 focus:ring-[#FFDE59]";
  const errCls = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="buyerName"
          className="mb-1.5 block text-sm font-medium text-white"
        >
          Nombre completo
        </label>
        <input
          id="buyerName"
          type="text"
          autoComplete="name"
          className={inputCls}
          {...register("buyerName")}
        />
        {errors.buyerName && (
          <p className={errCls}>{errors.buyerName.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="buyerEmail"
            className="mb-1.5 block text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            id="buyerEmail"
            type="email"
            autoComplete="email"
            className={inputCls}
            placeholder="tu@email.com"
            {...register("buyerEmail")}
          />
          {errors.buyerEmail && (
            <p className={errCls}>{errors.buyerEmail.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="buyerPhone"
            className="mb-1.5 block text-sm font-medium text-white"
          >
            Teléfono
          </label>
          <input
            id="buyerPhone"
            type="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="+56 9 XXXX XXXX"
            {...register("buyerPhone")}
          />
          {errors.buyerPhone && (
            <p className={errCls}>{errors.buyerPhone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="buyerRut"
          className="mb-1.5 block text-sm font-medium text-white"
        >
          RUT
        </label>
        <input
          id="buyerRut"
          type="text"
          inputMode="text"
          autoComplete="off"
          className={inputCls}
          placeholder="12.345.678-9"
          {...register("buyerRut", {
            onBlur: (e) => {
              const formatted = formatRut(e.target.value);
              setValue("buyerRut", formatted, { shouldValidate: true });
            },
          })}
        />
        {errors.buyerRut && (
          <p className={errCls}>{errors.buyerRut.message}</p>
        )}
        <p className="mt-1 text-xs text-[#A1A1AA]">
          Necesario para la emisión de boleta/factura.
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full rounded-full bg-[#FFDE59] px-5 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#F7B52A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Procesando..." : "Pagar con Mercado Pago"}
      </button>

      <p className="text-center text-xs text-[#A1A1AA]">
        Al pagar serás redirigido al sitio seguro de Mercado Pago.
      </p>
    </form>
  );
}
