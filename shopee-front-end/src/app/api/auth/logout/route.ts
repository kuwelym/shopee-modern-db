import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  try {
    const response = await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textData = await response.text();
      responseData = { message: textData };
    }
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
