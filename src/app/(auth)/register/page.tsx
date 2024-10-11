"use client";
import { RegisterForm } from "./_components/register_form";

const RegisterPage = (): JSX.Element => {
  return (
    <div className="w-screen h-fit flex flex-col justify-start items-center mt-12 mb-3">
      <h1 className="text-title-xl-strong uppercase font-semibold">
        Đăng ký
      </h1>
	  <h5 className="text-gray-500">(Dành cho người sắp xếp thời khóa biểu)</h5>
      <div className="login-container w-[25%] mt-4">
        <RegisterForm />
      </div>
    </div>
  );
};
export default RegisterPage;
