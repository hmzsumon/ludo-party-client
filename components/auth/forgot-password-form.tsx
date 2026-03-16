"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import AuthInput from "@/components/auth/auth-input";
import Logo from "@/components/branding/logo";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log("Forgot password form data:", data);

    // এখানে API call দেবে
    // await forgotPassword({ email: data.email });
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mt-2 scale-90 sm:scale-100">
        <Logo />
      </div>

      <h1 className="mt-8 text-center text-xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
        Forgot Password
      </h1>

      <p className="mt-2 text-center text-[0.70rem] leading-6 text-white/75">
        Enter your email address to receive a password reset link or code.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex w-full flex-col gap-5"
      >
        <AuthInput
          type="email"
          placeholder="Email Address"
          error={errors.email?.message}
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] py-3 text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/login"
          className="mt-2 flex w-full items-center justify-center rounded-[14px] border border-[#5f72d5]/50 bg-[rgba(8,14,40,0.24)] py-3 text-center text-sm font-extrabold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.2)] transition hover:bg-[rgba(12,20,56,0.32)]"
        >
          Back to Sign In
        </Link>
      </form>

      <div className="mt-8 h-[2px] w-[86%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(74,128,255,0.95),transparent)] shadow-[0_0_12px_rgba(74,128,255,0.9)]" />
    </div>
  );
}
