import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { AuthService } from "../../service/api";
import { useFormik } from "formik";
import { loginValidationSchema } from "../../helpers/formik";
import { useEffect, useState } from "react";
import { useAuth } from "../../helpers/AuthContext";
import toast from "react-hot-toast";
import { useLoader } from "../../helpers/hooks";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {loading, handleLoader} = useLoader()

  const initialValues = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/movies");
    }
  })
  const onSubmit = async () => {
    try {
      handleLoader(true)
      const data: any = await AuthService.login(values.email, values.password);
      handleLoader(false)
      if (data.status) {
        login(data.token);
        localStorage.setItem("userId", data?.data?.id);
        navigate("/movies");
        toast.success("Login successful");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginValidationSchema,
    onSubmit: () => {
      onSubmit();
    },
  });

  return (
    <>
      <h1 className="cursor-pointer text-xl font-bold text-white text-center bg-red-500 p-2">Booker.com</h1>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-outfit">
      
      <div className="w-[90%] max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-300">
        <h1 className="text-2xl font-semibold text-center text-red-500 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              onBlur={handleBlur}
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs absolute left-0 bottom-[-20px] py-1">{errors.email}</p>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              onBlur={handleBlur}
              value={values.password}
              onChange={handleChange}
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
          <Button
            text="Login"
            type="submit"
              style="w-full font-outfit bg-red-400 text-white p-3 rounded hover:bg-red-500 transition"
              isLoading={loading}
          />
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span className="text-red-500 cursor-pointer" onClick={() => navigate("/register")}>
            Click here
          </span>
        </p>
      </div>
      </div>
    </>
  );
};

export default Login;
