import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  try {
    const response = await fetch('http://localhost:8080/auth/register', {
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
    console.error('Registration API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
