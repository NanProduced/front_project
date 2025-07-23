import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义保护路由配置
const protectedRoutes = [
  {
    path: '/dashboard',
    roles: ['admin', 'user', 'viewer']
  },
  {
    path: '/devices',
    roles: ['admin', 'user', 'viewer']
  },
  {
    path: '/contents',
    roles: ['admin', 'user', 'viewer']
  },
  {
    path: '/users',
    roles: ['admin'] // 只有管理员可访问用户管理
  },
  {
    path: '/permissions',
    roles: ['admin'] // 只有管理员可访问权限配置
  },
  {
    path: '/messages',
    roles: ['admin', 'user', 'viewer']
  },
  {
    path: '/analytics',
    roles: ['admin', 'user'] // 管理员和普通用户可访问分析页面
  },
];

// 公开路径，不需要认证
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/auth-test', // 调试用的认证测试页
  '/api/',
  '/_next',
  '/favicon.ico',
  '/static'
];

// 可能的认证cookie名称
const possibleAuthCookies = [
  'auth_token',          // 我们假设的认证token
  'user_role',           // 我们假设的角色token
  'JSESSIONID',          // Spring Security常用
  'SESSION',             // 通用session标识符
  'remember-me',         // Spring Security的remember-me
  'XSRF-TOKEN',          // CSRF token
  'access_token',        // OAuth2 常见token
  'refresh_token',       // OAuth2 常见token
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 检查认证状态 - 更灵活地检查任何可能的认证cookie
  let isAuthenticated = false;
  let userRole = 'viewer'; // 默认角色

  // 检查是否有任何认证相关cookie
  const cookies = request.cookies;
  const allCookieNames = cookies.getAll().map(c => c.name);
  
  // 至少存在一个可能的认证cookie即视为已认证
  const hasAnyCookies = allCookieNames.some(name => {
    return possibleAuthCookies.includes(name) || 
           name.includes('auth') || 
           name.includes('token') ||
           name.includes('session');
  });
  
  isAuthenticated = hasAnyCookies;

  // 尝试获取用户角色
  const roleCookie = cookies.get('user_role');
  if (roleCookie) {
    userRole = roleCookie.value;
  } else {
    // 如果没有明确的角色cookie，但存在其他认证cookie，
    // 暂时设为最宽松的角色以便访问基本页面
    if (isAuthenticated) {
      userRole = 'viewer';
    }
  }

  // 如果没有认证，重定向到登录页面
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 检查当前路径是否是受保护的路由
  const protectedRoute = protectedRoutes.find(route => pathname.startsWith(route.path));
  if (protectedRoute && !protectedRoute.roles.includes(userRole)) {
    // 如果用户角色不允许访问此路由，则重定向到仪表盘
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * 1. 静态资源文件 (_next)
     * 2. 公开API路由 (api/public)
     * 3. 静态文件 (如 favicon.ico, public目录下的文件)
     */
    '/((?!_next|api/public|static|.*\\..*|favicon.ico).*)',
  ],
}; 