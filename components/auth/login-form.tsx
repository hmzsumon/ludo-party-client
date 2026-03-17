"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import AuthInput from "@/components/auth/auth-input";
import Logo from "@/components/branding/logo";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";

type LoginFormValues = {
  mobileNumber: string;
  password: string;
};

function getApiError(error: any): string {
  return (
    error?.data?.error ||
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "Login failed. Please try again."
  );
}

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
  });

  const mobileNumber = watch("mobileNumber");
  const password = watch("password");

  /* ────────── Clear Field Errors On Typing ────────── */
  useEffect(() => {
    if (touchedFields.mobileNumber && mobileNumber) {
      clearErrors("mobileNumber");
    }
  }, [mobileNumber, touchedFields.mobileNumber, clearErrors]);

  useEffect(() => {
    if (touchedFields.password && password) {
      clearErrors("password");
    }
  }, [password, touchedFields.password, clearErrors]);

  /* ────────── Submit Login Form ────────── */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginUser({
        phone: data.mobileNumber.trim(),
        password: data.password,
      }).unwrap();

      toast.success(response?.message || "Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      const message = getApiError(error);
      const lowerMessage = message.toLowerCase();
      console.error("Login error:", error.status);

      /* ────────── Handle Mobile Related Error ────────── */
      if (lowerMessage.includes("mobile") || lowerMessage.includes("phone")) {
        setError("mobileNumber", {
          type: "server",
          message,
        });

        toast.error(message);
        return;
      }

      /* ────────── Handle Password Related Error ────────── */
      if (lowerMessage.includes("password")) {
        setError("password", {
          type: "server",
          message,
        });

        toast.error(message);
        return;
      }

      /* ────────── Handle Invalid Credential Error ────────── */
      if (
        lowerMessage.includes("invalid") ||
        lowerMessage.includes("credential") ||
        lowerMessage.includes("not found") ||
        lowerMessage.includes("verify your email")
      ) {
        setError("mobileNumber", {
          type: "server",
          message,
        });

        setError("password", {
          type: "server",
          message,
        });

        toast.error(message);
        return;
      }

      /* ────────── Handle Fallback Error ────────── */
      setError("mobileNumber", {
        type: "server",
        message,
      });

      setError("password", {
        type: "server",
        message,
      });

      toast.error(message);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="scale-90 sm:scale-100">
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
            minLength: {
              value: 6,
              message: "Please enter a valid mobile number",
            },
            onChange: () => {
              if (errors.mobileNumber) {
                clearErrors("mobileNumber");
              }
            },
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
            onChange: () => {
              if (errors.password) {
                clearErrors("password");
              }
            },
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
          disabled={isLoading}
          className="py-2 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isLoading ? "Signing In..." : "Sign In"}
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
