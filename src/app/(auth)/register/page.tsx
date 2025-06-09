"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";

// 添加动画样式
const animationStyles = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

/**
 * 注册页面组件
 * 支持邮箱密码注册，包含验证码验证和邮箱可用性检查
 */
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 验证码相关状态
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 邮箱验证状态
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [emailCheckTimeout, setEmailCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  // tRPC mutations
  const registerMutation = api.auth.register.useMutation({
    onSuccess: (data) => {
      setSuccess(data.message);
      setError("");
      setIsLoading(false);
      // 3秒后跳转到登录页面
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error) => {
      setError(error.message);
      setSuccess("");
      setIsLoading(false);
      generateCaptcha(); // 重新生成验证码
    },
  });

  const utils = api.useUtils();

  /**
   * 检查邮箱可用性的异步函数
   */
  const checkEmailAvailabilityAsync = async (email: string) => {
    try {
      const result = await utils.auth.checkEmailAvailability.fetch({ email });
      return result;
    } catch (error) {
      console.error("邮箱检查失败:", error);
      return null;
    }
  };

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // 初始化验证码
  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 生成随机验证码
   */
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput("");
    setCaptchaError("");
    drawCaptcha(result);
  };

  /**
   * 在Canvas上绘制验证码
   */
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制验证码文字
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
      const x = (canvas.width / text.length) * (i + 0.5);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.3;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text[i] ?? "", 0, 0);
      ctx.restore();
    }

    // 绘制干扰点
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 60%)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }
  };

  /**
   * 验证验证码
   */
  const validateCaptcha = (): boolean => {
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setCaptchaError("验证码错误");
      return false;
    }
    setCaptchaError("");
    return true;
  };

  /**
   * 检查邮箱可用性（防抖）
   */
  const checkEmailAvailability = (email: string) => {
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    if (!email?.includes("@")) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");

    const timeout = setTimeout(() => {
      void (async () => {
        const result = await checkEmailAvailabilityAsync(email);
        if (result) {
          setEmailStatus(result.available ? "available" : "unavailable");
        } else {
          setEmailStatus("idle");
        }
      })();
    }, 500);

    setEmailCheckTimeout(timeout);
  };

  /**
   * 处理邮箱输入变化
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    checkEmailAvailability(newEmail);
  };

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("请输入用户名");
      return false;
    }

    if (name.length < 2) {
      setError("用户名至少2个字符");
      return false;
    }

    if (name.length > 50) {
      setError("用户名最多50个字符");
      return false;
    }

    if (!email.trim()) {
      setError("请输入邮箱地址");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      return false;
    }

    if (emailStatus === "unavailable") {
      setError("该邮箱已被注册");
      return false;
    }

    if (!password) {
      setError("请输入密码");
      return false;
    }

    if (password.length < 6) {
      setError("密码至少6个字符");
      return false;
    }

    if (password.length > 100) {
      setError("密码最多100个字符");
      return false;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return false;
    }

    return true;
  };

  /**
   * 处理注册表单提交
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 验证验证码
    if (!validateCaptcha()) {
      return;
    }

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    });
  };

  return (
    <>
      <style jsx>{animationStyles}</style>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500 opacity-70 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-500 opacity-70 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-blob animation-delay-4000 absolute top-40 left-40 h-80 w-80 rounded-full bg-pink-500 opacity-70 mix-blend-multiply blur-xl filter"></div>
        </div>

        {/* 注册卡片 */}
        <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-lg">
          {/* 头部 */}
          <div className="relative rounded-t-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <Link
                href="/login"
                className="flex items-center space-x-2 text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">返回登录</span>
              </Link>
              <Link
                href="/"
                className="rounded-full p-2 transition-colors hover:bg-white/20"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
            <h1 className="mb-2 text-3xl font-bold">创建账户</h1>
            <p className="text-blue-100">填写信息完成注册</p>
          </div>

          {/* 注册内容 */}
          <div className="p-6">
            {/* 成功消息 */}
            {success && (
              <div className="mb-4 rounded-lg border border-green-400/30 bg-green-500/20 p-3 text-sm text-green-200">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-300" />
                  <p>{success}</p>
                </div>
                <p className="mt-1 text-xs text-green-300">
                  3秒后自动跳转到登录页面...
                </p>
              </div>
            )}

            {/* 错误消息 */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/20 p-3 text-sm text-red-200">
                <div className="flex items-center">
                  <XCircle className="mr-2 h-5 w-5 text-red-300" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* 注册表单 */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* 用户名输入 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-white/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                    placeholder="请输入用户名"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 邮箱输入 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-white/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full rounded-lg border bg-white/10 py-3 pr-10 pl-10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${
                      emailStatus === "available"
                        ? "border-green-400/50"
                        : emailStatus === "unavailable"
                          ? "border-red-400/50"
                          : "border-white/20"
                    }`}
                    placeholder="请输入邮箱地址"
                    required
                    disabled={isLoading}
                  />
                  {/* 邮箱状态指示器 */}
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                    {emailStatus === "checking" && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                    )}
                    {emailStatus === "available" && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {emailStatus === "unavailable" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </div>
                {emailStatus === "unavailable" && (
                  <p className="mt-1 text-xs text-red-300">该邮箱已被注册</p>
                )}
                {emailStatus === "available" && (
                  <p className="mt-1 text-xs text-green-300">邮箱可用</p>
                )}
              </div>

              {/* 密码输入 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-white/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-10 pl-10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                    placeholder="请输入密码（至少6个字符）"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-white/60 hover:text-white/80"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 确认密码输入 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-white/60" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-10 pl-10 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                    placeholder="请再次输入密码"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-white/60 hover:text-white/80"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 验证码输入 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  验证码
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setCaptchaError("");
                      }}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                      placeholder="请输入验证码"
                      required
                      disabled={isLoading}
                    />
                    {captchaError && (
                      <p className="mt-1 text-xs text-red-300">
                        {captchaError}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <canvas
                      ref={canvasRef}
                      width={100}
                      height={40}
                      className="cursor-pointer rounded border border-white/20 bg-white/10 backdrop-blur-sm"
                      onClick={generateCaptcha}
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-white/60 transition-colors hover:text-white/80"
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading || emailStatus === "unavailable"}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    注册中...
                  </>
                ) : (
                  "立即注册"
                )}
              </button>
            </form>

            {/* 底部链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                已有账户？{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-300 transition-colors hover:text-blue-200"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
