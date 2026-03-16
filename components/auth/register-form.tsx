"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import AuthInput from "@/components/auth/auth-input";
import Logo from "@/components/branding/logo";

type RegisterFormValues = {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Register form data:", data);
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className=" scale-90 sm:scale-100">
        <Logo />
      </div>

      <h1 className="mt-2 text-center text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]">
        Register
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex w-full flex-col gap-4"
      >
        <AuthInput
          type="text"
          placeholder="Full Name"
          error={errors.fullName?.message}
          {...register("fullName", {
            required: "Full name is required",
          })}
        />

        <AuthInput
          type="email"
          placeholder="Email Address"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

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
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <AuthInput
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 py-2 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm font-medium text-white/80">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-extrabold text-[#79a7ff] transition hover:text-[#9fc0ff]"
        >
          Sign In
        </Link>
      </p>

      <div className="mt-2 h-[2px] w-[86%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(74,128,255,0.95),transparent)] shadow-[0_0_12px_rgba(74,128,255,0.9)]" />
    </div>
  );
}
