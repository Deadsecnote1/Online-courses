import { NextResponse } from 'next/server';
import { INITIAL_COURSES } from '@/data/mockCourses';
import { generateUdemyAffiliateUrl } from '@/utils/affiliate';
import { Course } from '@/types/course';

// Verification helper
function checkAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY || 'admin123';
  return authHeader === `Bearer ${adminKey}`;
}

export async function GET(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    courses: INITIAL_COURSES,
  });
}

export async function POST(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, instructor, original_price, coupon_code, raw_udemy_url, image_url, duration, level, is_featured, expiry_hours } = body;

    if (!title || !raw_udemy_url || !coupon_code) {
      return NextResponse.json({ success: false, error: 'Title, Udemy URL, and Coupon Code are required' }, { status: 400 });
    }

    const hours = parseInt(expiry_hours || '48');
    const newCourse: Course = {
      id: `udemy-admin-${Date.now()}`,
      title,
      description: description || 'No description provided.',
      category: category || 'Development',
      instructor: instructor || 'Admin Curated',
      rating: 4.8,
      reviews_count: 1200,
      students_count: 15400,
      original_price: parseFloat(original_price || '99.99'),
      coupon_code,
      raw_udemy_url,
      destination_url: generateUdemyAffiliateUrl(raw_udemy_url, coupon_code, 'admin_portal'),
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + hours * 3600 * 1000).toISOString(),
      is_expired: false,
      is_featured: !!is_featured,
      report_count: 0,
      image_url: image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      level: level || 'All Levels',
      duration: duration || '10.0 total hours',
      language: 'English',
    };

    INITIAL_COURSES.unshift(newCourse);

    return NextResponse.json({
      success: true,
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();
    const index = INITIAL_COURSES.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    if (action === 'reset_reports') {
      INITIAL_COURSES[index].report_count = 0;
      INITIAL_COURSES[index].is_expired = false;
    } else if (action === 'expire') {
      INITIAL_COURSES[index].is_expired = true;
    } else if (action === 'unexpire') {
      INITIAL_COURSES[index].is_expired = false;
      INITIAL_COURSES[index].report_count = 0;
      INITIAL_COURSES[index].expires_at = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
    } else if (action === 'toggle_featured') {
      INITIAL_COURSES[index].is_featured = !INITIAL_COURSES[index].is_featured;
    }

    return NextResponse.json({
      success: true,
      course: INITIAL_COURSES[index],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const index = INITIAL_COURSES.findIndex((c) => c.id === id);
    if (index !== -1) {
      INITIAL_COURSES.splice(index, 1);
    }

    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}
