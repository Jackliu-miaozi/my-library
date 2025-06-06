"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Wallet, Eye, EyeOff, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useWeb3 } from '../../context/Web3ContextNoWC';
import { WalletConnectButton } from '../../_components/WalletConnectButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * 登录页面组件
 * 支持邮箱密码登录和Web3钱包登录
 */
export default function LoginPage() {
  const [loginType, setLoginType] = useState<'credentials' | 'web3'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 验证码相关状态
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { data: session } = useSession();
  const { isConnected, account } = useWeb3();
  const router = useRouter();

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (session || (isConnected && account)) {
      router.push('/');
    }
  }, [session, isConnected, account, router]);

  // 初始化验证码
  useEffect(() => {
    generateCaptcha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 生成随机验证码
   */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
    setCaptchaError('');
    drawCaptcha(result);
  };

  /**
   * 在Canvas上绘制验证码
   */
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
    
    // 绘制干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // 绘制验证码文字
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (canvas.width / text.length) * (i + 0.5);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      
      // 随机颜色
      ctx.fillStyle = `hsl(${Math.random() * 60 + 180}, 70%, 80%)`;
      
      // 随机旋转
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(char!, 0, 0);
      ctx.restore();
    }
  };

  /**
   * 验证验证码
   */
  const validateCaptcha = (): boolean => {
    if (!captchaInput.trim()) {
      setCaptchaError('请输入验证码');
      return false;
    }
    
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setCaptchaError('验证码错误');
      generateCaptcha(); // 重新生成验证码
      return false;
    }
    
    setCaptchaError('');
    return true;
  };

  /**
   * 处理邮箱密码登录
   */
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 验证验证码
    if (!validateCaptcha()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('登录失败，请检查邮箱和密码');
        generateCaptcha(); // 登录失败时重新生成验证码
      } else {
        // 登录成功，跳转到首页
        router.push('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('登录过程中发生错误');
      generateCaptcha(); // 出错时重新生成验证码
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理Web3登录
   */
  const handleWeb3Login = async () => {
    if (!isConnected || !account) {
      setError('请先连接钱包');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 这里可以添加Web3登录逻辑，比如签名验证等
      // 暂时模拟登录成功
      console.log('Web3 登录成功，地址:', account);
      // 登录成功，跳转到首页
      router.push('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Web3登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* 登录卡片 */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        {/* 头部 */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">返回首页</span>
            </Link>
            <Link 
              href="/"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">欢迎回来</h1>
          <p className="text-blue-100">选择您的登录方式</p>
        </div>

        {/* 登录内容 */}
        <div className="p-6">
          {/* 登录方式切换 */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            <button
              onClick={() => setLoginType('credentials')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                loginType === 'credentials'
                  ? 'bg-white/20 shadow-md text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="font-medium">邮箱登录</span>
            </button>
            <button
              onClick={() => setLoginType('web3')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                loginType === 'web3'
                  ? 'bg-white/20 shadow-md text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="font-medium">钱包登录</span>
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* 邮箱密码登录表单 */}
          {loginType === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50 transition-colors"
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50 transition-colors"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 验证码 */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  验证码
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setCaptchaError('');
                      }}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50 transition-colors"
                      placeholder="请输入验证码"
                      maxLength={4}
                      required
                    />
                    {captchaError && (
                      <p className="text-red-300 text-xs mt-1">{captchaError}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <canvas
                        ref={canvasRef}
                        width={100}
                        height={40}
                        className="border border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors"
                        onClick={generateCaptcha}
                        title="点击刷新验证码"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="刷新验证码"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* Web3钱包登录 */}
          {loginType === 'web3' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mb-4">
                  <WalletConnectButton />
                </div>
                
                {isConnected && account && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                      <p className="text-sm text-green-200 mb-2">钱包已连接</p>
                      <p className="text-xs text-green-300 font-mono break-all">
                        {account}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleWeb3Login}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      {isLoading ? '登录中...' : '使用钱包登录'}
                    </button>
                  </div>
                )}
                
                {!isConnected && (
                  <p className="text-sm text-white/70 mt-4">
                    请先连接您的钱包以继续登录
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 底部链接 */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              还没有账户？{' '}
              <Link href="/register" className="text-blue-300 hover:text-blue-200 transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 添加动画样式
const styles = `
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

// 在组件外部添加样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}