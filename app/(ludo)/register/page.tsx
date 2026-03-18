"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/ludo/logo";
import PageWrapper from "@/components/wrapper/page";

const RegisterPage = () => {
  return (
    <PageWrapper>
      <Logo />
      <div className="flex flex-col items-center gap-4 mt-2 pb-6">
        {/* page-content ক্লাস থেকে About পেজের মতই animation পাবে */}
        <RegisterForm />
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
