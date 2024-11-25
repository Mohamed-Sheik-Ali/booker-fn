import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerValidationSchema } from "../../helpers/formik";
import { AuthService } from "../../service/api";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import toast from "react-hot-toast";
import { useLoader } from "../../helpers/hooks";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  const { loading, handleLoader } = useLoader()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const onSubmit = async () => {
    handleLoader(true)
    const data: any = await AuthService.register(values.username, String(values.email), String(values.password))
    handleLoader(false)
    if (data.status) {
      handleShowToast();
      localStorage.setItem('token', data?.token)
      localStorage.setItem('userId', data?.data?.id)
      navigate('/movies')
      toast.success("Registration successful");
    } else {
      console.error(data.message || "Registration failed");
      toast.error(data.message || "Registration failed");
    }

  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: registerValidationSchema,
    onSubmit: () => {
      onSubmit();
    }
  })

  return (
    <>
      <h1 className="cursor-pointer text-xl font-bold text-white text-center bg-red-500 p-2">Booker.com</h1>
      {showToast && (
        <Toast
          message="Registered Successfully!!"
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-outfit">
        <div className="w-[90%] max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-300">
          <h1 className="text-2xl flex items-center gap-2 font-semibold text-center text-red-500 mb-6">
            Register
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-xs absolute left-0 bottom-[-20px] py-1">{errors.username}</p>
              )}
            </div>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs absolute left-0 bottom-[-20px] py-1">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs absolute left-0 bottom-[-20px] py-1">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-r"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs absolute left-0 bottom-[-20px] py-1">{errors.confirmPassword}</p>
              )}
            </div>
            <Button text="Register" type="submit" style="w-full bg-red-400 text-white p-3 rounded font-outfit hover:bg-red-500 transition" isLoading={loading} />
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Click here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
export default Register;
