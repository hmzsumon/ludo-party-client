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
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [normalizedEmail, triggerEmailCheck, setError, clearErrors, errors.email]);

  useEffect(() => {
    if (touchedFields.fullName && fullName) clearErrors("fullName");
  }, [fullName, touchedFields.fullName, clearErrors]);
  useEffect(() => {
    if (touchedFields.email && normalizedEmail) clearErrors("email");
  }, [normalizedEmail, touchedFields.email, clearErrors]);
  useEffect(() => {
    if (touchedFields.mobileNumber && mobileNumber) clearErrors("mobileNumber");
  }, [mobileNumber, touchedFields.mobileNumber, clearErrors]);
  useEffect(() => {
    if (touchedFields.password && password) clearErrors("password");
  }, [password, touchedFields.password, clearErrors]);
  useEffect(() => {
    if (touchedFields.confirmPassword && confirmPassword)
      clearErrors("confirmPassword");
  }, [confirmPassword, touchedFields.confirmPassword, clearErrors]);
  useEffect(() => {
    if (touchedFields.partnerCode && partnerCode) clearErrors("partnerCode");
  }, [partnerCode, touchedFields.partnerCode, clearErrors]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (emailCheckState.data?.exists) {
        setError("email", { type: "server", message: "Email already exists" });
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
        setError("email", { type: "server", message: "Email already exists" });
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
        setError("partnerCode", { type: "server", message });
        toast.error(message);
        return;
      }
      setError("mobileNumber", { type: "server", message });
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center w-full">
      {/* ── Logo ── */}
      <div className="scale-90 sm:scale-100 ls-float">
        <Logo />
      </div>

      {/* ── Title ── */}
      <div className=" text-center">
        <h1 className="text-[28px] font-black tracking-tight text-white">
          Join the Game!
        </h1>
        <p className="text-sm text-white/50 font-semibold mt-1">
          Create your account & start winning
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="mt-4 flex w-full items-center gap-3">
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,215,0,0.3))",
          }}
        />
        <span className="text-yellow-400/60 text-xs font-bold">
          ✦ REGISTER ✦
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,215,0,0.3), transparent)",
          }}
        />
      </div>

      {/* ── Form Card ── */}
      <div
        className="mt-4 w-full rounded-3xl overflow-hidden p-5"
        style={{
          background:
            "linear-gradient(145deg, rgba(74,26,138,0.5) 0%, rgba(29,5,70,0.6) 100%)",
          border: "1px solid rgba(255,215,0,0.15)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              👤 Full Name
            </label>
            <AuthInput
              type="text"
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
                onChange: () => {
                  if (errors.fullName) clearErrors("fullName");
                },
              })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              📧 Email Address
            </label>
            <AuthInput
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                onChange: () => {
                  if (errors.email) clearErrors("email");
                },
              })}
            />
            {normalizedEmail && !errors.email && emailCheckState.isFetching && (
              <p className="mt-1 pl-1 text-xs font-semibold text-white/50">
                Checking email...
              </p>
            )}
            {normalizedEmail &&
              !errors.email &&
              emailCheckState.data &&
              !emailCheckState.data.exists && (
                <p className="mt-1 pl-1 text-xs font-semibold text-green-400">
                  ✓ Email is available
                </p>
              )}
          </div>

          {/* Mobile */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              📱 Mobile Number
            </label>
            <AuthInput
              type="tel"
              placeholder="Enter your mobile number"
              error={errors.mobileNumber?.message}
              {...register("mobileNumber", {
                required: "Mobile number is required",
                minLength: {
                  value: 6,
                  message: "Please enter a valid mobile number",
                },
                onChange: () => {
                  if (errors.mobileNumber) clearErrors("mobileNumber");
                },
              })}
            />
          </div>

          {/* Referral Code */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              🎁 Referral Code{" "}
              <span className="text-white/30 normal-case font-semibold">
                (Optional)
              </span>
            </label>
            <AuthInput
              type="text"
              placeholder="Enter referral code"
              error={errors.partnerCode?.message}
              {...register("partnerCode", {
                onChange: () => {
                  if (errors.partnerCode) clearErrors("partnerCode");
                },
              })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              🔒 Password
            </label>
            <AuthInput
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                onChange: () => {
                  if (errors.password) clearErrors("password");
                  if (errors.confirmPassword) clearErrors("confirmPassword");
                },
              })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-yellow-400/70">
              🔒 Confirm Password
            </label>
            <AuthInput
              type="password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
                onChange: () => {
                  if (errors.confirmPassword) clearErrors("confirmPassword");
                },
              })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="ls-btn ls-btn-gold ls-shine-effect w-full py-3.5 text-[16px] font-black mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-amber-900/50 border-t-amber-900 animate-spin" />
                Creating Account...
              </span>
            ) : (
              "🎮 Create Account"
            )}
          </button>
        </form>
      </div>

      {/* ── Login Link ── */}
      <p className="mt-5 text-center text-sm font-semibold text-white/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-black text-yellow-400 hover:text-yellow-300 transition"
        >
          Sign In
        </Link>
      </p>

      {/* ── Bottom Divider ── */}
      <div
        className="mt-6 h-[2px] w-[70%] rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)",
        }}
      />
    </div>
  );
}
