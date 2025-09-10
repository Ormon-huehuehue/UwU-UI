import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json(
      { error: 'File parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Ensure the file path is within the components directory
    const normalizedPath = path.normalize(file).replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'src', normalizedPath);

    // Security check to prevent directory traversal
    if (!fullPath.startsWith(path.join(process.cwd(), 'src'))) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    // Read the file
    const code = fs.readFileSync(fullPath, 'utf-8');
    
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}
