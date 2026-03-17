"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import AuthInput from "@/components/auth/auth-input";
import Logo from "@/components/branding/logo";
import {
  useLazyCheckEmailExistOrNotQuery,
  useRegisterUserMutation,
} from "@/redux/features/auth/authApi";

type RegisterFormValues = {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  partnerCode: string;
};

function getApiError(error: any): string {
  return (
    error?.data?.error ||
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "Registration failed. Please try again."
  );
}

export default function RegisterForm(): JSX.Element {
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [triggerEmailCheck, emailCheckState] =
    useLazyCheckEmailExistOrNotQuery();

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      partnerCode: "",
    },
  });

  const fullName = watch("fullName");
  const email = watch("email");
  const mobileNumber = watch("mobileNumber");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const partnerCode = watch("partnerCode");

  const normalizedEmail = useMemo(
    () => email?.trim().toLowerCase() || "",
    [email],
  );

  /* ────────── Live Email Check ────────── */
  useEffect(() => {
    if (!normalizedEmail) return;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) return;

    const timer = setTimeout(async () => {
      try {
        const result = await triggerEmailCheck(normalizedEmail).unwrap();

        if (result?.exists) {
          setError("email", {
            type: "server",
            message: "Email already exists",
          });
        } else if (errors.email?.type === "server") {
          clearErrors("email");
        }
      } catch {
        /* ────────── Silent Email Check Fail ────────── */
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [normalizedEmail, triggerEmailCheck, setError, clearErrors, errors.email]);

  /* ────────── Clear Smart Errors On Typing ────────── */
  useEffect(() => {
    if (touchedFields.fullName && fullName) clearErrors("fullName");
  }, [fullName, touchedFields.fullName, clearErrors]);

  useEffect(() => {
    if (touchedFields.email && normalizedEmail) clearErrors("email");
  }, [normalizedEmail, touchedFields.email, clearErrors]);

  useEffect(() => {
    if (touchedFields.mobileNumber && mobileNumber) {
      clearErrors("mobileNumber");
    }
  }, [mobileNumber, touchedFields.mobileNumber, clearErrors]);

  useEffect(() => {
    if (touchedFields.password && password) clearErrors("password");
  }, [password, touchedFields.password, clearErrors]);

  useEffect(() => {
    if (touchedFields.confirmPassword && confirmPassword) {
      clearErrors("confirmPassword");
    }
  }, [confirmPassword, touchedFields.confirmPassword, clearErrors]);

  useEffect(() => {
    if (touchedFields.partnerCode && partnerCode) clearErrors("partnerCode");
  }, [partnerCode, touchedFields.partnerCode, clearErrors]);

  /* ────────── Submit Register Form ────────── */
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (emailCheckState.data?.exists) {
        setError("email", {
          type: "server",
          message: "Email already exists",
        });

        toast.error("Email already exists");
        return;
      }

      const response = await registerUser({
        name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.mobileNumber.trim(),
        password: data.password,
        partnerCode: data.partnerCode?.trim() || undefined,
      }).unwrap();

      toast.success(response?.message || "Verification email sent");

      router.push(
        `/verify-email?email=${encodeURIComponent(data.email.trim().toLowerCase())}`,
      );
    } catch (error: any) {
      const message = getApiError(error);
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("email")) {
        setError("email", {
          type: "server",
          message: "Email already exists",
        });

        toast.error("Email already exists");
        return;
      }

      if (lowerMessage.includes("mobile") || lowerMessage.includes("phone")) {
        setError("mobileNumber", {
          type: "server",
          message: "Mobile number already exists",
        });

        toast.error("Mobile number already exists");
        return;
      }

      if (lowerMessage.includes("referral")) {
        setError("partnerCode", {
          type: "server",
          message,
        });

        toast.error(message);
        return;
      }

      setError("mobileNumber", {
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
            minLength: {
              value: 3,
              message: "Full name must be at least 3 characters",
            },
            onChange: () => {
              if (errors.fullName) {
                clearErrors("fullName");
              }
            },
          })}
        />

        <div>
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
              onChange: () => {
                if (errors.email) {
                  clearErrors("email");
                }
              },
            })}
          />

          {normalizedEmail && !errors.email && emailCheckState.isFetching ? (
            <p className="mt-1 pl-1 text-xs font-semibold text-white/60">
              Checking email...
            </p>
          ) : null}

          {normalizedEmail &&
          !errors.email &&
          emailCheckState.data &&
          !emailCheckState.data.exists ? (
            <p className="mt-1 pl-1 text-xs font-semibold text-emerald-400">
              Email is available
            </p>
          ) : null}
        </div>

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
          type="text"
          placeholder="Referral Code (Optional)"
          error={errors.partnerCode?.message}
          {...register("partnerCode", {
            onChange: () => {
              if (errors.partnerCode) {
                clearErrors("partnerCode");
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
              if (errors.confirmPassword) {
                clearErrors("confirmPassword");
              }
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
            onChange: () => {
              if (errors.confirmPassword) {
                clearErrors("confirmPassword");
              }
            },
          })}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl border border-lime-300/30 bg-[linear-gradient(180deg,#8cf61e_0%,#46c81d_56%,#0a991f_100%)] py-2 text-xl font-extrabold tracking-tight text-white shadow-[inset_0_8px_14px_rgba(255,255,255,0.12),inset_0_-6px_10px_rgba(0,0,0,0.16),0_8px_22px_rgba(0,0,0,0.34)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isLoading ? "Registering..." : "Register"}
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
