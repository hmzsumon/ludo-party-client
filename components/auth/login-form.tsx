"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import AuthInput from "@/components/auth/auth-input";
import Logo from "@/components/branding/logo";

type LoginFormValues = {
  mobileNumber: string;
  password: string;
};

export default function LoginForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login form data:", data);
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className=" scale-90 sm:scale-100">
        <Logo />
      </div>

      <h1 className="mt-4 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-col gap-5"
      >
        <AuthInput
          type="tel"
          placeholder="Mobile Number"
          error={errors.mobileNumber?.message}
          {...register("mobileNumber", {
            required: "Mobile number is required",
          })}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
          })}
        />

        <div className="-mt-1 mb-2 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className=" py-2 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        <Link
          href="/register"
          className="mt-2 flex py-2 w-full items-center justify-center rounded-[14px] border border-[#5f72d5]/50 bg-[rgba(8,14,40,0.24)] text-center text-xl font-extrabold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.2)] transition hover:bg-[rgba(12,20,56,0.32)]"
        >
          Create New Account
        </Link>
      </form>

      <div className="mt-8 h-[2px] w-[86%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(74,128,255,0.95),transparent)] shadow-[0_0_12px_rgba(74,128,255,0.9)]" />
    </div>
  );
}
