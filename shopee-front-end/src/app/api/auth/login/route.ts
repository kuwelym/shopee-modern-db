import { NextResponse } from 'next/server';

export async function login(username: string, password: string) {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
