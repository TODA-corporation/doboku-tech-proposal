import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
  // 環境変数が設定されていない場合はロックをかけない（事故防止）
  if (!process.env.BASIC_AUTH_USER || !process.env.BASIC_AUTH_PASSWORD) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // IDとパスワードが一致したら通す
    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  // 認証ダイアログを表示する
  return new NextResponse('Auth Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}